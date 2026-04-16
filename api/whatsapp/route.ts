// GET /api/whatsapp — Twilio webhook verification
// POST /api/whatsapp — incoming WhatsApp message handler (multi-track)
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import WhatsAppSession from '@/models/WhatsAppSession'
import User from '@/models/User'
import Activity from '@/models/Activity'
import { WA_COURSES, WA_RESPONSES } from '@/lib/whatsappCurriculum'

// Track selection map: number → course id
const COURSE_MAP: Record<string, string> = {
  '1': 'ai-foundations',
  '2': 'ai-business',
  '3': 'whatsapp-automation',
  '4': 'ai-creator',
  '5': 'ai-builder',
  '6': 'ai-career',
}

// Helper: get lessons array for a session's current course
function getLessons(courseId: string) {
  return WA_COURSES[courseId]?.lessons ?? []
}

// ─── Twilio verification ───────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const challenge = searchParams.get('hub.challenge')
  if (challenge) return new NextResponse(challenge, { status: 200 })
  return NextResponse.json({ status: 'WhatsApp webhook active — 6 tracks, 32 lessons' })
}

// ─── Message handler ──────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const from = formData.get('From')?.toString() || ''
    const body = formData.get('Body')?.toString().trim() || ''

    if (!from || !body) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const waId = from.replace('whatsapp:', '')
    const msg = body.toUpperCase()

    await connectDB()

    let session = await WhatsAppSession.findOne({ waId })
    if (!session) {
      session = await WhatsAppSession.create({ phone: waId, waId })
    }

    session.lastUserMessage = body
    session.messageCount += 1
    session.lastMessageAt = new Date()

    let replyText = ''

    // ── ONBOARDING FLOW ──────────────────────────────────────────────────
    if (!session.isOnboarded) {
      if (!session.name) {
        if (msg === 'START' || msg === 'HI' || msg === 'HELLO' || msg === 'BEGIN' || session.messageCount === 1) {
          replyText = WA_RESPONSES.welcome()
        } else {
          session.name = body.trim()
          replyText = WA_RESPONSES.askCountry(session.name)
        }
      } else if (!session.country) {
        session.country = body.trim()
        session.isOnboarded = true
        // Show course selection menu
        replyText = WA_RESPONSES.courseMenu(session.name!, session.country)
      }
    }

    // ── COURSE SELECTION ─────────────────────────────────────────────────
    else if (!session.currentCourse || msg === 'COURSES' || msg === 'TRACKS') {
      const courseId = COURSE_MAP[msg.trim()]
      if (courseId) {
        const course = WA_COURSES[courseId]
        session.currentCourse = courseId
        session.currentLesson = 0
        session.completedLessons = []
        session.awaitingAnswer = false
        session.status = 'active'
        replyText = WA_RESPONSES.courseIntro(course.title, course.lessons.length)

        // Auto-send first lesson
        const firstLesson = course.lessons[0]
        if (firstLesson) {
          replyText += '\n\n━━━━━━━━━━━━━━━━━━━━\n\n' + firstLesson.content
          if (firstLesson.quiz) {
            replyText += `\n\n❓ *Quick Quiz:*\n${firstLesson.quiz.question}\n\n${firstLesson.quiz.options.join('\n')}\n\nReply A, B, C or D 👇`
            session.awaitingAnswer = true
            session.currentQuestion = firstLesson.quiz.question
          }
        }
      } else {
        // Show course menu
        replyText = WA_RESPONSES.courseMenu(session.name || 'friend', session.country || 'Africa')
      }
    }

    // ── QUIZ ANSWER ──────────────────────────────────────────────────────
    else if (session.awaitingAnswer && session.currentQuestion) {
      const lessons = getLessons(session.currentCourse)
      const lesson = lessons[session.currentLesson]
      const quiz = lesson?.quiz

      if (quiz) {
        const optionMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 }
        const answerIdx = optionMap[msg.charAt(0)]
        const isCorrect = answerIdx === quiz.correct

        if (isCorrect) {
          session.xpEarned += lesson.xp
          session.quizStreak += 1
          replyText = WA_RESPONSES.correct(lesson.xp, session.quizStreak)
        } else {
          session.quizStreak = 0
          const correctLetter = ['A', 'B', 'C', 'D'][quiz.correct]
          replyText = WA_RESPONSES.wrong(`${correctLetter}) ${quiz.options[quiz.correct]}`, quiz.explanation)
        }

        session.awaitingAnswer = false
        session.completedLessons.push(session.currentLesson)
        const seen = new Set<number>()
        session.completedLessons = session.completedLessons.filter((n: number) => {
          if (seen.has(n)) return false
          seen.add(n)
          return true
        })

        // Check if track complete
        if (session.completedLessons.length >= lessons.length) {
          const courseData = WA_COURSES[session.currentCourse]
          session.status = 'completed'
          replyText += '\n\n' + WA_RESPONSES.completed(
            session.name || 'friend',
            courseData.title,
            session.xpEarned
          )

          // Award XP to linked user
          if (session.user) {
            await User.findByIdAndUpdate(session.user, { $inc: { xp: session.xpEarned } })
            await Activity.create({
              user: session.user,
              type: 'course_complete',
              title: `WhatsApp Academy: ${courseData.title}`,
              description: `Completed WhatsApp track: ${courseData.title}`,
              xpAwarded: session.xpEarned,
            })
          }
        }
      } else {
        replyText = WA_RESPONSES.unknown()
      }
    }

    // ── COMMANDS ──────────────────────────────────────────────────────────
    else {
      const lessons = getLessons(session.currentCourse)

      if (msg === 'START' || msg === 'NEXT') {
        if (msg === 'NEXT' && !session.awaitingAnswer) {
          const nextIdx = session.currentLesson + 1
          if (nextIdx < lessons.length) {
            session.currentLesson = nextIdx
          } else {
            // Track finished
            const courseData = WA_COURSES[session.currentCourse]
            session.status = 'completed'
            replyText = WA_RESPONSES.completed(
              session.name || 'friend',
              courseData.title,
              session.xpEarned
            )

            if (session.user) {
              await User.findByIdAndUpdate(session.user, { $inc: { xp: session.xpEarned } })
              await Activity.create({
                user: session.user,
                type: 'course_complete',
                title: `WhatsApp Academy: ${courseData.title}`,
                description: `Completed WhatsApp track: ${courseData.title}`,
                xpAwarded: session.xpEarned,
              })
            }

            session.lastBotMessage = replyText
            await session.save()
            return twimlResponse(replyText)
          }
        }

        const lesson = lessons[session.currentLesson]
        if (lesson) {
          replyText = lesson.content
          if (lesson.quiz) {
            replyText += `\n\n❓ *Quick Quiz:*\n${lesson.quiz.question}\n\n${lesson.quiz.options.join('\n')}\n\nReply A, B, C or D 👇`
            session.awaitingAnswer = true
            session.currentQuestion = lesson.quiz.question
          }
        } else {
          replyText = WA_RESPONSES.unknown()
        }

      } else if (msg === 'REPEAT') {
        const lesson = lessons[session.currentLesson]
        replyText = lesson?.content || WA_RESPONSES.unknown()

      } else if (msg === 'PROGRESS') {
        const courseData = WA_COURSES[session.currentCourse]
        replyText = WA_RESPONSES.progress(
          session.name || 'Learner',
          courseData.title,
          session.completedLessons.length,
          lessons.length,
          session.xpEarned,
          session.quizStreak
        )

      } else if (msg === 'HELP' || msg === 'MENU') {
        replyText = WA_RESPONSES.menu()

      } else if (msg === 'STOP' || msg === 'PAUSE') {
        session.status = 'paused'
        replyText = `⏸ Learning paused. Reply *START* anytime to continue where you left off.\n\nSee you soon! 👋`

      } else if (msg === 'CERTIFICATE' || msg === 'CERT') {
        if (session.status === 'completed') {
          const courseData = WA_COURSES[session.currentCourse]
          replyText = `🏆 *Your Certificate*\n\n📜 Track: ${courseData.title}\n✅ Status: Completed\n💪 XP: ${session.xpEarned}\n\n🔗 Download from your dashboard at afriflowai.com/dashboard\n\nReply *COURSES* to start another track! 🚀`
        } else {
          const remaining = getLessons(session.currentCourse).length - session.completedLessons.length
          replyText = `📚 You haven't completed this track yet.\n\n${remaining} lesson${remaining === 1 ? '' : 's'} remaining.\n\nReply *NEXT* to continue! 💪`
        }

      } else {
        replyText = WA_RESPONSES.unknown()
      }
    }

    session.lastBotMessage = replyText
    await session.save()

    return twimlResponse(replyText)
  } catch (err) {
    console.error('POST /api/whatsapp:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// ─── TwiML helper ─────────────────────────────────────────────────────────
function twimlResponse(text: string) {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n  <Message><Body>${escaped}</Body></Message>\n</Response>`
  return new NextResponse(twiml, {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  })
}

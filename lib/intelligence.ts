/**
 * AfriFlow Intelligence Layer — System 7
 * Adaptive learning engine that personalizes the platform for every user.
 */

import connectDB from '@/lib/mongodb'
import LearningEvent, { CoachQueryCategory } from '@/models/LearningEvent'
import User from '@/models/User'
import Course from '@/models/Course'
import Enrollment from '@/models/Enrollment'

// ─── In-process cache (cleared on server restart; fine for edge use) ─────────
const CACHE = new Map<string, { data: unknown; expiresAt: number }>()

function cacheGet<T>(key: string): T | null {
  const entry = CACHE.get(key)
  if (!entry || Date.now() > entry.expiresAt) return null
  return entry.data as T
}

function cacheSet(key: string, data: unknown, ttlSeconds: number) {
  CACHE.set(key, { data, expiresAt: Date.now() + ttlSeconds * 1000 })
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserLearningProfile {
  strongTopics: string[]
  weakTopics: string[]
  preferredSessionMinutes: number
  mostActiveHour: number          // 0–23
  preferredDevice: 'mobile' | 'desktop' | 'tablet'
  averageQuizScore: number        // 0–100
  completionRate: number          // 0–1
  totalLessonsCompleted: number
  totalLearningSeconds: number
}

export interface PersonalizedPath {
  userId: string
  recommendedLessons: RecommendedLesson[]
  profile: UserLearningProfile
  generatedAt: string
}

export interface RecommendedLesson {
  courseId: string
  courseTitle: string
  courseSlug: string
  lessonId: string
  lessonTitle: string
  reason: string
  priorityScore: number
}

export interface AdaptiveQuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  difficulty: 'easy' | 'medium' | 'hard'
  topic: string
  explanation: string
}

export interface AdaptiveQuiz {
  courseId: string
  userId: string
  questions: AdaptiveQuizQuestion[]
  focusAreas: string[]
  generatedAt: string
}

export interface DropoffRisk {
  userId: string
  riskScore: number        // 0–100
  riskLevel: 'low' | 'medium' | 'high'
  factors: string[]
  suggestedMessage: string
  lastCourseName: string
  lastCourseSlug: string
  daysSinceLastLogin: number
}

export interface WeeklyInsight {
  userId: string
  userName: string
  userEmail: string
  lessonsCompleted: number
  xpEarned: number
  currentStreak: number
  skillsProgressed: string[]
  suggestedChallenge: string
  matchingJobs: number
  generatedAt: string
}

// ─── FUNCTION 1: getPersonalizedLearningPath ─────────────────────────────────

export async function getPersonalizedLearningPath(userId: string): Promise<PersonalizedPath> {
  const cacheKey = `path:${userId}`
  const cached = cacheGet<PersonalizedPath>(cacheKey)
  if (cached) return cached

  await connectDB()

  // Pull last 200 events for this user
  const events = await LearningEvent.find({ userId })
    .sort({ createdAt: -1 })
    .limit(200)
    .lean()

  // Pull user's enrolled courses
  const user = await User.findById(userId).lean() as {
    name?: string
    country?: string
    completedLessons?: string[]
    enrolledCourses?: unknown[]
  } | null

  const completedLessons = new Set<string>(user?.completedLessons ?? [])

  // Analyse learning profile
  const completedEvents = events.filter(e => e.eventType === 'lesson_completed')
  const abandonedEvents = events.filter(e => e.eventType === 'lesson_abandoned')
  const quizPassEvents  = events.filter(e => e.eventType === 'quiz_passed')
  const quizFailEvents  = events.filter(e => e.eventType === 'quiz_failed')

  // Session length preference (median of completed lessons' timeSpent)
  const sessionTimes = completedEvents
    .map(e => e.metadata?.timeSpent ?? 0)
    .filter(t => t > 0)
    .sort((a, b) => a - b)
  const medianSession = sessionTimes.length
    ? sessionTimes[Math.floor(sessionTimes.length / 2)]
    : 1200 // default 20 min
  const preferredSessionMinutes = Math.round(medianSession / 60)

  // Most active hour
  const hourCounts: Record<number, number> = {}
  for (const e of completedEvents) {
    const h = new Date(e.createdAt).getUTCHours()
    hourCounts[h] = (hourCounts[h] ?? 0) + 1
  }
  const mostActiveHour = Object.keys(hourCounts).length
    ? Number(Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0][0])
    : 9

  // Device preference
  const deviceCounts: Record<string, number> = {}
  for (const e of events) {
    const d = e.deviceType ?? 'desktop'
    deviceCounts[d] = (deviceCounts[d] ?? 0) + 1
  }
  const preferredDevice = (Object.entries(deviceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'desktop') as 'mobile' | 'desktop' | 'tablet'

  // Quiz score
  const totalQuizAttempts = quizPassEvents.length + quizFailEvents.length
  const averageQuizScore = totalQuizAttempts > 0
    ? Math.round((quizPassEvents.length / totalQuizAttempts) * 100)
    : 0

  // Completion rate
  const startedLessonIds = new Set(events.filter(e => e.eventType === 'lesson_started').map(e => e.lessonId))
  const completionRate = startedLessonIds.size > 0
    ? completedEvents.length / startedLessonIds.size
    : 0

  // Topic affinity: look at courseIds from completed vs abandoned
  const completedCourseIds = completedEvents.map(e => String(e.courseId)).filter(Boolean)
  const abandonedCourseIds = abandonedEvents.map(e => String(e.courseId)).filter(Boolean)

  const completedSet = new Set(completedCourseIds)
  const strongTopics: string[] = []
  const weakTopics: string[] = []

  // Pull course data for topics
  const relevantCourseIds = Array.from(new Set([...completedCourseIds, ...abandonedCourseIds]))
  if (relevantCourseIds.length > 0) {
    const courses = await Course.find({ _id: { $in: relevantCourseIds } })
      .select('_id category school tags')
      .lean() as unknown as Array<{ _id: unknown; category: string; school: string; tags?: string[] }>

    const courseMap = new Map(courses.map(c => [String(c._id), c]))

    const completedTopics: Record<string, number> = {}
    const abandonedTopics: Record<string, number> = {}

    for (const cid of completedCourseIds) {
      const c = courseMap.get(cid)
      if (c) completedTopics[c.category] = (completedTopics[c.category] ?? 0) + 1
    }
    for (const cid of abandonedCourseIds) {
      const c = courseMap.get(cid)
      if (c) abandonedTopics[c.category] = (abandonedTopics[c.category] ?? 0) + 1
    }

    strongTopics.push(...Object.entries(completedTopics).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]))
    weakTopics.push(...Object.entries(abandonedTopics).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]))
  }

  const profile: UserLearningProfile = {
    strongTopics,
    weakTopics,
    preferredSessionMinutes,
    mostActiveHour,
    preferredDevice,
    averageQuizScore,
    completionRate,
    totalLessonsCompleted: completedEvents.length,
    totalLearningSeconds: sessionTimes.reduce((a, b) => a + b, 0),
  }

  // Recommend next lessons: find published courses the user is enrolled in
  // but hasn't completed all lessons for. Prioritize weak areas then strong.
  const allCourses = await Course.find({ isPublished: true })
    .select('_id title slug category school lessons tags toolsCovered')
    .lean() as unknown as Array<{
      _id: unknown
      title: string
      slug: string
      category: string
      school: string
      lessons: Array<{ _id: { toString(): string }; title: string; order: number }>
      tags?: string[]
      toolsCovered?: string[]
    }>

  const recommendedLessons: RecommendedLesson[] = []

  for (const course of allCourses) {
    if (recommendedLessons.length >= 5) break
    const courseIdStr = String(course._id)

    for (const lesson of (course.lessons ?? [])) {
      if (recommendedLessons.length >= 5) break
      const lessonIdStr = lesson._id.toString()
      if (completedLessons.has(lessonIdStr)) continue

      // Score: higher if weak area, lower if already a strong area
      let priorityScore = 50
      if (weakTopics.includes(course.category)) priorityScore += 30
      else if (strongTopics.includes(course.category)) priorityScore += 10
      else priorityScore += 20

      // Prefer shorter lessons if short-session learner
      const isStarted = completedSet.has(courseIdStr)
      if (isStarted) priorityScore += 15  // resume in-progress course

      let reason = 'Recommended based on your learning history'
      if (weakTopics.includes(course.category)) reason = `Strengthen your ${course.category} skills`
      else if (isStarted) reason = `Continue where you left off in ${course.title}`
      else if (strongTopics.includes(course.category)) reason = `Build on your ${course.category} foundation`

      recommendedLessons.push({
        courseId: courseIdStr,
        courseTitle: course.title,
        courseSlug: course.slug,
        lessonId: lessonIdStr,
        lessonTitle: lesson.title,
        reason,
        priorityScore,
      })
    }
  }

  recommendedLessons.sort((a, b) => b.priorityScore - a.priorityScore)

  const result: PersonalizedPath = {
    userId,
    recommendedLessons: recommendedLessons.slice(0, 5),
    profile,
    generatedAt: new Date().toISOString(),
  }

  cacheSet(cacheKey, result, 86400) // cache 24 hours
  return result
}

// ─── FUNCTION 2: getAdaptiveQuiz ──────────────────────────────────────────────

// Question bank keyed by topic/category
const QUESTION_BANK: Record<string, AdaptiveQuizQuestion[]> = {
  'AI Basics': [
    {
      id: 'ai-1', question: 'What does LLM stand for?',
      options: ['Large Language Model', 'Low-Level Machine', 'Layered Logic Module', 'Linguistic Learning Method'],
      correctIndex: 0, difficulty: 'easy', topic: 'AI Basics',
      explanation: 'LLM = Large Language Model — the architecture behind ChatGPT, Claude, and Gemini.',
    },
    {
      id: 'ai-2', question: 'Which of these is NOT a generative AI tool?',
      options: ['ChatGPT', 'Midjourney', 'Google Sheets', 'Claude'],
      correctIndex: 2, difficulty: 'easy', topic: 'AI Basics',
      explanation: 'Google Sheets is a spreadsheet tool, not a generative AI.',
    },
    {
      id: 'ai-3', question: 'What is "prompt engineering"?',
      options: [
        'Writing code for AI models',
        'Crafting inputs to get better outputs from AI',
        'Building AI hardware',
        'Training neural networks',
      ],
      correctIndex: 1, difficulty: 'medium', topic: 'AI Basics',
      explanation: 'Prompt engineering is the skill of crafting effective instructions for AI models.',
    },
    {
      id: 'ai-4', question: 'What is hallucination in the context of AI?',
      options: [
        'When AI generates images',
        'When AI confidently states incorrect information',
        'When AI refuses to answer',
        'When AI processes visual data',
      ],
      correctIndex: 1, difficulty: 'medium', topic: 'AI Basics',
      explanation: 'AI hallucination = when a model generates plausible-sounding but factually incorrect output.',
    },
    {
      id: 'ai-5', question: 'Which technique helps reduce AI hallucinations by grounding responses in documents?',
      options: ['Fine-tuning', 'RAG (Retrieval-Augmented Generation)', 'RLHF', 'Zero-shot prompting'],
      correctIndex: 1, difficulty: 'hard', topic: 'AI Basics',
      explanation: 'RAG retrieves relevant documents and includes them as context, reducing hallucinations.',
    },
  ],
  'Automation': [
    {
      id: 'auto-1', question: 'What is a "trigger" in a Zapier or Make workflow?',
      options: ['The last step in the automation', 'The event that starts the workflow', 'A conditional branch', 'An API call'],
      correctIndex: 1, difficulty: 'easy', topic: 'Automation',
      explanation: 'A trigger is the event (e.g. new email, new form submission) that starts the automation.',
    },
    {
      id: 'auto-2', question: 'What does an API webhook do?',
      options: [
        'Stores data in a database',
        'Sends an HTTP request when an event happens',
        'Schedules recurring tasks',
        'Encrypts data in transit',
      ],
      correctIndex: 1, difficulty: 'medium', topic: 'Automation',
      explanation: 'A webhook is an HTTP callback — it pushes data to a URL when a specific event occurs.',
    },
    {
      id: 'auto-3', question: 'Which tool is best for connecting apps without writing code?',
      options: ['Docker', 'Zapier', 'Git', 'Node.js'],
      correctIndex: 1, difficulty: 'easy', topic: 'Automation',
      explanation: 'Zapier (and Make) let you connect 6000+ apps visually without any coding.',
    },
    {
      id: 'auto-4', question: 'What is the difference between Zapier Zaps and Make Scenarios?',
      options: [
        'Zaps are free, scenarios are paid',
        'Zaps are linear, scenarios support complex branching',
        'Scenarios only work with Google apps',
        'Zaps use AI, scenarios do not',
      ],
      correctIndex: 1, difficulty: 'hard', topic: 'Automation',
      explanation: 'Zaps are linear workflows; Make scenarios support complex routers, iterators, and error handling.',
    },
  ],
  'Business': [
    {
      id: 'biz-1', question: 'What is an AI use case with the fastest ROI for small businesses?',
      options: ['Training custom ML models', 'Automating customer follow-up emails', 'Building a mobile app', 'Setting up a data warehouse'],
      correctIndex: 1, difficulty: 'easy', topic: 'Business',
      explanation: 'Automating follow-up emails typically delivers immediate ROI with minimal setup cost.',
    },
    {
      id: 'biz-2', question: 'What is the primary benefit of AI-powered invoice processing?',
      options: ['Faster GPU computing', 'Reduced manual data entry errors and time', 'Larger file storage', 'Faster internet speeds'],
      correctIndex: 1, difficulty: 'medium', topic: 'Business',
      explanation: 'AI can extract data from invoices automatically, eliminating manual entry and errors.',
    },
  ],
}

const FALLBACK_QUESTIONS: AdaptiveQuizQuestion[] = [
  {
    id: 'gen-1', question: 'What does "AI" stand for?',
    options: ['Automated Intelligence', 'Artificial Intelligence', 'Advanced Integration', 'Automated Integration'],
    correctIndex: 1, difficulty: 'easy', topic: 'General',
    explanation: 'AI stands for Artificial Intelligence.',
  },
  {
    id: 'gen-2', question: 'Which of these is a common AI model provider?',
    options: ['Stripe', 'OpenAI', 'Shopify', 'Notion'],
    correctIndex: 1, difficulty: 'easy', topic: 'General',
    explanation: 'OpenAI builds GPT-4 and ChatGPT.',
  },
  {
    id: 'gen-3', question: 'What does fine-tuning an AI model mean?',
    options: [
      'Adjusting image resolution',
      'Training a pre-trained model further on specific data',
      'Compressing a model for mobile',
      'Converting a model to a different programming language',
    ],
    correctIndex: 1, difficulty: 'medium', topic: 'General',
    explanation: 'Fine-tuning adapts a general-purpose model to a specific domain using new training examples.',
  },
]

export async function getAdaptiveQuiz(courseId: string, userId: string): Promise<AdaptiveQuiz> {
  await connectDB()

  // Pull course to get its category
  const course = await Course.findById(courseId).select('category title').lean() as { category?: string; title?: string } | null
  const category = course?.category ?? 'AI Basics'

  // Pull user's quiz history for this course
  const quizEvents = await LearningEvent.find({
    userId,
    courseId,
    eventType: { $in: ['quiz_passed', 'quiz_failed'] },
  }).lean()

  const failedCount = quizEvents.filter(e => e.eventType === 'quiz_failed').length
  const passedCount = quizEvents.filter(e => e.eventType === 'quiz_passed').length

  // Determine difficulty skew based on performance
  let difficultyWeight: Record<string, number> = { easy: 1, medium: 2, hard: 1 }
  if (failedCount > passedCount) {
    // Struggling — more easy/medium
    difficultyWeight = { easy: 3, medium: 2, hard: 1 }
  } else if (passedCount > 2 && failedCount === 0) {
    // Acing it — push harder
    difficultyWeight = { easy: 1, medium: 2, hard: 3 }
  }

  // Get questions for this category
  const pool = QUESTION_BANK[category] ?? FALLBACK_QUESTIONS

  // Weighted selection
  const weighted: AdaptiveQuizQuestion[] = []
  for (const q of pool) {
    const weight = difficultyWeight[q.difficulty] ?? 1
    for (let i = 0; i < weight; i++) weighted.push(q)
  }

  // Pick 5 unique questions (shuffle + deduplicate)
  const shuffled = weighted.sort(() => Math.random() - 0.5)
  const seen = new Set<string>()
  const selected: AdaptiveQuizQuestion[] = []
  for (const q of shuffled) {
    if (!seen.has(q.id) && selected.length < 5) {
      seen.add(q.id)
      selected.push(q)
    }
  }

  // If we don't have 5 yet, pad with fallbacks
  for (const q of FALLBACK_QUESTIONS) {
    if (selected.length >= 5) break
    if (!seen.has(q.id)) {
      seen.add(q.id)
      selected.push(q)
    }
  }

  const focusAreas = failedCount > 0 ? ['Review previous weak areas', category] : [category]

  return {
    courseId,
    userId,
    questions: selected,
    focusAreas,
    generatedAt: new Date().toISOString(),
  }
}

// ─── FUNCTION 3: predictDropoffRisk ──────────────────────────────────────────

export async function predictDropoffRisk(userId: string): Promise<DropoffRisk> {
  await connectDB()

  const user = await User.findById(userId)
    .select('lastActive name email enrolledCourses completedLessons streak')
    .lean() as {
      lastActive?: Date
      name?: string
      email?: string
      enrolledCourses?: unknown[]
      completedLessons?: string[]
      streak?: number
    } | null

  const now = Date.now()
  const lastActive = user?.lastActive ? new Date(user.lastActive).getTime() : now - 86400000 * 30
  const daysSinceLastLogin = Math.floor((now - lastActive) / 86400000)

  // Get lesson events over last 30 days
  const thirtyDaysAgo = new Date(now - 86400000 * 30)
  const recentEvents = await LearningEvent.find({
    userId,
    createdAt: { $gte: thirtyDaysAgo },
  }).lean()

  const recentCompletions = recentEvents.filter(e => e.eventType === 'lesson_completed').length
  const recentAbandons    = recentEvents.filter(e => e.eventType === 'lesson_abandoned').length
  const recentCoachUse    = recentEvents.filter(e => e.eventType === 'coach_query').length

  // Get last enrolled course
  const lastEnrollmentEvent = await LearningEvent.findOne({ userId, courseId: { $exists: true } })
    .sort({ createdAt: -1 })
    .lean() as { courseId?: unknown } | null

  let lastCourseName = 'your last course'
  let lastCourseSlug = 'courses'
  if (lastEnrollmentEvent?.courseId) {
    const c = await Course.findById(lastEnrollmentEvent.courseId).select('title slug').lean() as { title?: string; slug?: string } | null
    if (c) {
      lastCourseName = c.title ?? lastCourseName
      lastCourseSlug = c.slug ?? lastCourseSlug
    }
  }

  // Score calculation
  const factors: string[] = []
  let riskScore = 0

  if (daysSinceLastLogin >= 14) { riskScore += 40; factors.push(`${daysSinceLastLogin} days inactive`) }
  else if (daysSinceLastLogin >= 7)  { riskScore += 20; factors.push(`${daysSinceLastLogin} days since last login`) }

  const completionRate = recentCompletions + recentAbandons > 0
    ? recentCompletions / (recentCompletions + recentAbandons)
    : 0.5
  if (completionRate < 0.3) { riskScore += 25; factors.push('Low lesson completion rate') }
  else if (completionRate < 0.6) { riskScore += 10; factors.push('Below-average completion rate') }

  if ((user?.streak ?? 0) === 0) { riskScore += 15; factors.push('No active streak') }

  if (recentCoachUse === 0 && daysSinceLastLogin > 3) {
    riskScore += 10; factors.push('Not using AfriAI Coach')
  }

  if (recentCompletions === 0 && recentAbandons > 2) {
    riskScore += 10; factors.push('Recent abandonment pattern')
  }

  const riskLevel: DropoffRisk['riskLevel'] =
    riskScore >= 60 ? 'high' : riskScore >= 30 ? 'medium' : 'low'

  // Personalised re-engagement message
  const progressPct = recentCompletions > 0
    ? `You completed ${recentCompletions} lesson${recentCompletions !== 1 ? 's' : ''} this month.`
    : ''

  const suggestedMessage = riskLevel === 'high'
    ? `${user?.name ?? 'Hey'} 👋 You were making great progress in "${lastCourseName}". Come back and finish it — skills that pay bills are waiting! ${progressPct}`
    : `${user?.name ?? 'Hey'} 👋 Quick check-in — your AI skills are waiting for you in "${lastCourseName}". Just 15 minutes today keeps your streak alive!`

  return {
    userId,
    riskScore: Math.min(riskScore, 100),
    riskLevel,
    factors,
    suggestedMessage,
    lastCourseName,
    lastCourseSlug,
    daysSinceLastLogin,
  }
}

// ─── FUNCTION 4: categorizeCoachQuery ────────────────────────────────────────

export function categorizeCoachQuery(query: string): CoachQueryCategory {
  const q = query.toLowerCase()

  const patterns: Array<[CoachQueryCategory, string[]]> = [
    ['tool_help',          ['how to use', 'how do i use', 'chatgpt', 'claude', 'zapier', 'make', 'midjourney', 'how does', 'tutorial', 'show me how', 'can\'t figure out']],
    ['career_advice',      ['get a job', 'career', 'salary', 'hire', 'hired', 'resume', 'cv', 'interview', 'apply for', 'job opportunity', 'freelance', 'income', 'find work']],
    ['business_problem',   ['my business', 'customer', 'revenue', 'automate my', 'save time', 'whatsapp bot', 'invoice', 'client', 'sales', 'marketing', 'small business', 'sme']],
    ['technical_question', ['api', 'code', 'error', 'bug', 'integrate', 'webhook', 'json', 'python', 'javascript', 'database', 'server', 'debug', 'not working']],
    ['pricing_question',   ['how much', 'cost', 'price', 'pricing', 'free plan', 'premium', 'subscription', 'pay', 'afford', 'upgrade', 'discount']],
    ['motivation',         ['give up', 'too hard', 'don\'t understand', 'confused', 'overwhelmed', 'worth it', 'should i', 'motivate', 'encourage', 'stuck', 'lost']],
  ]

  for (const [category, keywords] of patterns) {
    if (keywords.some(kw => q.includes(kw))) return category
  }

  return 'other'
}

// ─── FUNCTION 5: generateWeeklyInsightEmail ───────────────────────────────────

export async function generateWeeklyInsightEmail(userId: string): Promise<WeeklyInsight | null> {
  await connectDB()

  const user = await User.findById(userId)
    .select('name email xp streak completedLessons')
    .lean() as { name?: string; email?: string; xp?: number; streak?: number; completedLessons?: string[] } | null

  if (!user?.email) return null

  const oneWeekAgo = new Date(Date.now() - 86400000 * 7)

  // Lessons completed this week
  const weekEvents = await LearningEvent.find({
    userId,
    eventType: 'lesson_completed',
    createdAt: { $gte: oneWeekAgo },
  }).lean()

  const lessonsCompleted = weekEvents.length

  // XP this week (approximate: 50 XP per lesson)
  const xpEarned = lessonsCompleted * 50

  // Skills progressed — find categories of courses completed this week
  const courseIds = Array.from(new Set(weekEvents.map(e => (e as unknown as { courseId?: { toString(): string } }).courseId?.toString()).filter((v): v is string => Boolean(v))))
  let skillsProgressed: string[] = []
  if (courseIds.length > 0) {
    const courses = await Course.find({ _id: { $in: courseIds } })
      .select('category')
      .lean() as unknown as Array<{ category: string }>
    skillsProgressed = Array.from(new Set(courses.map(c => c.category)))
  }

  // Personalised challenge for next week based on gaps
  const path = await getPersonalizedLearningPath(userId)
  const nextLesson = path.recommendedLessons[0]
  const suggestedChallenge = nextLesson
    ? `This week, complete "${nextLesson.lessonTitle}" in ${nextLesson.courseTitle} — ${nextLesson.reason.toLowerCase()}.`
    : 'Keep your streak alive — aim for at least 3 lessons this week.'

  // Matching jobs count (simple heuristic — count open jobs)
  let matchingJobs = 0
  try {
    const JobListing = (await import('@/models/JobPosting')).default
    matchingJobs = await JobListing.countDocuments({ isActive: true })
  } catch {
    matchingJobs = 0
  }

  return {
    userId,
    userName: user.name ?? 'Learner',
    userEmail: user.email,
    lessonsCompleted,
    xpEarned,
    currentStreak: user.streak ?? 0,
    skillsProgressed,
    suggestedChallenge,
    matchingJobs,
    generatedAt: new Date().toISOString(),
  }
}

// ─── Helper: track a learning event ──────────────────────────────────────────

export async function trackEvent(params: {
  userId: string
  eventType: ILearningEvent['eventType']
  courseId?: string
  lessonId?: string
  metadata?: ILearningEvent['metadata']
  deviceType?: ILearningEvent['deviceType']
  country?: string
  sessionId?: string
}): Promise<void> {
  try {
    await connectDB()
    await LearningEvent.create({
      userId: params.userId,
      eventType: params.eventType,
      courseId: params.courseId,
      lessonId: params.lessonId,
      metadata: params.metadata ?? {},
      deviceType: params.deviceType ?? 'desktop',
      country: params.country ?? 'Unknown',
      sessionId: params.sessionId ?? `session_${Date.now()}`,
    })
    // Invalidate user path cache on completion events
    if (params.eventType === 'lesson_completed' || params.eventType === 'quiz_passed') {
      CACHE.delete(`path:${params.userId}`)
    }
  } catch {
    // Non-blocking — never let tracking crash the main flow
  }
}

// Re-export for convenience in API routes
import type { ILearningEvent } from '@/models/LearningEvent'

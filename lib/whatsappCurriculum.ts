/* ============================================================
   WhatsApp Academy Curriculum — 6 Tracks, 32 Lessons
   Full content for the AfriFlow AI WhatsApp bot
   ============================================================ */

export interface WAQuiz {
  question: string
  options: string[]
  correct: number
  explanation: string
}

export interface WALesson {
  id: number
  title: string
  content: string   // WhatsApp-formatted: *bold*, _italic_, bullet points
  quiz?: WAQuiz
  xp: number
  nextPrompt: string
}

export interface WACourse {
  id: string
  title: string
  description: string
  lessons: WALesson[]
  totalXP: number
  isFree: boolean
}

/* ============================================================
   TRACK 1: AI FOUNDATIONS (FREE)
   ============================================================ */

const foundationsLessons: WALesson[] = [
  {
    id: 1,
    title: 'What is AI?',
    content: `\u{1f9e0} *Lesson 1: What is AI?*

AI = software that learns from data to make decisions.

Instead of following fixed rules, AI finds patterns:

\u{1f4f1} Your phone recognises your face
\u{1f4b3} Your bank detects fraud in real-time
\u{1f6d2} Jumia recommends products you might like
\u{1f698} Bolt predicts your ride time

*3 Types of AI:*
1. *Narrow AI* \u2014 does one thing well (ChatGPT, face unlock)
2. *General AI* \u2014 human-level thinking (doesn\u2019t exist yet)
3. *Super AI* \u2014 beyond human intelligence (sci-fi for now)

\u{1f525} *In Africa right now:*
\u2022 Fintech fraud detection (Flutterwave, Paystack)
\u2022 AgriTech crop disease prediction (Zenvus)
\u2022 Healthcare diagnosis (mPharma, Babylon)
\u2022 Customer service chatbots (thousands of SMEs)

_The AI opportunity in Africa is massive \u2014 and you\u2019re starting to learn it now._

Reply *NEXT* for the quiz \u{1f447}`,
    quiz: {
      question: '\u{2753} Which type of AI exists today and powers tools like ChatGPT?',
      options: ['A) General AI', 'B) Narrow AI', 'C) Super AI', 'D) Quantum AI'],
      correct: 1,
      explanation: '*Narrow AI* is the only type that exists today. It excels at specific tasks like translation, image recognition, and conversation.',
    },
    xp: 30,
    nextPrompt: 'Great work! Reply *NEXT* for Lesson 2: Machine Learning Decoded \u{1f447}',
  },
  {
    id: 2,
    title: 'Machine Learning Decoded',
    content: `\u{1f9e0} *Lesson 2: Machine Learning Decoded*

Machine Learning (ML) = teaching computers by showing examples, not writing rules.

*Traditional Programming:*
Rules + Data \u2192 Answer

*Machine Learning:*
Data + Answers \u2192 Rules (the machine figures out the rules!)

*Real African example:*
A Nigerian bank wants to detect fraud.

_Traditional:_ Write 1,000 if-then rules manually
_ML:_ Show the system 100,000 transactions labelled "fraud" or "legit" \u2014 it learns the patterns itself

*3 Types of ML:*
1. *Supervised Learning* \u2014 you provide labelled examples (spam/not spam)
2. *Unsupervised Learning* \u2014 finds hidden patterns (customer segments)
3. *Reinforcement Learning* \u2014 learns by trial and error (game AI, robotics)

*Deep Learning* = ML with many layers (neural networks)
\u2022 Powers: ChatGPT, image generation, voice recognition
\u2022 Needs lots of data + computing power

_Key takeaway: ML lets computers learn from experience, just like humans._

Reply *NEXT* for the quiz \u{1f447}`,
    quiz: {
      question: '\u{2753} In Machine Learning, what do you give the system?',
      options: ['A) Rules only', 'B) Data + desired answers', 'C) Code only', 'D) Nothing'],
      correct: 1,
      explanation: 'In ML, you provide *data + answers* and the machine learns the rules itself. That\u2019s what makes it different from traditional programming!',
    },
    xp: 30,
    nextPrompt: 'You\u2019re doing amazing! Reply *NEXT* for Lesson 3: Prompt Engineering \u{1f447}',
  },
  {
    id: 3,
    title: 'Prompt Engineering',
    content: `\u{1f9e0} *Lesson 3: Prompt Engineering*

A prompt = what you type to an AI. Better prompts = better results.

*The RICE Framework:*
\u{1f33e} *R*ole \u2014 Tell the AI who to be
\u{1f4a1} *I*nstruction \u2014 What you want done
\u{1f3af} *C*ontext \u2014 Background info
\u{1f4cb} *E*xample \u2014 Show what good output looks like

*Bad prompt:*
"Write about my business"

*Great prompt (using RICE):*
"You are an expert African marketing copywriter (*Role*). Write a WhatsApp broadcast message (*Instruction*) for my fashion store in Lagos that sells ankara and ready-to-wear (*Context*). Here\u2019s an example tone: \u2018Hey Queen! Our new ankara collection just dropped \u{1f525}\u2019 (*Example*)"

*5 Power Tips:*
1. Be specific \u2014 "5 bullet points" not "some ideas"
2. Set the format \u2014 "Reply as a table" or "Use emojis"
3. Add constraints \u2014 "Under 100 words" or "In Pidgin English"
4. Iterate \u2014 Say "Make it more casual" or "Add a CTA"
5. Chain prompts \u2014 Build on previous answers

_Prompt engineering is the #1 AI skill. Master this and every AI tool becomes 10x more powerful._

Reply *NEXT* for the quiz \u{1f447}`,
    quiz: {
      question: '\u{2753} What does the "R" in the RICE prompt framework stand for?',
      options: ['A) Result', 'B) Role', 'C) Research', 'D) Response'],
      correct: 1,
      explanation: '*R = Role.* Telling the AI who to be (e.g., "You are an expert copywriter") dramatically improves output quality.',
    },
    xp: 35,
    nextPrompt: 'Awesome! Reply *NEXT* for Lesson 4: Free AI Tools You Can Use Today \u{1f447}',
  },
  {
    id: 4,
    title: 'Free AI Tools',
    content: `\u{1f9e0} *Lesson 4: Free AI Tools You Can Use Today*

You don\u2019t need to code. These tools are free and work from any browser:

*\u{1f4ac} Text & Writing:*
\u2022 *ChatGPT* (chat.openai.com) \u2014 conversations, writing, analysis
\u2022 *Claude* (claude.ai) \u2014 long documents, careful reasoning
\u2022 *Gemini* (gemini.google.com) \u2014 Google integration, real-time info

*\u{1f3a8} Images:*
\u2022 *Canva AI* \u2014 social media graphics with AI
\u2022 *Leonardo AI* \u2014 product photos, marketing visuals
\u2022 *Remove.bg* \u2014 remove image backgrounds instantly

*\u{1f399}\ufe0f Audio & Video:*
\u2022 *ElevenLabs* \u2014 text-to-speech in African accents
\u2022 *Otter.ai* \u2014 transcribe meetings automatically
\u2022 *CapCut* \u2014 AI video editing

*\u{1f4bc} Business:*
\u2022 *Notion AI* \u2014 notes, projects, databases
\u2022 *Gamma* \u2014 AI presentations in minutes
\u2022 *Zapier AI* \u2014 automate workflows between apps

*\u{1f4b0} African-Built AI:*
\u2022 *AfriFlow AI* \u2014 learn + build AI skills
\u2022 *Chipper Cash AI* \u2014 smart payments
\u2022 *Farmz2U* \u2014 AI-powered farm-to-table

_Start with ChatGPT or Claude \u2014 they\u2019re the Swiss Army knives of AI._

Reply *NEXT* for the quiz \u{1f447}`,
    quiz: {
      question: '\u{2753} Which AI tool is best for long document analysis and careful reasoning?',
      options: ['A) Canva AI', 'B) ChatGPT', 'C) Claude', 'D) Remove.bg'],
      correct: 2,
      explanation: '*Claude* by Anthropic is known for handling very long documents and careful, nuanced reasoning. ChatGPT is also excellent for general use.',
    },
    xp: 30,
    nextPrompt: 'Almost done! Reply *NEXT* for the final lesson: AI Opportunities in Africa \u{1f447}',
  },
  {
    id: 5,
    title: 'AI Opportunities in Africa',
    content: `\u{1f9e0} *Lesson 5: AI Opportunities in Africa*

Africa has unique advantages for AI:
\u2022 700M+ mobile users (WhatsApp is #1)
\u2022 Young population eager to learn
\u2022 Problems that AI can uniquely solve
\u2022 Growing tech ecosystem

*\u{1f525} Top AI Opportunities by Sector:*

*1. Fintech* \u{1f4b3}
Fraud detection, credit scoring for the unbanked, automated KYC
_Example: Flutterwave uses ML to detect fraud in real-time_

*2. Agriculture* \u{1f33e}
Crop disease detection from phone photos, weather predictions, market prices
_Example: PlantVillage app helps farmers diagnose crop diseases_

*3. Healthcare* \u{1f3e5}
AI diagnosis where doctors are scarce, drug delivery optimisation
_Example: Zipline drones deliver blood using AI routing in Rwanda_

*4. Education* \u{1f393}
Personalised learning on mobile, automated grading, language translation
_Example: You\u2019re doing it right now on WhatsApp!_

*5. E-commerce* \u{1f6d2}
WhatsApp commerce bots, product recommendations, inventory prediction
_Example: Jumia uses AI to predict what products to stock_

*\u{1f680} AI Career Paths:*
\u2022 AI Consultant ($30-100/hr remote)
\u2022 Prompt Engineer ($50K-150K/year)
\u2022 AI Automation Specialist ($40K-120K/year)
\u2022 Data Analyst with AI skills ($35K-80K/year)

_Congratulations! You\u2019ve completed the AI Foundations track!_

Reply *NEXT* to claim your certificate! \u{1f3c6}`,
    quiz: {
      question: '\u{2753} What gives Africa a unique advantage for AI adoption?',
      options: ['A) Large desktop computer usage', 'B) 700M+ mobile users with WhatsApp', 'C) Unlimited internet bandwidth', 'D) Government AI mandates'],
      correct: 1,
      explanation: 'Africa\u2019s *700M+ mobile-first users* make WhatsApp and mobile AI solutions uniquely powerful here. The future of AI in Africa is mobile.',
    },
    xp: 40,
    nextPrompt: '\u{1f3c6} *Congratulations!* You\u2019ve completed AI Foundations!\n\nYou earned a total of *165 XP*.\n\nYour certificate is ready! \u{1f4e9}\n\nReply *COURSES* to see more tracks or *MENU* for options.',
  },
]

/* ============================================================
   TRACK 2: AI FOR BUSINESS
   ============================================================ */

const businessLessons: WALesson[] = [
  {
    id: 1,
    title: 'AI Customer Service',
    content: `\u{1f4bc} *Lesson 1: AI Customer Service*

80% of customer questions are repetitive. AI handles them instantly.

*What AI Customer Service Looks Like:*
\u2022 Auto-reply to FAQs on WhatsApp
\u2022 24/7 responses (even when you sleep)
\u2022 Handle 100+ conversations simultaneously
\u2022 Escalate complex queries to humans

*Real Example \u2014 Lagos Fashion Store:*
Before AI: Owner spent 4 hours/day answering same questions
After AI: Bot handles "What sizes?", "Do you deliver?", "Price?"
Result: 70% less manual replies, 35% more sales

*Quick Setup (No Code):*
1. List your top 20 customer questions
2. Write clear answers for each
3. Use a WhatsApp Business API tool (Twilio, WATI, or Respond.io)
4. Set up keyword triggers (e.g., "price" \u2192 price list)

*Pro tip:* Always give customers an option to reach a human. Example:
"Reply 0 to speak with our team \u{1f64b}\u200d\u2640\ufe0f"

_AI doesn\u2019t replace your customer service \u2014 it handles the routine so you can focus on the important conversations._

Reply *NEXT* for the quiz \u{1f447}`,
    quiz: {
      question: '\u{2753} What percentage of customer questions are typically repetitive?',
      options: ['A) 20%', 'B) 50%', 'C) 80%', 'D) 95%'],
      correct: 2,
      explanation: 'About *80%* of customer questions are repetitive (FAQs). AI can handle these instantly, freeing you for high-value conversations.',
    },
    xp: 30,
    nextPrompt: 'Reply *NEXT* for Lesson 2: AI Marketing \u{1f447}',
  },
  {
    id: 2,
    title: 'AI Marketing',
    content: `\u{1f4bc} *Lesson 2: AI Marketing That Converts*

AI can create a week\u2019s marketing content in 2 hours.

*5 AI Marketing Superpowers:*

*1. Social Media Content* \u{1f4f1}
Prompt: "Write 7 Instagram captions for an African skincare brand. Use emojis, include a CTA, keep under 150 words"

*2. WhatsApp Broadcasts* \u{1f4e2}
Prompt: "Write a WhatsApp broadcast for a flash sale at my Nairobi shoe store. 30% off this weekend only. Include urgency"

*3. Email Sequences* \u{1f4e7}
Prompt: "Write a 5-email welcome sequence for new customers of my online food delivery in Accra"

*4. Ad Copy* \u{1f4b0}
Prompt: "Write 3 Facebook ad variations for my mobile money agent training program targeting young Nigerians"

*5. Product Descriptions* \u{1f6d2}
Prompt: "Write product descriptions for 10 African fashion items. Make them sound premium but approachable"

*The 3x Content Multiplier:*
1. Create one long post with AI
2. Ask AI to turn it into 5 tweets
3. Ask AI to make it a WhatsApp status
_One idea \u2192 7 pieces of content!_

Reply *NEXT* for the quiz \u{1f447}`,
    quiz: {
      question: '\u{2753} What is the "3x Content Multiplier" strategy?',
      options: ['A) Post the same content 3 times', 'B) Create one piece and repurpose into multiple formats', 'C) Hire 3 content creators', 'D) Use 3 different AI tools'],
      correct: 1,
      explanation: 'The *Content Multiplier* means creating one piece of content and using AI to repurpose it into multiple formats \u2014 blog \u2192 tweets \u2192 WhatsApp status.',
    },
    xp: 30,
    nextPrompt: 'Reply *NEXT* for Lesson 3: AI Finance \u{1f447}',
  },
  {
    id: 3,
    title: 'AI Finance',
    content: `\u{1f4bc} *Lesson 3: AI Finance & Bookkeeping*

Stop doing manual bookkeeping. AI can handle it.

*AI Finance Tasks for African SMEs:*

*1. Automated Invoicing*
\u2022 Generate professional invoices from WhatsApp messages
\u2022 Auto-send payment reminders
\u2022 Track who owes what

*2. Expense Categorisation*
\u2022 Take a photo of a receipt \u2192 AI extracts the info
\u2022 Auto-categorise: transport, food, supplies, rent
\u2022 Monthly expense report generated automatically

*3. Cash Flow Prediction*
\u2022 AI analyses your transaction history
\u2022 Predicts when you\u2019ll run low on cash
\u2022 Suggests when to stock up or hold back

*4. Tax Preparation*
\u2022 Auto-calculate VAT/GST
\u2022 Generate tax-ready reports
\u2022 Track deductible expenses

*Free Tools for African SMEs:*
\u2022 Wave (waveapps.com) \u2014 free invoicing
\u2022 Zoho Books \u2014 AI bookkeeping (free tier)
\u2022 ChatGPT \u2014 "Create a simple P&L for my business" prompt

*Quick Win:*
Send ChatGPT your last month\u2019s transactions and ask it to categorise them and create a summary.

Reply *NEXT* for the quiz \u{1f447}`,
    quiz: {
      question: '\u{2753} What can AI do with a photo of a receipt?',
      options: ['A) Nothing useful', 'B) Extract info and auto-categorise expenses', 'C) Pay the bill', 'D) Delete it'],
      correct: 1,
      explanation: 'AI can *extract text from receipt photos* (OCR), categorise the expense, and add it to your bookkeeping \u2014 no manual data entry needed!',
    },
    xp: 30,
    nextPrompt: 'Reply *NEXT* for Lesson 4: AI Sales \u{1f447}',
  },
  {
    id: 4,
    title: 'AI Sales',
    content: `\u{1f4bc} *Lesson 4: AI Sales & Lead Generation*

AI can find and qualify leads while you focus on closing.

*The AI Sales Funnel:*
1. *Attract* \u2014 AI generates content that brings people in
2. *Capture* \u2014 WhatsApp bot collects contact info
3. *Qualify* \u2014 Bot asks questions to filter serious buyers
4. *Nurture* \u2014 Automated follow-up messages
5. *Close* \u2014 Human takes over for the final sale

*WhatsApp Lead Capture Bot Example:*
Customer: "I\u2019m interested in your product"
Bot: "Great! Let me help you. What are you looking for?"
Bot: "What\u2019s your budget range?"
Bot: "When do you need it?"
Bot: "Let me connect you with our sales team!"
_Bot saved 15 minutes of qualification time_

*AI Lead Scoring:*
\u2022 Responded within 1 hour: +10 points
\u2022 Asked about pricing: +20 points
\u2022 Visited website: +15 points
\u2022 Score > 50: Hot lead \u2014 call immediately!

*Follow-Up Automation:*
Day 1: "Thanks for your interest!"
Day 3: "Here\u2019s what other customers say..."
Day 7: "Special offer for you \u2014 10% off this week"

Reply *NEXT* for the quiz \u{1f447}`,
    quiz: {
      question: '\u{2753} What is the main benefit of an AI sales qualification bot?',
      options: ['A) It replaces salespeople', 'B) It filters serious buyers so humans close high-value deals', 'C) It reduces product quality', 'D) It costs more than human sales'],
      correct: 1,
      explanation: 'AI qualification bots *filter and score leads* so your human sales team focuses only on the most promising prospects. Efficiency goes way up!',
    },
    xp: 30,
    nextPrompt: 'Reply *NEXT* for Lesson 5: AI Operations \u{1f447}',
  },
  {
    id: 5,
    title: 'AI Operations',
    content: `\u{1f4bc} *Lesson 5: AI Operations & Scheduling*

Automate the boring stuff. Focus on growth.

*5 Operations AI Can Handle:*

*1. Inventory Management*
\u2022 Predict when stock will run out
\u2022 Auto-generate purchase orders
\u2022 Track fast/slow-moving items

*2. Appointment Scheduling*
\u2022 Customer books via WhatsApp: "Book me for Tuesday 2pm"
\u2022 Bot checks availability, confirms, sends reminder
\u2022 Auto-reschedule cancellations

*3. Employee Scheduling*
\u2022 AI creates shift schedules based on availability
\u2022 Handles swap requests
\u2022 Ensures coverage

*4. Delivery Optimisation*
\u2022 Best route for multiple deliveries
\u2022 Estimated delivery times
\u2022 Real-time tracking updates to customers

*5. Report Generation*
\u2022 Daily/weekly/monthly reports on autopilot
\u2022 Sales trends, customer patterns
\u2022 Sent to your WhatsApp every Monday morning

*Implementation Priority:*
Start with the task you spend the MOST time on. Automate that first.

Reply *NEXT* for the quiz \u{1f447}`,
    quiz: {
      question: '\u{2753} When implementing AI operations, what should you automate first?',
      options: ['A) The cheapest task', 'B) The task you spend the most time on', 'C) The hardest task', 'D) All tasks at once'],
      correct: 1,
      explanation: 'Start with your *biggest time sink*. If you spend 3 hours/day on scheduling, automate that first for maximum ROI.',
    },
    xp: 30,
    nextPrompt: 'Reply *NEXT* for the final lesson: Build Your AI Business System \u{1f447}',
  },
  {
    id: 6,
    title: 'Build Your AI Business System',
    content: `\u{1f4bc} *Lesson 6: Build Your Complete AI Business System*

Let\u2019s put it all together into a system.

*Your AI Business Stack:*

\u{1f310} *Website/Social \u2192 WhatsApp*
\u2022 Click-to-WhatsApp ads on Facebook/Instagram
\u2022 WhatsApp link on your website
\u2022 QR code in your physical store

\u{1f916} *WhatsApp Bot Layer*
\u2022 FAQ auto-replies (Lesson 1)
\u2022 Lead capture & qualification (Lesson 4)
\u2022 Appointment booking (Lesson 5)

\u{1f4ca} *AI Marketing Engine*
\u2022 Content generation (Lesson 2)
\u2022 Broadcast campaigns
\u2022 Personalised follow-ups

\u{1f4b0} *AI Finance Layer*
\u2022 Automated invoicing (Lesson 3)
\u2022 Payment reminders
\u2022 Expense tracking

*Step-by-Step Setup (This Week):*
\u2705 Day 1: List your top 20 FAQs + answers
\u2705 Day 2: Set up WhatsApp Business API (WATI or Respond.io)
\u2705 Day 3: Create FAQ auto-replies
\u2705 Day 4: Build lead capture flow
\u2705 Day 5: Set up automated follow-ups
\u2705 Day 6: Create your first AI marketing content
\u2705 Day 7: Review and optimise

_You now have the blueprint. Execute this week and you\u2019ll be ahead of 95% of African businesses._

Reply *NEXT* to claim your certificate! \u{1f3c6}`,
    quiz: {
      question: '\u{2753} What\u2019s the recommended first step in building your AI business system?',
      options: ['A) Buy expensive software', 'B) List your top 20 FAQs and answers', 'C) Hire an AI developer', 'D) Wait for AI to improve'],
      correct: 1,
      explanation: 'Start simple: *list your top 20 FAQs*. This is the foundation for your WhatsApp bot and the fastest win you can get.',
    },
    xp: 40,
    nextPrompt: '\u{1f3c6} *Congratulations!* You\u2019ve completed AI for Business!\n\nYou earned *190 XP*.\n\nReply *COURSES* to see more tracks.',
  },
]

/* ============================================================
   TRACK 3: WHATSAPP AUTOMATION
   ============================================================ */

const automationLessons: WALesson[] = [
  {
    id: 1,
    title: 'WhatsApp Business API Setup',
    content: `\u{26a1} *Lesson 1: WhatsApp Business API Setup*

The WhatsApp Business API is your gateway to automation at scale.

*WhatsApp Business App vs API:*

| Feature | App (Free) | API (Pro) |
|---------|-----------|----------|
| Messages | Manual | Automated |
| Scale | 1 device | Unlimited |
| Bots | No | Yes |
| Templates | No | Yes |
| Analytics | Basic | Advanced |

*Top API Providers for Africa:*
1. *WATI* \u2014 Easiest setup, great for beginners ($49/mo)
2. *Respond.io* \u2014 Multi-channel, powerful ($79/mo)
3. *Twilio* \u2014 Developer-friendly, pay-per-message
4. *360dialog* \u2014 Direct Meta partner, cheapest per message

*Setup Steps:*
1. Get a dedicated business phone number
2. Sign up with a provider (start with WATI)
3. Verify your business with Meta
4. Create message templates (need Meta approval)
5. Connect your bot logic

*Costs:*
\u2022 API access: $49-99/month
\u2022 Per conversation: $0.005-0.08 (depends on region)
\u2022 ROI: Most businesses see 3-5x return in month 1

_The API is an investment, not an expense. It pays for itself in saved time._

Reply *NEXT* for the quiz \u{1f447}`,
    quiz: {
      question: '\u{2753} What\u2019s the main advantage of WhatsApp Business API over the free app?',
      options: ['A) It\u2019s cheaper', 'B) It supports automated bots and scales unlimited', 'C) It has a better interface', 'D) It requires no phone number'],
      correct: 1,
      explanation: 'The *API supports automation, bots, and unlimited scale* \u2014 the free app is manual and limited to one device.',
    },
    xp: 30,
    nextPrompt: 'Reply *NEXT* for Lesson 2: Build a FAQ Bot \u{1f447}',
  },
  {
    id: 2,
    title: 'Build: FAQ Auto-Reply Bot',
    content: `\u{26a1} *Lesson 2: Build a FAQ Auto-Reply Bot*

Let\u2019s build your first bot. No coding required.

*Step 1: Collect Your FAQs*
Common categories:
\u2022 Pricing ("How much is...?")
\u2022 Availability ("Do you have...?")
\u2022 Delivery ("Do you deliver to...?")
\u2022 Returns ("Can I return...?")
\u2022 Hours ("When are you open?")

*Step 2: Write Bot Responses*
Keep them:
\u2705 Short (under 200 words)
\u2705 Friendly (use emojis)
\u2705 Action-oriented (end with a next step)
\u2705 Up-to-date (review monthly)

*Step 3: Set Up Keyword Triggers*
Keywords \u2192 Response
"price" or "cost" or "how much" \u2192 Price list
"delivery" or "ship" or "deliver" \u2192 Delivery info
"hours" or "open" or "close" \u2192 Business hours
"return" or "refund" or "exchange" \u2192 Return policy

*Step 4: Add a Menu*
"Hi! Welcome to [Business Name] \u{1f44b}

How can we help?
1. View Products
2. Check Prices
3. Delivery Info
4. Speak to a Human

Reply with a number \u{1f447}"

*Step 5: Test with friends before going live!*

Reply *NEXT* for the quiz \u{1f447}`,
    quiz: {
      question: '\u{2753} What should every bot response end with?',
      options: ['A) A goodbye message', 'B) An action-oriented next step', 'C) An advertisement', 'D) Nothing'],
      correct: 1,
      explanation: 'Every response should end with a *clear next step* \u2014 "Reply 1 to order" or "Send HELP for options". Guide the conversation forward.',
    },
    xp: 35,
    nextPrompt: 'Reply *NEXT* for Lesson 3: Lead Capture Bot \u{1f447}',
  },
  {
    id: 3,
    title: 'Build: Lead Capture Bot',
    content: `\u{26a1} *Lesson 3: Build a Lead Capture Bot*

Turn WhatsApp conversations into qualified leads.

*The Lead Capture Flow:*

Message 1: "Hi! Interested in [product/service]? Let me help you find the right option. What\u2019s your name?"

Message 2: "Nice to meet you, {name}! What are you looking for?"
\u2022 Option A: [Product 1]
\u2022 Option B: [Product 2]
\u2022 Option C: [Custom request]

Message 3: "Great choice! What\u2019s your budget range?"
\u2022 Under $100
\u2022 $100-500
\u2022 $500+

Message 4: "When do you need this by?"
\u2022 This week
\u2022 This month
\u2022 Just browsing

Message 5: "Perfect! Here\u2019s what I recommend: [personalised suggestion]. Our team will reach out within 1 hour. What\u2019s the best number to call?"

*Lead Data Captured:*
\u2705 Name
\u2705 Product interest
\u2705 Budget
\u2705 Timeline
\u2705 Phone number
\u2705 Conversation timestamp

*Store Leads:*
\u2022 Google Sheets (free, via Zapier/Make)
\u2022 HubSpot CRM (free tier)
\u2022 Airtable (free tier)

_A lead bot captures 5x more leads than a static contact page._

Reply *NEXT* for the quiz \u{1f447}`,
    quiz: {
      question: '\u{2753} How many times more leads does a bot capture vs a static contact page?',
      options: ['A) 2x', 'B) 3x', 'C) 5x', 'D) 10x'],
      correct: 2,
      explanation: 'Interactive WhatsApp bots capture approximately *5x more leads* than static contact forms because conversations feel natural and have lower friction.',
    },
    xp: 35,
    nextPrompt: 'Reply *NEXT* for Lesson 4: Order Confirmation System \u{1f447}',
  },
  {
    id: 4,
    title: 'Build: Order Confirmation System',
    content: `\u{26a1} *Lesson 4: Order Confirmation System*

Automated order updates build trust and reduce "where\u2019s my order?" messages by 80%.

*Order Flow Messages:*

*1. Order Received:*
"\u{1f6d2} Order Confirmed!
Order #12345
Items: Ankara Dress (M)
Total: \u{20a6}15,000
Payment: Pending
Expected delivery: 3-5 days

Reply TRACK to track your order"

*2. Payment Confirmed:*
"\u{2705} Payment Received!
Order #12345 is being prepared.
We\u2019ll notify you when it ships."

*3. Shipped:*
"\u{1f4e6} Your order has shipped!
Tracking: DHL-NG-789456
Expected delivery: Tuesday, 2pm
Track: [link]"

*4. Delivered:*
"\u{1f389} Delivered!
We hope you love your Ankara Dress!
Reply REVIEW to leave a review
Reply HELP if there\u2019s an issue"

*Integration with Payment:*
\u2022 Paystack webhook \u2192 triggers "Payment Confirmed"
\u2022 Flutterwave API \u2192 auto-update order status
\u2022 Manual option: Staff clicks a button to advance status

_Automated order updates reduce support tickets by 80% and increase repeat purchases._

Reply *NEXT* for the quiz \u{1f447}`,
    quiz: {
      question: '\u{2753} By how much can automated order updates reduce "where\u2019s my order?" messages?',
      options: ['A) 20%', 'B) 50%', 'C) 80%', 'D) 100%'],
      correct: 2,
      explanation: 'Automated order updates reduce *support tickets by 80%* because customers know exactly what\u2019s happening with their order at every stage.',
    },
    xp: 35,
    nextPrompt: 'Reply *NEXT* for Lesson 5: Appointment Booking Bot \u{1f447}',
  },
  {
    id: 5,
    title: 'Build: Appointment Booking Bot',
    content: `\u{26a1} *Lesson 5: Appointment Booking Bot*

Let customers book appointments via WhatsApp \u2014 24/7.

*The Booking Flow:*

Step 1: "What service do you need?"
\u2022 Haircut
\u2022 Manicure
\u2022 Consultation

Step 2: "Choose a date:"
\u2022 Today
\u2022 Tomorrow
\u2022 This week (pick a day)

Step 3: "Available times for [date]:"
\u2022 9:00 AM
\u2022 11:00 AM
\u2022 2:00 PM
\u2022 4:00 PM

Step 4: "Your booking is confirmed!
\u{1f4c5} Service: Haircut
\u{1f4c6} Date: Tuesday, 14 Jan
\u{23f0} Time: 2:00 PM
\u{1f4cd} Location: [address]

Reply CANCEL to cancel
Reply CHANGE to reschedule"

*Reminders (Automated):*
\u2022 24 hours before: "Reminder: Your haircut is tomorrow at 2pm"
\u2022 2 hours before: "See you in 2 hours!"
\u2022 After: "How was your visit? Rate us 1-5"

*Calendar Integration:*
\u2022 Google Calendar (via Zapier)
\u2022 Calendly (direct integration)
\u2022 Custom spreadsheet

_Appointment bots reduce no-shows by 40% thanks to automated reminders._

Reply *NEXT* for the quiz \u{1f447}`,
    quiz: {
      question: '\u{2753} By how much do automated reminders reduce no-shows?',
      options: ['A) 10%', 'B) 25%', 'C) 40%', 'D) 60%'],
      correct: 2,
      explanation: 'Automated reminders reduce *no-shows by 40%*. That\u2019s money saved and slots freed for other customers.',
    },
    xp: 35,
    nextPrompt: 'Reply *NEXT* for the final lesson: AI-Powered Conversational Bot \u{1f447}',
  },
  {
    id: 6,
    title: 'AI-Powered Conversational Bot',
    content: `\u{26a1} *Lesson 6: AI-Powered Conversational Bot*

Go beyond keyword matching. Build a bot that actually understands conversations.

*Keyword Bot vs AI Bot:*

Keyword: "What\u2019s the price?" \u2192 Price list
AI: "I\u2019m looking for something affordable for my daughter\u2019s birthday" \u2192 Understands intent, suggests budget-friendly options

*How to Add AI to Your Bot:*

*Option 1: OpenAI API (Most Powerful)*
\u2022 Connect ChatGPT to your WhatsApp bot
\u2022 Give it a system prompt about your business
\u2022 It handles natural conversations
\u2022 Cost: ~$0.002 per message

*Option 2: Dialogflow (Google)*
\u2022 Visual conversation builder
\u2022 Good for structured flows
\u2022 Free tier available

*Option 3: Pre-built AI Bots*
\u2022 WATI AI \u2014 built-in AI responses
\u2022 Landbot \u2014 drag-and-drop AI builder
\u2022 ManyChat \u2014 popular for WhatsApp + Instagram

*System Prompt Example:*
"You are a helpful assistant for [Business Name], a fashion store in Lagos. You know our products, prices, delivery areas, and return policy. Be friendly, use emojis, and always offer to connect with a human for complex requests."

*Safety Rails:*
\u2022 Limit responses to business topics
\u2022 Set a fallback: "Let me connect you with our team"
\u2022 Log all conversations for review
\u2022 Test thoroughly before going live

_An AI bot can handle 95% of conversations. The remaining 5% get escalated to your best people._

Reply *NEXT* to claim your certificate! \u{1f3c6}`,
    quiz: {
      question: '\u{2753} What\u2019s the approximate cost per message when using OpenAI API?',
      options: ['A) $0.50', 'B) $0.05', 'C) $0.002', 'D) Free'],
      correct: 2,
      explanation: 'OpenAI API costs approximately *$0.002 per message* \u2014 incredibly affordable. 1,000 customer conversations for just $2!',
    },
    xp: 40,
    nextPrompt: '\u{1f3c6} *Congratulations!* You\u2019ve completed WhatsApp Automation!\n\nYou earned *210 XP*.\n\nReply *COURSES* to see more tracks.',
  },
]

/* ============================================================
   TRACK 4: AI CREATOR & INCOME
   ============================================================ */

const creatorLessons: WALesson[] = [
  {
    id: 1,
    title: 'Package & Sell AI Services',
    content: `\u{1f3a8} *Lesson 1: Package & Sell AI Services in Africa*

You now know AI. Let\u2019s turn that into income.

*5 AI Services You Can Sell Today:*

*1. WhatsApp Bot Setup* \u2014 $200-500 per client
Set up FAQ bots, lead capture, order systems for local businesses

*2. AI Content Creation* \u2014 $300-1000/month retainer
Social media, email, WhatsApp broadcast content for businesses

*3. AI Training Workshops* \u2014 $50-200 per person
Teach business owners how to use ChatGPT, Canva AI, etc.

*4. Prompt Engineering* \u2014 $50-150/hour
Create custom prompt libraries for specific industries

*5. AI Consulting* \u2014 $500-2000 per project
Audit a business and recommend AI tools + implementation

*Pricing Formula:*
Time saved for client per month \u00d7 12 months = Annual value
Charge 10-20% of annual value

_Example: If your bot saves a client 20 hours/month at $10/hr:
20 \u00d7 $10 \u00d7 12 = $2,400/year value
Your fee: $240-480 for setup + $50-100/month maintenance_

*Where to Find Clients:*
\u2022 Your existing network (friends\u2019 businesses)
\u2022 WhatsApp business groups
\u2022 LinkedIn outreach
\u2022 Local business associations

Reply *NEXT* for the quiz \u{1f447}`,
    quiz: {
      question: '\u{2753} How should you price AI services?',
      options: ['A) As cheap as possible', 'B) Based on time saved for client (10-20% of annual value)', 'C) Same as everyone else', 'D) Only hourly rates'],
      correct: 1,
      explanation: 'Price based on *value delivered*, not time spent. If you save a client $2,400/year, charging $480 is a bargain for them and profitable for you.',
    },
    xp: 30,
    nextPrompt: 'Reply *NEXT* for Lesson 2: AI Content Creation \u{1f447}',
  },
  {
    id: 2,
    title: 'AI Content Creation',
    content: `\u{1f3a8} *Lesson 2: AI Content Creation for Income*

Content creation with AI is the fastest path to income.

*Content Services You Can Offer:*

*Social Media Management:* $300-800/month
\u2022 30 posts/month across platforms
\u2022 AI generates, you review and customise
\u2022 Time: 5-8 hours/month (AI does 80%)

*Blog Writing:* $50-200 per article
\u2022 AI writes first draft
\u2022 You add expertise, local context, personality
\u2022 Time: 1-2 hours per 1500-word article

*Email Marketing:* $200-500/month
\u2022 Weekly newsletters
\u2022 Automated sequences
\u2022 AI handles writing, you handle strategy

*WhatsApp Broadcast Content:* $150-400/month
\u2022 Weekly promotional messages
\u2022 Holiday campaigns
\u2022 Customer re-engagement

*Quality Control Framework:*
1. AI generates the draft
2. You add local context and personality
3. Check facts and accuracy
4. Add client\u2019s brand voice
5. Format for the platform

_Never publish AI content without human review. Your value is the African context, local knowledge, and quality control that AI can\u2019t provide._

Reply *NEXT* for the quiz \u{1f447}`,
    quiz: {
      question: '\u{2753} What\u2019s the most important step after AI generates content?',
      options: ['A) Publish immediately', 'B) Delete it and rewrite', 'C) Add local context, personality, and fact-check', 'D) Send it to another AI'],
      correct: 2,
      explanation: 'Always *add local context and review* AI content. Your knowledge of the African market is what makes the content valuable.',
    },
    xp: 30,
    nextPrompt: 'Reply *NEXT* for Lesson 3: Start an AI Automation Agency \u{1f447}',
  },
  {
    id: 3,
    title: 'Start an AI Automation Agency',
    content: `\u{1f3a8} *Lesson 3: Start an AI Automation Agency*

An AI agency builds automated systems for businesses. High demand, high margins.

*Agency Business Model:*
\u2022 Setup fee: $500-5,000 (one-time)
\u2022 Monthly retainer: $200-2,000 (recurring!)
\u2022 Target: 5-10 clients = $1,000-20,000/month

*Services Menu:*
1. WhatsApp Bot Setup ($300-1,000)
2. AI Customer Service ($200-500/mo retainer)
3. Marketing Automation ($300-800/mo)
4. Sales Funnel Automation ($500-2,000 setup)
5. Full AI Business System ($2,000-5,000 setup)

*Getting Your First 3 Clients:*

\u2705 *Client 1: Free/Discounted*
Do it for a friend\u2019s business. Get a testimonial + case study.

\u2705 *Client 2: Referral*
Ask Client 1 to refer you. Offer them a discount for referrals.

\u2705 *Client 3: Outreach*
DM 20 local businesses on WhatsApp/Instagram with your case study.

*Agency Tools Stack:*
\u2022 WATI or Twilio (WhatsApp API)
\u2022 Make.com or Zapier (workflow automation)
\u2022 Notion (project management)
\u2022 Canva (proposals and presentations)

Reply *NEXT* for the quiz \u{1f447}`,
    quiz: {
      question: '\u{2753} What\u2019s the best way to get your first agency client?',
      options: ['A) Buy expensive ads', 'B) Do a free/discounted project for a friend, get a case study', 'C) Cold call 1,000 businesses', 'D) Wait for clients to come to you'],
      correct: 1,
      explanation: 'Start with a *free or discounted project* for someone you know. The case study and testimonial are worth more than the money.',
    },
    xp: 35,
    nextPrompt: 'Reply *NEXT* for Lesson 4: Freelance AI \u{1f447}',
  },
  {
    id: 4,
    title: 'Freelance AI on Upwork & Fiverr',
    content: `\u{1f3a8} *Lesson 4: Freelance AI on Upwork & Fiverr*

The global freelance market for AI skills is booming.

*Top AI Gigs in Demand:*
1. ChatGPT prompt writing ($20-100 per prompt set)
2. AI chatbot setup ($100-1,000 per project)
3. AI content writing ($50-200 per article)
4. AI workflow automation ($200-2,000 per project)
5. AI training/consulting ($50-150/hour)

*Upwork Profile Tips:*
\u2022 Title: "AI Automation Specialist | ChatGPT | WhatsApp Bots"
\u2022 Highlight African market expertise
\u2022 Include specific results: "Built bot that handles 80% of customer queries"
\u2022 Set rate at $25-50/hour to start

*Fiverr Gig Ideas:*
\u2022 "I will set up a WhatsApp chatbot for your business"
\u2022 "I will create custom ChatGPT prompts for your industry"
\u2022 "I will automate your business with AI workflows"

*Landing Your First Gig:*
1. Create a killer profile with your certifications
2. Apply to 10 relevant jobs per day
3. Write personalised proposals (not templates)
4. Offer a small free sample
5. Deliver fast and over-deliver on quality

*Income Targets:*
\u2022 Month 1: $500 (2-3 small projects)
\u2022 Month 3: $2,000 (repeat clients + new)
\u2022 Month 6: $5,000+ (premium pricing + referrals)

Reply *NEXT* for the quiz \u{1f447}`,
    quiz: {
      question: '\u{2753} How many jobs should you apply to per day on Upwork when starting?',
      options: ['A) 1-2', 'B) 5', 'C) 10', 'D) 50'],
      correct: 2,
      explanation: 'Apply to *10 relevant jobs per day* with personalised proposals. Volume + quality = your first gig within 1-2 weeks.',
    },
    xp: 30,
    nextPrompt: 'Reply *NEXT* for the final lesson: Build & Sell Digital Products \u{1f447}',
  },
  {
    id: 5,
    title: 'Build & Sell Digital Products',
    content: `\u{1f3a8} *Lesson 5: Build & Sell Digital Products with AI*

Digital products = build once, sell forever. The ultimate passive income.

*Digital Products You Can Create:*

*1. Prompt Libraries* ($10-50)
\u2022 "100 ChatGPT Prompts for Nigerian SMEs"
\u2022 "AI Marketing Prompts for E-commerce"
\u2022 Sell on Gumroad, Selar, or Flutterwave Store

*2. AI Template Packs* ($20-100)
\u2022 WhatsApp bot conversation templates
\u2022 AI workflow templates for Make.com/Zapier
\u2022 Social media content calendars with AI prompts

*3. Online Courses* ($50-500)
\u2022 "AI for African Business Owners" video course
\u2022 "WhatsApp Automation Masterclass"
\u2022 Sell on Udemy, Teachable, or your own site

*4. AI-Generated Content Packs* ($5-30)
\u2022 Social media templates for specific industries
\u2022 Email sequences for different businesses
\u2022 WhatsApp broadcast message templates

*5. Ebooks & Guides* ($10-30)
\u2022 "The African SME AI Playbook"
\u2022 AI creates the first draft, you add expertise
\u2022 Design with Canva, sell on Selar/Gumroad

*Marketing Your Products:*
\u2022 Share on your WhatsApp status daily
\u2022 Build an email list (offer a free sample)
\u2022 Post value content on LinkedIn/Twitter
\u2022 Partner with influencers for affiliate sales

_Create 3 digital products. One will take off. That\u2019s your winner \u2014 double down on it._

Reply *NEXT* to claim your certificate! \u{1f3c6}`,
    quiz: {
      question: '\u{2753} What is the best strategy for digital products?',
      options: ['A) Create 1 perfect product', 'B) Create 3 products and double down on the winner', 'C) Copy someone else\u2019s product', 'D) Only sell expensive products'],
      correct: 1,
      explanation: '*Create 3 products* and see which one gets traction. Then double down on the winner with improvements, upsells, and marketing.',
    },
    xp: 40,
    nextPrompt: '\u{1f3c6} *Congratulations!* You\u2019ve completed AI Creator & Income!\n\nYou earned *165 XP*.\n\nReply *COURSES* to see more tracks.',
  },
]

/* ============================================================
   TRACK 5: AI BUILDER (shortened for brevity in bot)
   ============================================================ */

const builderLessons: WALesson[] = [
  {
    id: 1,
    title: 'Python + OpenAI API',
    content: `\u{1f4bb} *Lesson 1: Python + OpenAI API*

Let\u2019s write your first AI code. You\u2019ll call ChatGPT from Python.

*What You Need:*
\u2022 Python 3.8+ installed
\u2022 OpenAI API key (platform.openai.com)
\u2022 A code editor (VS Code recommended)

*Setup (3 commands):*
pip install openai
export OPENAI_API_KEY="your-key-here"
python your_script.py

*Your First AI Script:*
from openai import OpenAI
client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are a helpful African business advisor."},
        {"role": "user", "content": "How can a small shop in Lagos use AI?"}
    ]
)
print(response.choices[0].message.content)

*Understanding the Code:*
\u2022 *model* \u2014 which AI to use (gpt-4o-mini is cheap + good)
\u2022 *system message* \u2014 sets AI\u2019s personality
\u2022 *user message* \u2014 your question
\u2022 *response* \u2014 the AI\u2019s answer

*Cost:* ~$0.15 per 1M tokens (very cheap!)

_Run this script and you\u2019ve just called AI from code. You\u2019re officially a builder._

Reply *NEXT* for the quiz \u{1f447}`,
    quiz: {
      question: '\u{2753} What does the "system message" do in an OpenAI API call?',
      options: ['A) Sends a notification', 'B) Sets the AI\u2019s personality and context', 'C) Configures billing', 'D) Resets the API'],
      correct: 1,
      explanation: 'The *system message* sets the AI\u2019s persona, instructions, and context. It\u2019s like giving the AI its job description.',
    },
    xp: 35,
    nextPrompt: 'Reply *NEXT* for Lesson 2: AI Agents with LangChain \u{1f447}',
  },
  {
    id: 2,
    title: 'Build AI Agents with LangChain',
    content: `\u{1f4bb} *Lesson 2: AI Agents with LangChain*

An AI agent can use tools, browse the web, and make decisions.

*Agent = LLM + Tools + Memory*

*What Agents Can Do:*
\u2022 Search the internet for information
\u2022 Read and write files
\u2022 Call APIs (weather, payments, databases)
\u2022 Make multi-step decisions
\u2022 Remember previous conversations

*LangChain Setup:*
pip install langchain langchain-openai

*Simple Agent Example:*
from langchain_openai import ChatOpenAI
from langchain.agents import create_react_agent

llm = ChatOpenAI(model="gpt-4o-mini")
tools = [search_tool, calculator_tool]
agent = create_react_agent(llm, tools, prompt)

*African Business Agent Ideas:*
1. *Market Research Agent* \u2014 searches web for competitor prices
2. *Customer Support Agent* \u2014 answers questions using your FAQ database
3. *Content Agent* \u2014 generates social media posts on schedule
4. *Analytics Agent* \u2014 analyses your sales data and gives insights

*Key Concepts:*
\u2022 *Tools* \u2014 functions the agent can call
\u2022 *Memory* \u2014 conversation history
\u2022 *ReAct* \u2014 Reason + Act pattern (think, then do)

Reply *NEXT* for the quiz \u{1f447}`,
    quiz: {
      question: '\u{2753} What are the 3 components of an AI Agent?',
      options: ['A) CPU + RAM + Storage', 'B) LLM + Tools + Memory', 'C) Python + API + Database', 'D) Frontend + Backend + Database'],
      correct: 1,
      explanation: 'An AI Agent = *LLM (brain) + Tools (hands) + Memory (context)*. The LLM reasons, tools take actions, memory maintains context.',
    },
    xp: 35,
    nextPrompt: 'Reply *NEXT* for Lesson 3: RAG Systems \u{1f447}',
  },
  {
    id: 3,
    title: 'RAG \u2014 AI That Knows Your Data',
    content: `\u{1f4bb} *Lesson 3: RAG \u2014 Retrieval Augmented Generation*

RAG = AI that answers questions using YOUR documents.

*The Problem:*
ChatGPT knows the internet but doesn\u2019t know YOUR business data \u2014 your products, prices, policies.

*The Solution \u2014 RAG:*
1. Upload your documents (PDFs, website, FAQ)
2. System converts them to searchable vectors
3. When a customer asks a question:
   \u2192 Find the most relevant document chunks
   \u2192 Feed them to the LLM with the question
   \u2192 LLM generates an accurate, sourced answer

*RAG Architecture:*
Documents \u2192 Chunks \u2192 Embeddings \u2192 Vector DB
Question \u2192 Find similar chunks \u2192 LLM \u2192 Answer

*Tools:*
\u2022 *Vector databases:* Pinecone, Chroma, Weaviate
\u2022 *Embedding models:* OpenAI text-embedding-3-small
\u2022 *Frameworks:* LangChain, LlamaIndex

*African Use Cases:*
\u2022 Customer support bot that knows your products
\u2022 Legal assistant trained on Nigerian company law
\u2022 Medical bot using WHO guidelines for Africa
\u2022 Agricultural advisor using local farming data

_RAG is the #1 technique companies use to make AI useful for their specific business._

Reply *NEXT* for the quiz \u{1f447}`,
    quiz: {
      question: '\u{2753} What problem does RAG solve?',
      options: ['A) AI is too fast', 'B) AI doesn\u2019t know your specific business data', 'C) AI is too expensive', 'D) AI can\u2019t generate text'],
      correct: 1,
      explanation: 'RAG solves the problem of AI *not knowing your specific data*. It retrieves relevant information from your documents before generating answers.',
    },
    xp: 35,
    nextPrompt: 'Reply *NEXT* for Lesson 4: Multi-Agent Systems \u{1f447}',
  },
  {
    id: 4,
    title: 'Multi-Agent Systems',
    content: `\u{1f4bb} *Lesson 4: Multi-Agent Systems with CrewAI*

Multiple AI agents working together as a team.

*Single Agent vs Multi-Agent:*
\u2022 Single: One AI does everything (gets confused on complex tasks)
\u2022 Multi: Specialised agents collaborate (like a real team)

*CrewAI Framework:*
pip install crewai

*Example: Content Marketing Crew*

*Agent 1: Researcher*
\u2022 Role: "Research trending topics in African tech"
\u2022 Tools: Web search, news APIs

*Agent 2: Writer*
\u2022 Role: "Write engaging blog posts for African audience"
\u2022 Tools: Text generation, grammar check

*Agent 3: Editor*
\u2022 Role: "Review content for accuracy and brand voice"
\u2022 Tools: Fact-checking, style guide reference

*Agent 4: Publisher*
\u2022 Role: "Format and schedule content for social media"
\u2022 Tools: Social media APIs, scheduling tools

*Real Workflow:*
1. Researcher finds trending AI topics in Nigeria
2. Writer creates a blog post about the top topic
3. Editor reviews for accuracy and brand consistency
4. Publisher formats for LinkedIn, Twitter, and WhatsApp

_One prompt triggers the entire pipeline. 4 agents, zero manual work._

Reply *NEXT* for the quiz \u{1f447}`,
    quiz: {
      question: '\u{2753} Why use multiple agents instead of one?',
      options: ['A) It\u2019s cheaper', 'B) Specialised agents collaborate better on complex tasks', 'C) It\u2019s faster', 'D) One agent is always better'],
      correct: 1,
      explanation: '*Specialised agents* perform better on complex tasks because each focuses on what it does best, just like a real team of professionals.',
    },
    xp: 35,
    nextPrompt: 'Reply *NEXT* for the final lesson: Deploy AI to Production \u{1f447}',
  },
  {
    id: 5,
    title: 'Deploy AI to Production',
    content: `\u{1f4bb} *Lesson 5: Deploy AI to Production*

You\u2019ve built it. Now let\u2019s ship it.

*Deployment Options:*

*1. API Deployment (Most Common)*
\u2022 Wrap your AI in a FastAPI/Flask endpoint
\u2022 Deploy on Railway, Render, or Fly.io
\u2022 Cost: $5-20/month for basic apps

*2. WhatsApp Bot Deployment*
\u2022 Connect your AI to Twilio WhatsApp API
\u2022 Host webhook on Railway/Render
\u2022 Users interact via WhatsApp

*3. Web App Deployment*
\u2022 Next.js frontend + AI backend
\u2022 Deploy on Vercel (free tier)
\u2022 Custom domain: $10/year

*Production Checklist:*
\u2705 Error handling (what if the API fails?)
\u2705 Rate limiting (prevent abuse)
\u2705 Logging (track usage and errors)
\u2705 Cost monitoring (set spending limits)
\u2705 Fallback responses (graceful degradation)
\u2705 Security (API keys in env variables, not code)
\u2705 Testing (test with 10 users before launch)

*Monitoring Tools:*
\u2022 LangSmith \u2014 trace AI agent decisions
\u2022 Sentry \u2014 error tracking
\u2022 PostHog \u2014 usage analytics (free tier)

*Launch Strategy:*
Week 1: 10 beta users (friends)
Week 2: Fix bugs, improve prompts
Week 3: 50 users (wider circle)
Week 4: Public launch

_Ship fast, iterate faster. Your first version won\u2019t be perfect \u2014 and that\u2019s fine._

Reply *NEXT* to claim your certificate! \u{1f3c6}`,
    quiz: {
      question: '\u{2753} What\u2019s the recommended first step for a production launch?',
      options: ['A) Launch to 10,000 users immediately', 'B) Start with 10 beta users and iterate', 'C) Wait until it\u2019s perfect', 'D) Only launch on weekends'],
      correct: 1,
      explanation: 'Start with *10 beta users*, fix bugs, then scale to 50, then public launch. Ship fast and iterate \u2014 perfection is the enemy of progress.',
    },
    xp: 40,
    nextPrompt: '\u{1f3c6} *Congratulations!* You\u2019ve completed AI Builder!\n\nYou earned *180 XP*.\n\nReply *COURSES* to see more tracks.',
  },
]

/* ============================================================
   TRACK 6: AI CAREER LAUNCHPAD
   ============================================================ */

const careerLessons: WALesson[] = [
  {
    id: 1,
    title: 'AI-Ready CV & LinkedIn',
    content: `\u{1f680} *Lesson 1: AI-Ready CV & LinkedIn*

Your CV needs to pass both AI screening (ATS) and human review.

*ATS-Optimised CV Tips:*
\u2022 Use standard section headers (Experience, Education, Skills)
\u2022 Include keywords from the job description
\u2022 Avoid tables, graphics, fancy formatting
\u2022 Save as PDF with selectable text

*AI Skills to Highlight:*
\u2022 Prompt Engineering
\u2022 AI Automation (Zapier, Make.com)
\u2022 ChatGPT / Claude / Gemini
\u2022 Data Analysis with AI
\u2022 WhatsApp Bot Development
\u2022 Python (if applicable)

*Use ChatGPT for Your CV:*
Prompt: "Rewrite my [role] experience to highlight AI skills. Here\u2019s the job description: [paste JD]. Here\u2019s my current experience: [paste experience]. Make it ATS-friendly with quantified results."

*LinkedIn Optimisation:*
\u2022 Headline: "AI Automation Specialist | WhatsApp Bots | Helping African SMEs Scale"
\u2022 About: Story format \u2014 problem you solve, who you help, results
\u2022 Featured: Add AfriFlow AI certificates
\u2022 Skills: Add AI-related skills, get endorsements

_Your CV and LinkedIn are your AI-powered marketing material. Invest time in them._

Reply *NEXT* for the quiz \u{1f447}`,
    quiz: {
      question: '\u{2753} Why should your CV avoid fancy graphics and tables?',
      options: ['A) They look unprofessional', 'B) ATS (AI screening systems) can\u2019t read them', 'C) They use too much ink', 'D) Employers don\u2019t like colours'],
      correct: 1,
      explanation: '*ATS systems* can\u2019t parse graphics and tables, so your CV might be rejected before a human even sees it. Keep it clean and text-based.',
    },
    xp: 30,
    nextPrompt: 'Reply *NEXT* for Lesson 2: Where to Find Remote AI Jobs \u{1f447}',
  },
  {
    id: 2,
    title: 'Where to Find Remote AI Jobs',
    content: `\u{1f680} *Lesson 2: Where to Find Remote AI Jobs*

Remote AI jobs are booming. Here\u2019s where to find them from Africa.

*Top Platforms:*

*General Remote:*
\u2022 *LinkedIn* \u2014 #1 for professional AI roles
\u2022 *Upwork* \u2014 freelance AI projects ($25-150/hr)
\u2022 *Toptal* \u2014 premium freelance (top 3% only)
\u2022 *We Work Remotely* \u2014 curated remote jobs

*AI-Specific:*
\u2022 *AI Jobs* (ai-jobs.net) \u2014 dedicated AI board
\u2022 *Hugging Face Jobs* \u2014 ML/AI roles
\u2022 *Scale AI* \u2014 data labelling + AI tasks

*Africa-Focused:*
\u2022 *Andela* \u2014 connects African talent to global companies
\u2022 *Tunga* \u2014 African developers for global clients
\u2022 *AfriFlow AI Work* \u2014 our own job board!

*Job Titles to Search:*
\u2022 "AI Automation Specialist"
\u2022 "Prompt Engineer"
\u2022 "AI Operations Analyst"
\u2022 "Chatbot Developer"
\u2022 "AI Content Strategist"
\u2022 "Data Analyst"

*Pro Strategy:*
1. Set up job alerts on 3 platforms
2. Apply to 5 jobs/day minimum
3. Customise each application (no mass apply)
4. Follow up after 1 week
5. Network with hiring managers on LinkedIn

Reply *NEXT* for the quiz \u{1f447}`,
    quiz: {
      question: '\u{2753} How many jobs should you apply to daily?',
      options: ['A) 1', 'B) 2-3', 'C) 5 minimum', 'D) 20+'],
      correct: 2,
      explanation: 'Apply to *5+ jobs daily* with customised applications. Consistency is key \u2014 treat your job search like a job itself.',
    },
    xp: 30,
    nextPrompt: 'Reply *NEXT* for Lesson 3: Application Strategy \u{1f447}',
  },
  {
    id: 3,
    title: 'Application Strategy',
    content: `\u{1f680} *Lesson 3: Application Strategy That Gets Interviews*

Stand out from 200+ applicants. Here\u2019s how.

*The STAR-AI Method:*
\u2022 *S*ituation \u2014 describe the business problem
\u2022 *T*ask \u2014 what you were asked to do
\u2022 *A*ction \u2014 what AI tools/methods you used
\u2022 *R*esult \u2014 quantified impact
\u2022 *AI* \u2014 what specific AI skills you applied

*Cover Letter Template:*
"I noticed [Company] is [specific thing from their website]. In my recent project, I [action with AI] that resulted in [measurable outcome]. I\u2019d love to bring this approach to [specific problem they\u2019re solving]."

*Portfolio Must-Haves:*
1. AfriFlow AI certificates (all completed tracks)
2. 2-3 real projects (even personal projects count)
3. A case study showing before/after results
4. GitHub profile with AI code (for technical roles)
5. LinkedIn recommendations from clients/colleagues

*The "Value-First" Strategy:*
Before applying, spend 30 minutes researching the company.
Then in your application: "I noticed [problem they have]. Here\u2019s how I\u2019d use AI to solve it: [brief proposal]."

_This takes more time per application but gets 5x more responses than mass applying._

Reply *NEXT* for the quiz \u{1f447}`,
    quiz: {
      question: '\u{2753} What\u2019s the "Value-First" strategy?',
      options: ['A) Ask about salary first', 'B) Research the company and propose an AI solution in your application', 'C) Apply to the most valuable companies', 'D) Only apply to high-paying jobs'],
      correct: 1,
      explanation: '*Research the company* and show you\u2019ve already thought about how to help them with AI. This immediately sets you apart from 90% of applicants.',
    },
    xp: 35,
    nextPrompt: 'Reply *NEXT* for Lesson 4: Ace the Interview \u{1f447}',
  },
  {
    id: 4,
    title: 'Ace the Remote AI Interview',
    content: `\u{1f680} *Lesson 4: Ace the Remote AI Interview*

Remote interviews have specific patterns. Prepare for these.

*Common AI Interview Questions:*

*1. "How would you use AI to solve [X] problem?"*
Framework: Identify the problem \u2192 Choose the right AI approach \u2192 Explain implementation \u2192 Predict results

*2. "Tell me about an AI project you\u2019ve built."*
Use STAR-AI method. Show real results with numbers.

*3. "What AI tools do you use?"*
Be specific: "I use ChatGPT for content, Claude for analysis, Make.com for automation, and Python for custom AI agents."

*4. "How do you stay current with AI?"*
Mention: AfriFlow AI courses, AI newsletters, hands-on experimentation, community participation.

*Remote Interview Tips:*
\u2022 Test your internet 1 hour before (have a backup: mobile hotspot)
\u2022 Good lighting (face a window)
\u2022 Clean background (or virtual background)
\u2022 Dress professionally (at least top half!)
\u2022 Have notes ready (they can\u2019t see them)

*Live Demo Prep:*
Many AI roles ask you to demo something.
\u2022 Prepare a 5-minute walkthrough of your best project
\u2022 Practice screen sharing
\u2022 Have a backup demo if wifi is slow

Reply *NEXT* for the quiz \u{1f447}`,
    quiz: {
      question: '\u{2753} What framework should you use to answer "Tell me about an AI project"?',
      options: ['A) List all tools you know', 'B) STAR-AI method (Situation, Task, Action, Result, AI)', 'C) Read from your CV', 'D) Give a theoretical answer'],
      correct: 1,
      explanation: 'The *STAR-AI method* gives a structured, compelling answer with specific results. Interviewers love concrete numbers over vague descriptions.',
    },
    xp: 35,
    nextPrompt: 'Reply *NEXT* for the final lesson: Remote Work Success \u{1f447}',
  },
  {
    id: 5,
    title: 'Succeed in Your First Remote Role',
    content: `\u{1f680} *Lesson 5: Succeed in Your First Remote Role*

You got the job! Here\u2019s how to thrive remotely from Africa.

*First 30 Days:*
\u2022 Over-communicate (better too much than too little)
\u2022 Ask questions early (nobody expects you to know everything)
\u2022 Set up your workspace (dedicated desk, good chair, reliable internet)
\u2022 Learn the team\u2019s communication tools (Slack, Notion, etc.)

*Time Zone Management:*
\u2022 Use World Time Buddy to see overlap hours
\u2022 Be available during 2-4 hours of overlap with your team
\u2022 Send async updates daily (\u201cHere\u2019s what I did today, here\u2019s what I\u2019ll do tomorrow\u201d)

*Internet Reliability:*
\u2022 Primary: Fibre or broadband
\u2022 Backup: Mobile hotspot (MTN, Safaricom, Airtel)
\u2022 Emergency: Co-working space with fast WiFi

*Stand Out as a Remote Worker:*
1. *Deliver early* \u2014 if deadline is Friday, submit Thursday
2. *Document everything* \u2014 write guides for what you build
3. *Propose solutions* \u2014 don\u2019t just report problems
4. *Build relationships* \u2014 schedule virtual coffees with teammates
5. *Keep learning* \u2014 use AI to learn faster on the job

*Salary Negotiation:*
\u2022 Research global rates on Glassdoor and Levels.fyi
\u2022 African-based remote workers often earn 50-80% of US rates
\u2022 Start at $30K-50K, grow to $60K-120K in 2-3 years

_You don\u2019t just want a remote job. You want a remote career. Play the long game._

Reply *NEXT* to claim your certificate! \u{1f3c6}`,
    quiz: {
      question: '\u{2753} What\u2019s the most important habit for remote work success?',
      options: ['A) Working 12+ hours a day', 'B) Over-communicate and send daily async updates', 'C) Always being online', 'D) Never asking questions'],
      correct: 1,
      explanation: '*Over-communication and daily updates* build trust with remote teams. Your manager can\u2019t see you working, so proactive updates are essential.',
    },
    xp: 40,
    nextPrompt: '\u{1f3c6} *Congratulations!* You\u2019ve completed AI Career Launchpad!\n\nYou earned *170 XP*.\n\nReply *COURSES* to see more tracks.',
  },
]

/* ============================================================
   COURSE REGISTRY
   ============================================================ */

export const WA_COURSES: Record<string, WACourse> = {
  'ai-foundations': {
    id: 'ai-foundations',
    title: 'AI Foundations',
    description: 'Zero to AI-literate in 5 lessons. Free track.',
    lessons: foundationsLessons,
    totalXP: 165,
    isFree: true,
  },
  'ai-business': {
    id: 'ai-business',
    title: 'AI for Business',
    description: 'Automate & grow your African SME with AI.',
    lessons: businessLessons,
    totalXP: 190,
    isFree: false,
  },
  'whatsapp-automation': {
    id: 'whatsapp-automation',
    title: 'WhatsApp Automation',
    description: 'Build bots that sell while you sleep.',
    lessons: automationLessons,
    totalXP: 210,
    isFree: false,
  },
  'ai-creator': {
    id: 'ai-creator',
    title: 'AI Creator & Income',
    description: 'Turn AI skills into real money.',
    lessons: creatorLessons,
    totalXP: 165,
    isFree: false,
  },
  'ai-builder': {
    id: 'ai-builder',
    title: 'AI Builder',
    description: 'Code AI tools & agents with Python.',
    lessons: builderLessons,
    totalXP: 180,
    isFree: false,
  },
  'ai-career': {
    id: 'ai-career',
    title: 'AI Career Launchpad',
    description: 'Land a remote AI job from Africa.',
    lessons: careerLessons,
    totalXP: 170,
    isFree: false,
  },
}

// Backward compat alias
export const WA_LESSONS = WA_COURSES['ai-foundations'].lessons

/* ============================================================
   BOT RESPONSE TEMPLATES
   ============================================================ */

export const WA_RESPONSES = {
  welcome: () =>
    `\u{1f30d} *Welcome to AfriFlow AI Academy!*

Learn AI skills used by Africa\u2019s fastest-growing companies \u2014 all on WhatsApp.

\u{1f4da} 6 Learning Tracks
\u23f1 32 lessons \u00b7 5-10 min each
\u{1f3c6} Earn XP + Certificates

Let\u2019s start! What\u2019s your name? \u{1f447}`,

  askCountry: (name: string) =>
    `Nice to meet you, ${name}! \u{1f91d}\n\nWhich country are you in?`,

  courseMenu: (name: string, country: string) =>
    `Perfect, ${name} from ${country}! \u{1f30d}

\u{1f393} *Choose your track:*

1. \u{1f9e0} AI Foundations (FREE)
2. \u{1f4bc} AI for Business
3. \u{26a1} WhatsApp Automation
4. \u{1f3a8} AI Creator & Income
5. \u{1f4bb} AI Builder
6. \u{1f680} AI Career Launchpad

Reply with a number \u{1f447}`,

  courseIntro: (courseTitle: string, totalLessons: number) =>
    `\u{1f4da} *${courseTitle}*

You\u2019re about to learn skills that top African companies pay for.

\u{1f4d6} ${totalLessons} lessons \u00b7 5-10 min each
\u{2753} Quiz after each lesson
\u{1f4aa} Earn XP with every correct answer
\u{1f3c6} Certificate on completion

*Commands:*
\u2022 *NEXT* \u2014 Next lesson
\u2022 *REPEAT* \u2014 Repeat current lesson
\u2022 *PROGRESS* \u2014 Check your progress
\u2022 *COURSES* \u2014 Switch track
\u2022 *HELP* \u2014 Show all commands

Let\u2019s go! Sending Lesson 1...`,

  correct: (xp: number, streak: number) => {
    const streakBonus = streak >= 3 ? `\n\u{1f525} ${streak} streak! +${streak * 2} bonus XP` : ''
    return `\u{2705} *Correct!* +${xp} XP${streakBonus}\n\nReply *NEXT* for the next lesson \u{1f447}`
  },

  wrong: (correctAnswer: string, explanation: string) =>
    `\u{274c} Not quite!\n\n*Correct answer:* ${correctAnswer}\n\n${explanation}\n\n_Don\u2019t worry \u2014 learning from mistakes is how AI learns too!_\n\nReply *NEXT* for the next lesson \u{1f447}`,

  progress: (name: string, course: string, lesson: number, total: number, xp: number, streak: number) =>
    `\u{1f4ca} *${name}\u2019s Progress*

\u{1f4d6} Track: ${course}
\u{2705} Completed: ${lesson}/${total} lessons
\u{1f4aa} XP: ${xp}
\u{1f525} Current streak: ${streak}
\u{1f4c8} Progress: ${'='.repeat(Math.round((lesson / total) * 10))}${'_'.repeat(10 - Math.round((lesson / total) * 10))} ${Math.round((lesson / total) * 100)}%

Reply *NEXT* to continue learning \u{1f447}`,

  completed: (name: string, course: string, totalXP: number) =>
    `\u{1f3c6}\u{1f389} *CONGRATULATIONS, ${name}!*

You\u2019ve completed *${course}*!

\u{1f4aa} Total XP earned: ${totalXP}
\u{1f4dc} Your certificate is being generated...
\u{1f517} Check your dashboard for the download link.

\u{1f31f} Ready for more? Reply *COURSES* to start another track!`,

  unknown: () =>
    `\u{1f914} I didn\u2019t understand that.\n\nCommands:\n\u2022 *NEXT* \u2014 Next lesson\n\u2022 *REPEAT* \u2014 Repeat lesson\n\u2022 *PROGRESS* \u2014 Check progress\n\u2022 *COURSES* \u2014 See all tracks\n\u2022 *HELP* \u2014 All commands\n\u2022 *STOP* \u2014 Pause learning`,

  menu: () =>
    `\u{1f4cb} *Commands:*

\u2022 *NEXT* \u2014 Next lesson
\u2022 *REPEAT* \u2014 Repeat current lesson
\u2022 *PROGRESS* \u2014 Check your progress
\u2022 *COURSES* \u2014 See all tracks
\u2022 *LANGUAGE* \u2014 Change language
\u2022 *CERTIFICATE* \u2014 Get your certificates
\u2022 *HELP* \u2014 Show this menu
\u2022 *STOP* \u2014 Pause learning

Reply with a command \u{1f447}`,
}

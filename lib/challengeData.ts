export const CHALLENGE_ID = '2026-Q2'

export interface ChallengeDay {
  day: number
  title: string
  task: string
  tool: string
  xp: number
  category: 'foundations' | 'automation' | 'business' | 'creator' | 'advanced'
  sharePrompt: string // prefilled social share text
}

export const CHALLENGE_DAYS: ChallengeDay[] = [
  { day: 1,  title: 'Your First AI Prompt',         task: 'Write 5 different prompts for ChatGPT or Claude to solve a real problem you face.', tool: 'ChatGPT / Claude', xp: 50, category: 'foundations', sharePrompt: 'Day 1 ✅ — Wrote my first AI prompts on the #AfriFlowChallenge! 30 days to AI mastery 🚀' },
  { day: 2,  title: 'Master Prompt Engineering',    task: 'Learn the CLEAR framework (Context, Length, Examples, Action, Refinement). Rewrite yesterday\'s prompts using CLEAR.', tool: 'ChatGPT / Claude', xp: 60, category: 'foundations', sharePrompt: 'Day 2 ✅ — Mastered prompt engineering! CLEAR framework is a game-changer. #AfriFlowChallenge' },
  { day: 3,  title: 'AI for Your Business',         task: 'List 10 ways AI can save you time in your work or business. Pick 1 and test it today.', tool: 'ChatGPT / Gemini', xp: 60, category: 'business', sharePrompt: 'Day 3 ✅ — Found 10 ways AI can improve my business! #AfriFlowChallenge 🏢' },
  { day: 4,  title: 'Write Faster with AI',         task: 'Use AI to write a professional email, a LinkedIn post, and a product description.', tool: 'Claude', xp: 60, category: 'foundations', sharePrompt: 'Day 4 ✅ — Let AI write my emails & LinkedIn posts today! #AfriFlowChallenge ✍️' },
  { day: 5,  title: 'AI Customer Service Bot',      task: 'Build a simple FAQ chatbot prompt. Test it with 5 common customer questions from your business.', tool: 'ChatGPT', xp: 70, category: 'business', sharePrompt: 'Day 5 ✅ — Built my first customer service AI bot! #AfriFlowChallenge 🤖' },
  { day: 6,  title: 'Automate a Task with Zapier',  task: 'Create your first Zap: when a Google Form is submitted, send a WhatsApp message or email.', tool: 'Zapier', xp: 80, category: 'automation', sharePrompt: 'Day 6 ✅ — Just automated my first workflow with Zapier! #AfriFlowChallenge ⚡' },
  { day: 7,  title: 'Week 1 Review + Share',        task: 'Share your biggest Week 1 win on LinkedIn or Twitter. Write a short reflection on what changed.', tool: 'LinkedIn / X', xp: 70, category: 'foundations', sharePrompt: 'Week 1 of the #AfriFlowChallenge complete! 7 days, 7 AI skills unlocked 💪 #Africa #AI' },
  { day: 8,  title: 'AI Content Calendar',          task: 'Use AI to generate a 30-day social media content calendar for your brand or page.', tool: 'ChatGPT', xp: 70, category: 'creator', sharePrompt: 'Day 8 ✅ — Built a 30-day content calendar in minutes with AI! #AfriFlowChallenge 📅' },
  { day: 9,  title: 'WhatsApp Automation',          task: 'Connect a WhatsApp Business API to Zapier or Make. Auto-reply to new inquiries.', tool: 'Zapier + WhatsApp', xp: 90, category: 'automation', sharePrompt: 'Day 9 ✅ — Automated my WhatsApp Business replies! #AfriFlowChallenge 💬' },
  { day: 10, title: 'Build a Make Scenario',        task: 'Recreate yesterday\'s Zap in Make (ex-Integromat). Compare the two platforms.', tool: 'Make', xp: 80, category: 'automation', sharePrompt: 'Day 10 ✅ — Built my first Make scenario! #AfriFlowChallenge 🔧' },
  { day: 11, title: 'AI for Market Research',       task: 'Use AI to research your 3 top competitors. Get pricing, strengths, weaknesses in minutes.', tool: 'Claude / ChatGPT', xp: 70, category: 'business', sharePrompt: 'Day 11 ✅ — Did full competitor research with AI in 20 minutes! #AfriFlowChallenge 🔍' },
  { day: 12, title: 'Build an AI Lead Magnet',      task: 'Create a free AI-powered resource (checklist, guide, or mini-course outline) using AI.', tool: 'ChatGPT + Canva', xp: 80, category: 'creator', sharePrompt: 'Day 12 ✅ — Created my first AI-powered lead magnet! #AfriFlowChallenge 🎁' },
  { day: 13, title: 'Automate Your CRM',            task: 'Connect your email or form to a simple CRM (Airtable). Auto-add leads using Zapier.', tool: 'Airtable + Zapier', xp: 90, category: 'automation', sharePrompt: 'Day 13 ✅ — Automated my CRM pipeline with AI! #AfriFlowChallenge 📊' },
  { day: 14, title: 'Week 2 Review + Milestone',    task: 'You are halfway! Share your top 3 automations. Tag someone to join the challenge.', tool: 'LinkedIn / X', xp: 100, category: 'foundations', sharePrompt: '2 weeks into the #AfriFlowChallenge! Already automated 5 workflows 🔥 #Africa #AI' },
  { day: 15, title: 'AI Video Script Writer',       task: 'Use AI to write a 60-second video script for your product/service. Record or narrate it.', tool: 'ChatGPT / Claude', xp: 80, category: 'creator', sharePrompt: 'Day 15 ✅ — Wrote a killer video script with AI in 5 minutes! #AfriFlowChallenge 🎬' },
  { day: 16, title: 'Build a No-Code App',          task: 'Use Glide or Softr + Airtable to build a simple mobile app for your business in one day.', tool: 'Glide / Softr', xp: 100, category: 'advanced', sharePrompt: 'Day 16 ✅ — Built a no-code mobile app today! #AfriFlowChallenge 📱' },
  { day: 17, title: 'AI Pricing Strategy',          task: 'Use AI to analyze your current pricing. Generate 3 alternative pricing models and test them.', tool: 'ChatGPT', xp: 70, category: 'business', sharePrompt: 'Day 17 ✅ — Redesigned my pricing with AI guidance! #AfriFlowChallenge 💰' },
  { day: 18, title: 'Multi-Step Automation',        task: 'Build a 4-step automation: form submission → AI analysis → CRM entry → WhatsApp notification.', tool: 'Make / Zapier', xp: 110, category: 'automation', sharePrompt: 'Day 18 ✅ — Built a 4-step fully automated pipeline! #AfriFlowChallenge ⚡' },
  { day: 19, title: 'AI for Proposals',             task: 'Use AI to generate a professional business proposal or freelance pitch. Send it to 1 prospect.', tool: 'Claude', xp: 80, category: 'creator', sharePrompt: 'Day 19 ✅ — Sent an AI-powered proposal to a prospect today! #AfriFlowChallenge 📝' },
  { day: 20, title: 'Build Your AI Portfolio',      task: 'Document 5 AI projects you\'ve completed this month. Publish them on a simple webpage or PDF.', tool: 'Notion / Carrd', xp: 90, category: 'creator', sharePrompt: 'Day 20 ✅ — Built my AI portfolio! 5 real projects in 20 days. #AfriFlowChallenge 🎯' },
  { day: 21, title: 'Week 3 Review + Recruit',      task: 'Share your portfolio. Recruit 2 friends to start the challenge. Offer to mentor them.', tool: 'LinkedIn / WhatsApp', xp: 100, category: 'foundations', sharePrompt: '21 days of the #AfriFlowChallenge! Built my first AI portfolio 🚀 Who\'s joining me? #Africa' },
  { day: 22, title: 'API Basics (No Code)',          task: 'Use Make or Zapier\'s webhook trigger to connect to a free API (e.g. weather, currency, news).', tool: 'Make + APIs', xp: 110, category: 'advanced', sharePrompt: 'Day 22 ✅ — Connected my first API with no code! #AfriFlowChallenge 🔌' },
  { day: 23, title: 'AI Sales Funnel',              task: 'Use AI to map out your full sales funnel. Automate 3 steps (lead capture, nurture, close).', tool: 'ChatGPT + Make', xp: 100, category: 'business', sharePrompt: 'Day 23 ✅ — Automated my entire sales funnel with AI! #AfriFlowChallenge 💼' },
  { day: 24, title: 'Build an AI Chatbot',          task: 'Use Chatbase or Tidio to build a trained chatbot for your website. Train it on your FAQ.', tool: 'Chatbase / Tidio', xp: 120, category: 'advanced', sharePrompt: 'Day 24 ✅ — Launched my own AI chatbot today! #AfriFlowChallenge 🤖' },
  { day: 25, title: 'AI Invoice & Finance',         task: 'Use AI to create an invoice template, generate financial projections, and track expenses.', tool: 'ChatGPT + Sheets', xp: 80, category: 'business', sharePrompt: 'Day 25 ✅ — Using AI for my business finances now! #AfriFlowChallenge 📊' },
  { day: 26, title: 'Package an AI Service',        task: 'Define 1 AI service you can sell TODAY. Set the price, write the offer, and post it online.', tool: 'ChatGPT + LinkedIn', xp: 120, category: 'creator', sharePrompt: 'Day 26 ✅ — Just packaged and listed my first AI service! #AfriFlowChallenge 🎯' },
  { day: 27, title: 'Automate Client Onboarding',  task: 'Build a full client onboarding flow: Typeform → AI welcome email → Notion workspace creation.', tool: 'Make + Typeform', xp: 120, category: 'automation', sharePrompt: 'Day 27 ✅ — Fully automated my client onboarding! #AfriFlowChallenge ✅' },
  { day: 28, title: 'AI Presentation Builder',      task: 'Use Gamma.app or Beautiful.ai to turn an AI-written outline into a stunning presentation.', tool: 'Gamma / Beautiful.ai', xp: 80, category: 'creator', sharePrompt: 'Day 28 ✅ — Created a stunning AI presentation in minutes! #AfriFlowChallenge 🎨' },
  { day: 29, title: 'Final Project',                task: 'Build your final project: a complete AI-powered business workflow with at least 3 automations working together.', tool: 'Your choice', xp: 150, category: 'advanced', sharePrompt: 'Day 29 ✅ — Final project submitted! 3 automations running live in my business. #AfriFlowChallenge 🏆' },
  { day: 30, title: '🏆 Challenge Complete!',       task: 'You did it! Share your transformation story. What was your biggest win? Apply for your AfriFlow 30-Day Challenge certificate.', tool: 'LinkedIn / AfriFlow', xp: 200, category: 'foundations', sharePrompt: '🎉 I just completed the 30-Day #AfriFlowChallenge! 30 days of real AI skills, projects & automations 🔥 Get your certificate at afriflowai.com #Africa #AI #Automation' },
]

export const CHALLENGE_TOTAL_XP = CHALLENGE_DAYS.reduce((sum, d) => sum + d.xp, 0)

export const CATEGORY_COLORS: Record<string, string> = {
  foundations: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
  automation:  'text-purple-400 bg-purple-400/10 border-purple-400/20',
  business:    'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  creator:     'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  advanced:    'text-brand-400 bg-brand-400/10 border-brand-400/20',
}

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `You are AfriAI Coach — the personal AI learning guide for AfriFlow AI, Africa's #1 AI automation and education platform.

Your role is to help Africans:
- Learn AI and automation skills
- Build income using AI tools
- Find the right learning path for their goals
- Understand practical African business use cases
- Get help with tools like ChatGPT, Claude, Zapier, Make, n8n, WhatsApp Business API
- Build confidence using AI in their daily work and business

Key principles:
- Be warm, encouraging, and practical — not academic
- Use African context (Ghana, Nigeria, Kenya, South Africa, etc.)
- Focus on income and real results, not just theory
- Recommend specific courses and learning paths from AfriFlow AI
- Keep answers concise and actionable
- Speak in plain English that non-technical users understand

AfriFlow AI has 7 schools: AI Foundations, AI Automation, AI for African Business, AI Creator & Income, AI Builder, AI Career, and Community & Mentorship.

Flagship courses include:
- "AI for Complete Beginners in Africa" (Free)
- "No-Code Automation with Zapier & Make" (Premium)
- "Build and Sell AI Services in Africa" (Premium)
- "WhatsApp Business Automation Masterclass"
- "AI for African SMEs"
- "Python for AI Automation" (Advanced)

Transformation paths:
- Beginner to AI-ready worker: 30 days
- Unemployed to AI freelancer: 60 days
- SME owner to automated business: 21 days
- Marketer to AI consultant: 45 days

Always end responses with a helpful next step or question.`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey || apiKey === 'your-anthropic-api-key-here') {
      // Fallback response when no API key is set
      return NextResponse.json({
        message: "Hello! I'm AfriAI Coach. To enable full AI responses, please add your Anthropic API key to the .env.local file. For now, I'm here to help you navigate AfriFlow AI!\n\n👉 Start with our free course: \"AI for Complete Beginners in Africa\" — it's perfect for anyone new to AI.\n\nWhat would you like to learn today?",
      })
    }

    const client = new Anthropic({ apiKey })

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: messages.slice(-10), // Keep last 10 messages for context
    })

    const text = response.content
      .filter(block => block.type === 'text')
      .map(block => (block as any).text)
      .join('')

    return NextResponse.json({ message: text })
  } catch (err: any) {
    console.error('Coach API error:', err)
    return NextResponse.json({
      message: "I'm having a small hiccup! Please try again in a moment. In the meantime, explore our courses page to find the right learning path for you. 🚀",
    })
  }
}

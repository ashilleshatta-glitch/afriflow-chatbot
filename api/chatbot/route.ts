import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { ChatSession } from '@/models/ChatSession';
import { generateChatResponse, LLMMessage } from '@/lib/llmProviders';
// import { getServerSession } from "next-auth/next";

export async function POST(req: Request) {
    try {
        await connectDB();

        // Parse Request
        const body = await req.json();
        
        // Quick session identifier (Phase 5 will add real auth binding)
        const { message, sessionId = 'temp-anon-session-id' } = body;

        if (!message) {
            return NextResponse.json({ error: 'Message string is required' }, { status: 400 });
        }

        // 1. Retrieve or Initialize ChatSession
        let chatSession = await ChatSession.findOne({ sessionId });
        
        if (!chatSession) {
            chatSession = await ChatSession.create({
                sessionId,
                messages: [
                    { role: 'assistant', content: 'Hello! I am your AfriFlow Platform Assistant. Need help finding a course, checking your XP, or navigating the platform?' }
                ],
                contextData: { platform: 'web' }
            });
        }

        // 2. Append incoming User Message to DB
        chatSession.messages.push({ role: 'user', content: message, timestamp: new Date() });

        // 3. Format history for LLM Provider 
        const llmMessages: LLMMessage[] = chatSession.messages.map((m: any) => ({
            role: m.role,
            content: m.content
        }));

        // Context Engine placeholder (Phase 5)
        const systemPrompt = `You are the AfriFlow AI Platform Assistant. 
You guide users on finding courses, applying for tech jobs, and checking gamified progress (XP, streaks). 
Your tone should be highly encouraging, structured, and use standard markdown formatting. 
Keep it clear and actionable. Always propose exactly one clear next step.`;

        // 4. Dispatch to LLM Providers
        const llmResponse = await generateChatResponse(llmMessages, systemPrompt);

        // 5. Save Model Response to DB
        chatSession.messages.push({ 
            role: 'assistant', 
            content: llmResponse.text, 
            timestamp: new Date() 
        });
        
        await chatSession.save();

        // 6. Return payload to Widget
        return NextResponse.json({ 
            text: llmResponse.text,
            provider: llmResponse.provider,
            sessionId: chatSession.sessionId
        }, { status: 200 });

    } catch (error: any) {
        console.error("Chatbot API Route Fault:", error);
        return NextResponse.json({ error: "Failed to process your request." }, { status: 500 });
    }
}

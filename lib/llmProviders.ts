import Anthropic from '@anthropic-ai/sdk';

// Initialize defaults
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export interface LLMMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface LLMResponse {
  text: string;
  provider: string;
}

export async function generateChatResponse(messages: LLMMessage[], systemPrompt?: string): Promise<LLMResponse> {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("No Anthropic API Key found. Using fallback instantly.");
    return fallbackProvider(messages, systemPrompt);
  }

  try {
    // Claude does not take 'system' role in the messages array. It takes a separate 'system' param.
    const anthropicMessages: Anthropic.MessageParam[] = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      }));

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307', // Fast and cheap for general platform guidance
      max_tokens: 1024,
      system: systemPrompt,
      messages: anthropicMessages,
      temperature: 0.7,
    });

    const contentBlock = response.content[0];
    
    let text = '';
    if (contentBlock.type === 'text') {
      text = contentBlock.text;
    }

    return {
      text,
      provider: 'claude'
    };

  } catch (error) {
    console.error('Claude API encountered an error, triggering fallback provider...', error);
    return fallbackProvider(messages, systemPrompt);
  }
}

async function fallbackProvider(messages: LLMMessage[], systemPrompt?: string): Promise<LLMResponse> {
  // TODO: Add OpenAI GPT-4 fallback integration here
  console.warn("Fallback provider initiated. (OpenAI integration pending setup).");
  
  return {
    text: "I am experiencing high traffic right now, but I am still here to help! Could you please try asking your question again in a moment?",
    provider: 'fallback-mock'
  };
}

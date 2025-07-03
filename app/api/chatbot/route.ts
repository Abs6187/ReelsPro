import { NextRequest } from 'next/server';
import { streamText } from 'ai';
import { groq } from '@ai-sdk/groq';

export const maxDuration = 30;

const DEFAULT_SYSTEM_PROMPT = "You are the Reels-PRO Helper, a friendly and knowledgeable AI assistant. Your goal is to help users navigate the Reels-PRO platform. You can answer questions about uploading videos, writing descriptions, commenting, and understanding our community guidelines. If you don't know an answer, politely say so. Keep your responses helpful and concise.";

export async function POST(req: NextRequest) {
  try {
    const { messages: requestMessages, system_prompt: requestSystemPrompt } = await req.json();

    if (!requestMessages || requestMessages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      console.error("Chatbot: Groq API key is not set.");
      return new Response(JSON.stringify({ error: 'AI service not configured. Missing Groq API Key.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const system = requestSystemPrompt || DEFAULT_SYSTEM_PROMPT;
    const modelName = process.env.GROQ_API_MODEL || 'llama3-8b-8192';

    const result = await streamText({
      model: groq(modelName),
      system: system,
      messages: requestMessages,
    });

    return result.toDataStreamResponse();

  } catch (error) {
    console.error("Chatbot API error:", error);
    let errorMessage = "Internal server error";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
} 
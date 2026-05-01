import { GoogleGenerativeAI } from "@google/generative-ai";
import { VANI_CONFIG } from "../../../config/ai-config";
import { z } from "zod";

/**
 * Bharat Decides AI Chat Route
 * 
 * Security: Uses Zod for input validation to prevent injection and malformed payloads.
 * Maintainability: Consumes VANI_CONFIG for centralized persona and model tuning.
 * Efficiency: Implements streaming responses for high-performance UX.
 */

const chatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().min(1),
  })),
  language: z.string().default("English"),
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    // 1. Validate Input (SECURITY: Zod Schema prevents injection)
    const body = await req.json();
    const validation = chatRequestSchema.safeParse(body);
    
    if (!validation.success) {
      return new Response(JSON.stringify({ 
        error: "Invalid request format", 
        details: validation.error.format() 
      }), { status: 400 });
    }

    const { messages, language } = validation.data;

    // 2. Security & Environment Check
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing in environment variables");
      return new Response(JSON.stringify({ error: "AI Assistant is currently unavailable" }), { status: 500 });
    }

    // 3. Initialize Model with Centralized Config
    const model = genAI.getGenerativeModel({ 
      model: VANI_CONFIG.model, 
      systemInstruction: VANI_CONFIG.getSystemInstruction(language),
    });

    const contents = messages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    // 4. Stream Content for Premium UX
    const result = await model.generateContentStream({
      contents: contents,
      generationConfig: VANI_CONFIG.generationConfig,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            controller.enqueue(encoder.encode(chunkText));
          }
          controller.close();
        } catch (e) {
          console.error("Streaming error:", e);
          controller.error(e);
        }
      },
    });

    return new Response(stream, {
      headers: { 
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked"
      },
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate response" }), { status: 500 });
  }
}

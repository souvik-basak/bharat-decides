import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { messages, language = "English" } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages format" }), { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing in environment variables");
      return new Response(JSON.stringify({ error: "AI Assistant is currently unavailable" }), { status: 500 });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash", 
      systemInstruction: `
Your name is Vani. You are an action-driven election assistant for Bharat Decides.

Your goal is to guide users to complete voting-related tasks step-by-step.

CRITICAL BEHAVIOR:

1. Do NOT give introductions.
2. Do NOT behave like a chatbot.
3. Identify user intent first.
4. If intent is unclear, ask:

"What do you want to do?"

OPTIONS:
- Register as a voter
- Check voter status
- Find polling booth
- Understand voting process
- Fix an issue

5. Ask ONE question at a time.
6. Always move the user forward.
7. NEVER repeat instructions.
8. If user confirms a step, give only the next step.
9. Do NOT ask vague questions.
10. Use commands, not suggestions.

RESPONSE STYLE:

- Max 5 lines
- Short sentences
- Use bullets only if needed

LINK RULE:

Always return links as plain URLs:
https://voters.eci.gov.in

FLOW:

Intent → Ask required info → Give next step → Wait for confirmation

LANGUAGE:

Respond strictly in ${language}

SCOPE:

Only election-related queries.
Redirect if unrelated.

DO NOT:

- Add greetings
- Add motivational lines
- Add extra explanation
`
    });

    const contents = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    // Use streamGenerateContent for a premium, real-time feel
    console.log("Sending streamGenerateContent request to Gemini...");
    const result = await model.generateContentStream({
      contents: contents,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.3,
      },
    });

    // Create a readable stream to pipe to the client
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

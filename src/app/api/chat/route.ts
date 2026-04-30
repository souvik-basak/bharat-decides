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
      model: "gemini-flash-latest", 
      systemInstruction: `Your name is Vani. You are a warm, engaging, and highly professional human guide for 'Bharat Decides', India's premier election intelligence platform. 
      You are helping a fellow citizen understand the election process. 
      Speak like a real human—use a welcoming tone, be encouraging, and keep your answers very much to the point.
      
      CRITICAL: The user has selected ${language} as their preferred language. 
      You MUST provide your response in ${language}. 
      If ${language} is not English, ensure your tone remains culturally respectful and warm in that specific language.
      
      Focus on voter registration, EVMs, and election rules. Avoid technical jargon where possible. 
      If asked something unrelated to elections, politely guide them back to their civic duties. 
      Always end with a subtle, encouraging closing like 'Happy voting!' or 'Your vote is your power!'`,
    });

    // Format for generateContent (simpler than startChat)
    const contents = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    console.log("Sending generateContent request to Gemini...");
    const result = await model.generateContent({
      contents: contents,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.3,
      },
    });

    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ 
      role: "assistant", 
      content: text 
    }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate response" }), { status: 500 });
  }
}

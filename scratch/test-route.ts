import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function testFullRoute() {
  const apiKey = process.env.GEMINI_API_KEY;
  try {
    const genAI = new GoogleGenerativeAI(apiKey!);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview",
      systemInstruction: "You are the 'India Election Process Guide'. Keep it short.",
    });

    // Simulate the route logic
    const chat = model.startChat({
      history: [],
      generationConfig: { maxOutputTokens: 500, temperature: 0.3 },
    });

    const lastMessage = "Tell me about Article 326";
    console.log("Sending message to Gemini 3...");
    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    console.log("Response:", response.text());
    console.log("SUCCESS: Route logic is valid!");
  } catch (error) {
    console.error("ERROR in route logic simulation:", error);
  }
}

testFullRoute();

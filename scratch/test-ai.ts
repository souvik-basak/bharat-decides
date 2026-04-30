import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function testAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("ERROR: GEMINI_API_KEY not found in .env");
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    
    console.log("Testing Gemini connection with new key...");
    const result = await model.generateContent("Hello, are you connected?");
    const response = await result.response;
    
    console.log("Response:", response.text());
    console.log("SUCCESS: Backend is connected and Gemini is responding!");
  } catch (error) {
    console.error("ERROR: Failed to connect to Gemini:", error);
  }
}

testAI();

import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    console.log("Listing available models for the new key...");
    
    // In @google/generative-ai, there isn't a direct listModels on the main class 
    // for all versions, so we use the fetch API or check the response
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    if (data.models) {
      console.log("Available Models:");
      data.models.forEach((m: any) => console.log(`- ${m.name}`));
    } else {
      console.log("No models found or error in response:", data);
    }
  } catch (error) {
    console.error("ERROR:", error);
  }
}

listModels();

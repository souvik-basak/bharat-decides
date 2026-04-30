
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

async function test() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    console.log("Listing models...");
    // The SDK doesn't have a direct listModels, but we can try to fetch it or use a known one
    // Actually, let's try gemini-pro which is the most basic one
    const modelNames = ["gemini-pro", "gemini-1.0-pro", "gemini-1.5-pro", "gemini-1.5-flash", "gemini-2.0-flash-exp"];
    for (const name of modelNames) {
      try {
        console.log(`Testing ${name}...`);
        const model = genAI.getGenerativeModel({ model: name });
        const result = await model.generateContent("Hi");
        console.log(`✅ ${name} works!`);
        break;
      } catch (e) {
        console.error(`❌ ${name} failed:`, e.message);
      }
    }
  } catch (e) {
    console.error("Test failed:", e.message);
  }
}

test();

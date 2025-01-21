import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyAxp7cwVS-5JqDwKZemur-rbiW9Gmgwebs";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateResponse(input, tone) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Generate a flirty or cheeky response to the following message, focusing on eliciting a reply from the recipient. The tone should be ${tone}.
  
  User's message: "${input}"
  
  Response:`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
}

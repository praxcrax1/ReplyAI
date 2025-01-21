const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const API_KEY = "AIzaSyD-Mr-OBmVpFEuIcTbyHTaNxHRyZt4j-Lk";
const apiKey = API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    systemInstruction:
        "Generate a short, flirty, or cheeky response to the following message, focusing on eliciting a reply from the recipient. The tone should be ${tone}. Use the buyer's method to create intrigue and encourage a response. Keep the reply concise and to the point, ideally under 20 words.\n\nUser's message: \"${input}\"\n\nResponse:",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

export async function generateResponse(input, tone) {
    try {
        const chatSession = model.startChat({
            generationConfig,
            history: [
                {
                    role: "user",
                    parts: [{ text: `${input}\ntone: ${tone}\n\n` }],
                },
            ],
        });

        const result = await chatSession.sendMessage(input);
        return result.response.text();
    } catch (error) {
        console.error("Error generating response:", error);
        return "Sorry, I couldn't generate a response. Please try again.";
    }
}





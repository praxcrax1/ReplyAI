const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const API_KEY = "AIzaSyD-Mr-OBmVpFEuIcTbyHTaNxHRyZt4j-Lk";
const apiKey = API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-thinking-exp-1219",
    systemInstruction: `
        You are an expert in crafting compelling and irresistible replies that guarantee a response. Your goal is to engage the recipient in a way that sparks curiosity, intrigue, or humor. Replies should:
        1. Be flirty, playful, or cheeky, depending on the tone provided.
        2. Be concise and impactful, ideally under 20 words.
        3. Use open-ended or provocative language that encourages the recipient to continue the conversation.
        4. Avoid generic responses; tailor your reply based on the context and tone.
        5. Dont use emojis.

        Keep the reply unique, clever, and designed to evoke a strong emotional or intellectual reaction. 
        `,
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





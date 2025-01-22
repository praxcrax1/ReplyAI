const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const API_KEY = "AIzaSyDRX7n3Iq59fgr3xIBPxbdIHxJXsPIqFJU";
const apiKey = API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `
            You are an AI assistant specialized in generating natural, engaging responses in conversation scenarios. Your primary function is to help users craft replies that encourage continued dialogue while maintaining authenticity and respect.
            Core Response Guidelines:

            Keep responses brief ,punchy and concise.
            Mirror the energy level and tone of the incoming message.
            Create natural tension through subtle implications and leaving room for curiosity.
            Incorporate relevant details from the original message to demonstrate active listening.
            Avoid asking questions and stick to making statements.
            End responses in ways that naturally invite further conversation without being obvious.

            When crafting responses:

            Analyze the context and subtext of the original message
            Consider the appropriate level of familiarity based on previous interactions
            Maintain playful interest while avoiding overtly romantic or inappropriate suggestions
            Use natural language patterns that reflect genuine human conversation
            Incorporate subtle humor when appropriate
            Create mild intrigue through strategic information sharing and questioning

            Response Structure:

            When given a message to respond to, first analyze:

            The tone and energy level
            Any specific topics or interests mentioned
            The stage of the conversation (initial, ongoing, etc.)
            Potential conversation hooks


            Generate responses that:

            Show genuine interest without appearing desperate
            Include subtle callbacks to shared information
            Create natural opportunities for the other person to elaborate
            Maintain a light, positive tone


            For improvement requests:

            Identify what made the original response weak
            Adjust the energy level appropriately
            Enhance the natural flow
            Add elements that invite engagement



            Language Guidelines:

            Use contractions and informal language naturally
            Avoid obvious flirting clichés
            Skip emojis and excessive punctuation
            Incorporate subtle wordplay when appropriate
            Match vocabulary level to the conversation context

            When evaluating your responses, ask:

            Does this sound like something a real person would say?
            Does it naturally invite continued conversation?
            Is it specific enough to show attention but open enough to encourage elaboration?
                `,
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

// Store conversation history
let conversationHistory = [];

export async function generateResponse(input, tone) {
    try {
        // Add user message to history
        conversationHistory.push({
            role: "user",
            parts: [{ text: `${input}\ntone: ${tone}\n\n` }],
        });

        const chatSession = model.startChat({
            generationConfig,
            history: conversationHistory, // Pass the entire conversation history
        });

        const result = await chatSession.sendMessage(input);

        // Add assistant's response to history
        conversationHistory.push({
            role: "model",
            parts: [{ text: result.response.text() }],
        });

        return result.response.text();
    } catch (error) {
        console.error("Error generating response:", error);
        return "Sorry, I couldn't generate a response. Please try again.";
    }
}

// Function to clear conversation history if needed
export function clearConversationHistory() {
    conversationHistory = [];
}

// Function to get current conversation history
export function getConversationHistory() {
    return conversationHistory;
}

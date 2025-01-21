import React, { useState } from "react";
import {
    View,
    TextInput,
    Button,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Text,
} from "react-native";
import { useTheme } from "../styles/theme";
import ToneSelector from "./ToneSelector";
import ResponsePreview from "./ResponsePreview";
import { generateResponse } from "../utils/geminiApi";
import { saveToFavorites } from "../utils/storage";
import { Ionicons } from "@expo/vector-icons";

export default function InputScreen({ navigation }) {
    const [input, setInput] = useState("");
    const [tone, setTone] = useState("playful");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const { colors } = useTheme();

    const handleGenerateResponse = async () => {
        setLoading(true);
        const generatedResponse = await generateResponse(input, tone);
        setResponse(generatedResponse);
        setLoading(false);
    };

    const handleSaveToFavorites = () => {
        saveToFavorites(response);
    };

    return (
        <View
            style={[styles.container, { backgroundColor: colors.background }]}>
            <TextInput
                style={[
                    styles.input,
                    { color: colors.text, borderColor: colors.border },
                ]}
                value={input}
                onChangeText={setInput}
                placeholder="Enter your message..."
                placeholderTextColor={colors.placeholder}
                multiline={true}
            />
            <ToneSelector selectedTone={tone} onSelectTone={setTone} />
            <TouchableOpacity
                style={[
                    styles.generateButton,
                    { backgroundColor: colors.primary },
                ]}
                onPress={handleGenerateResponse}
                disabled={loading}>
                {loading ? (
                    <ActivityIndicator color={colors.background} />
                ) : (
                    <Text style={styles.generateButtonText}>
                        Generate Response
                    </Text>
                )}
            </TouchableOpacity>
            <ResponsePreview
                response={response}
                onSaveToFavorites={handleSaveToFavorites}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        height: 100,
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20,
        paddingHorizontal: 15,
        paddingTop: 15,
        textAlignVertical: "top",
    },
    generateButton: {
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: "center",
        marginBottom: 20,
    },
    generateButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});

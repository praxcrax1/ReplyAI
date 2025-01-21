import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { useTheme } from "../styles/theme";
import { generateResponse } from "../utils/geminiApi";
import { saveToFavorites } from "../utils/storage";
import ToneSelector from "./ToneSelector";
import ResponsePreview from "./ResponsePreview";

export default function InputScreen({ navigation }) {
    const [input, setInput] = useState("");
    const [tone, setTone] = useState("playful");
    const [response, setResponse] = useState("");
    const { colors } = useTheme();

    const handleGenerateResponse = async () => {
        const generatedResponse = await generateResponse(input, tone);
        setResponse(generatedResponse);
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
            />
            <ToneSelector selectedTone={tone} onSelectTone={setTone} />
            <Button
                title="Generate Response"
                onPress={handleGenerateResponse}
                color={colors.primary}
            />
            <ResponsePreview response={response} />
            <View style={styles.buttonContainer}>
                <Button
                    title="Save to Favorites"
                    onPress={handleSaveToFavorites}
                    color={colors.secondary}
                />
                <Button
                    title="View Favorites"
                    onPress={() => navigation.navigate("Favorites")}
                    color={colors.secondary}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        height: 40,
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
});

import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Dimensions,
    Animated,
    Keyboard,
    Platform,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../styles/theme";
import Markdown from "react-native-markdown-display";
import { endpoint } from "../index.json";
import * as Clipboard from "expo-clipboard";

const TONES = ["flirty", "playful", "professional", "friendly", "sarcastic", "cheeky"];

export default function ChatScreen() {
    const [input, setInput] = useState("");
    const [tone, setTone] = useState("flirty");
    const [aiResponse, setAiResponse] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const { colors } = useTheme();
    const scrollViewRef = useRef(null);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const loaderValue = new Animated.Value(0);

    useEffect(() => {
        if (isThinking) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(loaderValue, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: false,
                    }),
                    Animated.timing(loaderValue, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: false,
                    }),
                ])
            ).start();
        } else {
            loaderValue.setValue(0);
        }
    }, [isThinking]);

    const handleSend = async () => {
        if (input.trim() === "") return;

        setIsThinking(true);
        setAiResponse("");

        try {
            const response = await fetch(`${endpoint}/api/ai/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ input, tone }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setAiResponse(data.response);
        } catch (error) {
            console.error("Error generating response:", error);
            setAiResponse(
                "Sorry, an error occurred while generating the response."
            );
        } finally {
            setIsThinking(false);
        }
    };

    const renderSkeletonLoader = () => {
        const pastelColors = [
            "#FFB3B3", // Soft Red
            "#FFD6A5", // Soft Orange
            "#FFFACD", // Soft Yellow
            "#C8FACC", // Soft Green
            "#ADD8FF", // Soft Blue
            "#D7BCE8", // Soft Indigo
            "#E8B3E8", // Soft Violet
        ];

        const colorInterpolation = loaderValue.interpolate({
            inputRange: pastelColors.map(
                (_, index) => index / (pastelColors.length - 1)
            ),
            outputRange: pastelColors,
        });

        return (
            <View style={styles.skeletonContainer}>
                {[...Array(3)].map((_, index) => (
                    <Animated.View
                        key={index}
                        style={[
                            styles.skeletonLine,
                            {
                                width: `${85 - index * 10}%`,
                                backgroundColor: colorInterpolation,
                            },
                        ]}
                    />
                ))}
            </View>
        );
    };



    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(aiResponse);
    };

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        ref={scrollViewRef}
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled">
                        <View style={styles.responseContainer}>
                            {isThinking ? (
                                renderSkeletonLoader()
                            ) : aiResponse ? (
                                <View style={styles.aiResponseWrapper}>
                                    <Markdown style={markdownStyles(colors)}>
                                        {aiResponse}
                                    </Markdown>
                                    <TouchableOpacity
                                        onPress={copyToClipboard}
                                        style={styles.copyButton}>
                                        <Ionicons
                                            name="copy-outline"
                                            size={24}
                                            color={colors.primary}
                                        />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <Text
                                    style={[
                                        styles.placeholderText,
                                        { color: colors.text },
                                    ]}>
                                    Enter a message and I'll respond here!
                                </Text>
                            )}
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
                <View
                    style={[
                        styles.inputContainer,
                        {
                            paddingBottom:
                                keyboardHeight > 0 ? keyboardHeight : 16,
                        },
                    ]}>
                    <View
                        style={[
                            styles.pickerContainer,
                            { backgroundColor: colors.secondary },
                        ]}>
                        <Picker
                            selectedValue={tone}
                            onValueChange={(itemValue) => setTone(itemValue)}
                            style={[styles.picker, { color: colors.text }]}
                            dropdownIconColor={colors.text}
                            itemStyle={{ height: 120, fontSize: 14 }}>
                            {TONES.map((t) => (
                                <Picker.Item
                                    key={t}
                                    label={
                                        t.charAt(0).toUpperCase() + t.slice(1)
                                    }
                                    value={t}
                                    color={colors.text}
                                />
                            ))}
                        </Picker>
                    </View>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    color: colors.text,
                                    backgroundColor: colors.secondary,
                                },
                            ]}
                            value={input}
                            onChangeText={setInput}
                            placeholder="Type your message here..."
                            placeholderTextColor={colors.placeholder}
                            multiline
                        />
                        <TouchableOpacity
                            style={[
                                styles.sendButton,
                                { backgroundColor: colors.primary },
                            ]}
                            onPress={handleSend}>
                            <Ionicons
                                name="send"
                                size={24}
                                color={colors.background}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContent: {
        width: "100%",
        margin: 0,
        margin : "auto",
        justifyContent: "center",
    },
    responseContainer: {
        padding: 16,
        justifyContent: "center",
    },
    aiResponseWrapper: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    inputContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "#333333",
    },
    pickerContainer: { 
        height: 100,
        backgroundColor: "none",
        borderRadius: 12,
        marginBottom: 12,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "flex-end",
    },
    input: {
        flex: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
        fontSize: 16,
        minHeight: 50,
        maxHeight: 120,
    },
    sendButton: {
        marginLeft: 8,
        padding: 12,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    placeholderText: {
        fontSize: 16,
        textAlign: "center",
    },
    skeletonContainer: {
        alignItems: "flex-start",
    },
    skeletonLine: {
        height: 20,
        borderRadius: 4,
        marginBottom: 8,
    },
    copyButton: {
        alignSelf: "flex-end",
        padding: 8,
    },
});

const markdownStyles = (colors) => ({
    body: {
        color: colors.text,
    },
    heading1: {
        fontSize: 34,
        fontWeight: "bold",
        marginBottom: 12,
        color: colors.text,
    },
    heading2: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 10,
        color: colors.text,
    },
    heading3: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 8,
        color: colors.text,
    },
    paragraph: {
        fontSize: 18,
        fontWeight: "500",
        marginBottom: 14,
        lineHeight: 24,
    },
    link: {
        color: colors.primary,
        textDecorationLine: "underline",
    },
    blockquote: {
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
        paddingLeft: 12,
        fontStyle: "italic",
    },
});

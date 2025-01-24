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
    Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../styles/theme";
import Markdown from "react-native-markdown-display";
import { endpoint } from "../index.json";
import * as ImagePicker from "expo-image-picker";
import * as Clipboard from "expo-clipboard";
import * as FileSystem from "expo-file-system";

const TONES = ["flirty", "playful", "professional", "friendly", "sarcastic"];

export default function ChatScreen() {
    const [input, setInput] = useState("");
    const [tone, setTone] = useState("flirty");
    const [aiResponse, setAiResponse] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const { colors } = useTheme();
    const scrollViewRef = useRef(null);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const loaderValue = new Animated.Value(0);
    const [image, setImage] = useState(null);

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

    const pickImage = async () => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status === "granted") {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        } else {
            alert("Permission to access camera roll is required!");
        }
    };

    const handleSend = async () => {
        if (input.trim() === "" && !image) return;

        setIsThinking(true);
        setAiResponse("");

        let imageBase64 = null;
        if (image) {
            imageBase64 = await FileSystem.readAsStringAsync(image, {
                encoding: FileSystem.EncodingType.Base64,
            });
        }

        try {
            const response = await fetch(`${endpoint}/api/ai/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ input, tone, imageBase64 }),
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
            "#FFB3B3",
            "#FFD6A5",
            "#FFFACD",
            "#C8FACC",
            "#ADD8FF",
            "#D7BCE8",
            "#E8B3E8",
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
                            <View
                                style={[
                                    styles.aiResponseWrapper,
                                    { borderColor: colors.border },
                                ]}>
                                {isThinking ? (
                                    renderSkeletonLoader()
                                ) : aiResponse ? (
                                    <>
                                        <Markdown
                                            style={markdownStyles(colors)}>
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
                                    </>
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
                            styles.toneSelector,
                            { borderColor: colors.border },
                        ]}>
                        <Text
                            style={[
                                styles.toneSelectorLabel,
                                { color: colors.text },
                            ]}>
                            Set Tone:
                        </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}>
                            {TONES.map((t) => (
                                <TouchableOpacity
                                    key={t}
                                    style={[
                                        styles.toneButton,
                                        tone === t && styles.selectedToneButton,
                                        { borderColor: colors.border },
                                    ]}
                                    onPress={() => setTone(t)}>
                                    <Text
                                        style={[
                                            styles.toneButtonText,
                                            {
                                                color:
                                                    tone === t
                                                        ? colors.background
                                                        : colors.text,
                                            },
                                        ]}>
                                        {t.charAt(0).toUpperCase() + t.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                    <View
                        style={[
                            styles.inputWrapper,
                            { borderColor: colors.border },
                        ]}>
                        {image && (
                            <View style={styles.imagePreviewContainer}>
                                <Image
                                    source={{ uri: image }}
                                    style={styles.imagePreview}
                                />
                                <TouchableOpacity
                                    style={styles.removeImageButton}
                                    onPress={() => setImage(null)}>
                                    <Ionicons
                                        name="close-circle"
                                        size={24}
                                        color="white"
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
                        <View>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        color: colors.text,
                                    },
                                ]}
                                value={input}
                                onChangeText={setInput}
                                placeholder="Type your message here..."
                                placeholderTextColor={colors.placeholder}
                                multiline
                            />
                        </View>
                        <View style={styles.actionBtn}>
                            <TouchableOpacity
                                style={[
                                    styles.sendButton,
                                    { backgroundColor: colors.primary },
                                ]}
                                onPress={pickImage}>
                                <Ionicons
                                    name="attach"
                                    size={18}
                                    color={colors.background}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.sendButton,
                                    { backgroundColor: colors.primary },
                                ]}
                                onPress={handleSend}>
                                <Ionicons
                                    name="send"
                                    size={18}
                                    color={colors.background}
                                />
                            </TouchableOpacity>
                        </View>
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
        margin: "auto",
        justifyContent: "center",
    },
    responseContainer: {
        padding: 16,
        justifyContent: "center",
    },
    aiResponseWrapper: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        marginBottom: 16,
    },
    inputContainer: {
        padding: 16,
    },
    toneSelector: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
    },
    toneSelectorLabel: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 18,
    },
    toneButton: {
        borderWidth: 1,
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    selectedToneButton: {
        backgroundColor: "#FFFFFF",
    },
    toneButtonText: {
        fontSize: 14,
    },
    inputWrapper: {
        borderWidth: 1,
        padding: 15,
        borderRadius: 10,
        flexDirection: "column",
    },
    actionBtn: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8,
    },
    input: {
        borderRadius: 10,
        fontSize: 16,
        minHeight: 40,
        maxHeight: 120,
    },
    sendButton: {
        padding: 10,
        borderRadius: 30,
    },
    placeholderText: {
        fontSize: 16,
        textAlign: "center",
    },
    skeletonContainer: {
        width: "100%",
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
    imagePreviewContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    imagePreview: {
        width: 40,
        height: 40,
        borderRadius: 8,
        marginRight: 8,
    },
    removeImageButton: {
        padding: 5,
    },
    space: {
        alignSelf: "center",
    },
});

const markdownStyles = (colors) => ({
    body: {
        color: colors.text,
        fontSize: 28,
        fontWeight: "bold",
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
        fontSize: 20,
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

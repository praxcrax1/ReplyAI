import React, { useState, useRef, useEffect } from "react";
import {
    View,
    TextInput,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Text,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Keyboard,
    TouchableWithoutFeedback,
    PanResponder,
} from "react-native";
import { useTheme } from "../styles/theme";
import { generateResponse } from "../utils/geminiApi";
import { saveToFavorites, removeFavorite } from "../utils/storage";
import { Ionicons } from "@expo/vector-icons";
import ToneSelector from "./ToneSelector";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChatScreen() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [tone, setTone] = useState("playful");
    const [showToneSelector, setShowToneSelector] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const { colors } = useTheme();
    const flatListRef = useRef(null);
    const insets = useSafeAreaInsets();
    const thinkingAnimation = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
            },
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 10) {
                    Keyboard.dismiss();
                }
            },
        })
    ).current;

    const startThinkingAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(thinkingAnimation, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(thinkingAnimation, {
                    toValue: 0.3,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages]);

    useEffect(() => {
        if (isThinking) {
            startThinkingAnimation();
        } else {
            thinkingAnimation.stopAnimation();
            thinkingAnimation.setValue(0);
        }
    }, [isThinking]);

    const handleInputChange = (text) => {
        setInput(text);
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const handleSend = async () => {
        if (input.trim() === "") return;

        const userMessage = { id: Date.now(), text: input, sender: "user" };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInput("");
        setIsThinking(true);

        try {
            const aiResponse = await generateResponse(input, tone);
            const aiMessage = {
                id: Date.now() + 1,
                text: aiResponse,
                sender: "ai",
                isFavorite: false,
            };
            setMessages((prevMessages) => [...prevMessages, aiMessage]);
        } catch (error) {
            console.error("Error generating response:", error);
        } finally {
            setIsThinking(false);
        }

        flatListRef.current?.scrollToEnd({ animated: true });
    };

    const handleFavoriteToggle = async (message) => {
        if (message.isFavorite) {
            await removeFavorite(message.text);
        } else {
            await saveToFavorites(message.text);
        }
        setMessages((prevMessages) =>
            prevMessages.map((msg) =>
                msg.id === message.id
                    ? { ...msg, isFavorite: !msg.isFavorite }
                    : msg
            )
        );
    };

    const renderMessage = ({ item, index }) => {
        const isLastMessage = index === messages.length - 1;

        return (
            <View>
                <View
                    style={[
                        styles.messageBubble,
                        item.sender === "user"
                            ? styles.userBubble
                            : styles.aiBubble,
                    ]}>
                    <Text
                        style={[
                            styles.messageText,
                            {
                                color:
                                    item.sender === "user"
                                        ? colors.background
                                        : colors.text,
                            },
                        ]}>
                        {item.text}
                    </Text>
                    {item.sender === "ai" && (
                        <TouchableOpacity
                            onPress={() => handleFavoriteToggle(item)}
                            style={styles.favoriteButton}>
                            <Ionicons
                                name={
                                    item.isFavorite ? "heart" : "heart-outline"
                                }
                                size={20}
                                color={colors.primary}
                            />
                        </TouchableOpacity>
                    )}
                </View>
                {isLastMessage && isThinking && (
                    <Animated.View
                        style={[
                            styles.thinkingContainer,
                            { opacity: thinkingAnimation },
                        ]}>
                        <Text style={styles.thinkingText}>
                            AI is thinking...
                        </Text>
                    </Animated.View>
                )}
            </View>
        );
    };


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={[
                    styles.container,
                    { backgroundColor: colors.background },
                ]}
                keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 0}>
                <View {...panResponder.panHandlers} style={styles.container}>
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderMessage}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={[
                            styles.messageList,
                            { paddingBottom: insets.bottom + 60 },
                        ]}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    />
                    {showToneSelector && (
                        <ToneSelector
                            selectedTone={tone}
                            onSelectTone={(newTone) => {
                                setTone(newTone);
                                setShowToneSelector(false);
                            }}
                            onClose={() => setShowToneSelector(false)}
                        />
                    )}
                    <View
                        style={[
                            styles.inputContainer,
                            { paddingBottom: insets.bottom },
                        ]}>
                        <TouchableOpacity
                            onPress={() =>
                                setShowToneSelector(!showToneSelector)
                            }
                            style={styles.toneButton}>
                            <Ionicons
                                name="options-outline"
                                size={24}
                                color={colors.primary}
                            />
                        </TouchableOpacity>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    color: colors.text,
                                    borderColor: colors.border,
                                },
                            ]}
                            value={input}
                            onChangeText={handleInputChange}
                            placeholder="Type a message..."
                            placeholderTextColor={colors.placeholder}
                        />
                        <TouchableOpacity
                            onPress={handleSend}
                            style={styles.sendButton}>
                            <Ionicons
                                name="send"
                                size={24}
                                color={colors.primary}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    messageList: {
        paddingHorizontal: 15,
    },
    messageBubble: {
        maxWidth: "80%",
        padding: 12,
        borderRadius: 20,
        marginVertical: 5,
    },
    userBubble: {
        alignSelf: "flex-end",
        backgroundColor: "#FFFFFF",
    },
    aiBubble: {
        alignItems: "flex-end",
        alignSelf: "flex-start",
        backgroundColor: "#333333",
    },
    messageText: {
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingTop: 13.5,
        borderTopWidth: 1,
        borderTopColor: "#333333",
        backgroundColor: "#000000",
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        marginHorizontal: 10,
    },
    toneButton: {
        padding: 5,
    },
    sendButton: {
        padding: 5,
    },
    favoriteButton: {
        right: 5,
    },
    thinkingContainer: {
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        padding: 10,
        borderRadius: 20,
        marginTop: 10,
        marginLeft: 10,
    },
    thinkingText: {
        color: "#FFFFFF",
        fontStyle: "italic",
    },
});

import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../styles/theme";
import { getChats, deleteChat } from "../utils/storage";
import { Ionicons } from "@expo/vector-icons";

export default function ChatHistoryScreen() {
    const [chats, setChats] = useState({});
    const navigation = useNavigation();
    const { colors } = useTheme();

    useEffect(() => {
        loadChats();
    }, []);

    const loadChats = async () => {
        const loadedChats = await getChats();
        setChats(loadedChats);
    };

    const handleChatPress = (chatId) => {
        navigation.navigate("Chat", { chatId });
    };

    const handleNewChat = () => {
        const newChatId = Date.now().toString();
        navigation.navigate("Chat", { chatId: newChatId });
    };

    const handleDeleteChat = async (chatId) => {
        await deleteChat(chatId);
        loadChats();
    };

    const renderChatItem = ({ item: chatId }) => {
        const chatMessages = chats[chatId];
        const lastMessage = chatMessages[chatMessages.length - 1];
        const previewText = lastMessage
            ? lastMessage.text.slice(0, 30) + "..."
            : "Empty chat";

        return (
            <TouchableOpacity
                style={[styles.chatItem, { backgroundColor: colors.secondary }]}
                onPress={() => handleChatPress(chatId)}>
                <View style={styles.chatPreview}>
                    <Text style={[styles.chatTitle, { color: colors.text }]}>
                        Chat {chatId}
                    </Text>
                    <Text
                        style={[
                            styles.chatPreviewText,
                            { color: colors.text },
                        ]}>
                        {previewText}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => handleDeleteChat(chatId)}
                    style={styles.deleteButton}>
                    <Ionicons
                        name="trash-outline"
                        size={24}
                        color={colors.primary}
                    />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <View
            style={[styles.container, { backgroundColor: colors.background }]}>
            <TouchableOpacity
                style={[
                    styles.newChatButton,
                    { backgroundColor: colors.primary },
                ]}
                onPress={handleNewChat}>
                <Text
                    style={[
                        styles.newChatButtonText,
                        { color: colors.background },
                    ]}>
                    New Chat
                </Text>
            </TouchableOpacity>
            <FlatList
                data={Object.keys(chats)}
                renderItem={renderChatItem}
                keyExtractor={(item) => item}
                contentContainerStyle={styles.chatList}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    newChatButton: {
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 20,
    },
    newChatButtonText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    chatList: {
        flexGrow: 1,
    },
    chatItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    chatPreview: {
        flex: 1,
    },
    chatTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    chatPreviewText: {
        fontSize: 14,
    },
    deleteButton: {
        padding: 5,
    },
});

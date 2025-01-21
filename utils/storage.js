import AsyncStorage from "@react-native-async-storage/async-storage";

const CHATS_KEY = "chats";
const FAVORITES_KEY = "favorites";

export async function saveChat(chatId, messages) {
    try {
        const chats = await getChats();
        chats[chatId] = messages;
        await AsyncStorage.setItem(CHATS_KEY, JSON.stringify(chats));
    } catch (error) {
        console.error("Error saving chat:", error);
    }
}

export async function getChats() {
    try {
        const chats = await AsyncStorage.getItem(CHATS_KEY);
        return chats ? JSON.parse(chats) : {};
    } catch (error) {
        console.error("Error getting chats:", error);
        return {};
    }
}

export async function getChatMessages(chatId) {
    try {
        const chats = await getChats();
        return chats[chatId] || [];
    } catch (error) {
        console.error("Error getting chat messages:", error);
        return [];
    }
}

export async function deleteChat(chatId) {
    try {
        const chats = await getChats();
        delete chats[chatId];
        await AsyncStorage.setItem(CHATS_KEY, JSON.stringify(chats));
    } catch (error) {
        console.error("Error deleting chat:", error);
    }
}

export async function saveToFavorites(response) {
    try {
        const favorites = await getFavorites();
        if (!favorites.includes(response)) {
            favorites.push(response);
            await AsyncStorage.setItem(
                FAVORITES_KEY,
                JSON.stringify(favorites)
            );
        }
    } catch (error) {
        console.error("Error saving to favorites:", error);
    }
}

export async function removeFavorite(index) {
    try {
        const favorites = await getFavorites();
        favorites.splice(index, 1);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
        console.error("Error removing favorite:", error);
    }
}

export async function getFavorites() {
    try {
        const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
        return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
        console.error("Error getting favorites:", error);
        return [];
    }
}

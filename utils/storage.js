import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "favorites";

export async function saveToFavorites(response) {
    try {
        const favorites = await getFavorites();
        favorites.push(response);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
        console.error("Error saving to favorites:", error);
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

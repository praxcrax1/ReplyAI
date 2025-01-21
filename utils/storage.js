import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "favorites";

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

export async function isFavorite(response) {
    try {
        const favorites = await getFavorites();
        return favorites.includes(response);
    } catch (error) {
        console.error("Error checking if favorite:", error);
        return false;
    }
}

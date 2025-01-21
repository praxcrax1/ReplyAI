import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from "react-native";
import { useTheme } from "../styles/theme";
import { getFavorites, removeFavorite } from "../utils/storage";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FavoritesScreen() {
    const [favorites, setFavorites] = useState([]);
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        const savedFavorites = await getFavorites();
        setFavorites(savedFavorites);
    };

    const handleRemoveFavorite = async (index) => {
        Alert.alert(
            "Remove Favorite",
            "Are you sure you want to remove this favorite?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Remove",
                    onPress: async () => {
                        await removeFavorite(index);
                        setFavorites((prevFavorites) =>
                            prevFavorites.filter((_, i) => i !== index)
                        );
                    },
                    style: "destructive",
                },
            ]
        );
    };

    const renderItem = ({ item, index }) => (
        <View
            style={[
                styles.favoriteItem,
                { backgroundColor: colors.secondary },
            ]}>
            <Text style={[styles.favoriteText, { color: colors.text }]}>
                {item}
            </Text>
            <TouchableOpacity
                onPress={() => handleRemoveFavorite(index)}
                style={styles.removeButton}>
                <Ionicons
                    name="trash-outline"
                    size={24}
                    color={colors.primary}
                />
            </TouchableOpacity>
        </View>
    );

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: colors.background,
                    paddingBottom: insets.bottom,
                },
            ]}>
            <FlatList
                data={favorites}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons
                            name="heart-outline"
                            size={64}
                            color={colors.primary}
                        />
                        <Text
                            style={[styles.emptyText, { color: colors.text }]}>
                            No favorites yet
                        </Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    favoriteItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
    },
    favoriteText: {
        fontSize: 16,
        flex: 1,
    },
    removeButton: {
        marginLeft: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
    },
    emptyText: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 18,
    },
});

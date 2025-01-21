import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { getFavorites } from "../utils/storage";
import { useTheme } from "../styles/theme";

export default function FavoritesScreen() {
    const [favorites, setFavorites] = useState([]);
    const { colors } = useTheme();

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        const savedFavorites = await getFavorites();
        setFavorites(savedFavorites);
    };

    const renderItem = ({ item }) => (
        <View style={[styles.favoriteItem, { borderColor: colors.border }]}>
            <Text style={[styles.favoriteText, { color: colors.text }]}>
                {item}
            </Text>
        </View>
    );

    return (
        <View
            style={[styles.container, { backgroundColor: colors.background }]}>
            <FlatList
                data={favorites}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={
                    <Text style={[styles.emptyText, { color: colors.text }]}>
                        No favorites yet
                    </Text>
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
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    favoriteText: {
        fontSize: 14,
    },
    emptyText: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
    },
});

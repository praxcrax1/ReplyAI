import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../styles/theme";

export default function CustomHeader() {
    const navigation = useNavigation();
    const { colors } = useTheme();

    return (
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
            <Text style={styles.title}>Reply AI</Text>
            <TouchableOpacity
                style={styles.favoritesButton}
                onPress={() => navigation.navigate("Favorites")}>
                <Ionicons
                    name="heart-outline"
                    size={24}
                    color={colors.background}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
        paddingHorizontal: 20,
        height: 60,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    favoritesButton: {
        padding: 5,
    },
});

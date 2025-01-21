import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../styles/theme";
import { Ionicons } from "@expo/vector-icons";

export default function ResponsePreview({ response, onSaveToFavorites }) {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: colors.text }]}>
                Generated Response:
            </Text>
            <View style={styles.responseContainer}>
                <Text style={[styles.response, { color: colors.text }]}>
                    {response}
                </Text>
                {response && (
                    <TouchableOpacity
                        onPress={onSaveToFavorites}
                        style={styles.favoriteButton}>
                        <Ionicons
                            name="heart-outline"
                            size={24}
                            color={colors.primary}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
    },
    responseContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        backgroundColor: "#F0F0F0",
        borderRadius: 10,
        padding: 15,
    },
    response: {
        fontSize: 14,
        flex: 1,
    },
    favoriteButton: {
        marginLeft: 10,
    },
});

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../styles/theme";

export default function ResponsePreview({ response }) {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: colors.text }]}>
                Generated Response:
            </Text>
            <Text style={[styles.response, { color: colors.text }]}>
                {response}
            </Text>
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
        marginBottom: 5,
    },
    response: {
        fontSize: 14,
    },
});

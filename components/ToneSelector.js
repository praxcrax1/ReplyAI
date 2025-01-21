import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../styles/theme";

const tones = ["playful", "romantic", "sarcastic", "mysterious"];

export default function ToneSelector({ selectedTone, onSelectTone }) {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: colors.text }]}>
                Select Tone:
            </Text>
            <View style={styles.toneContainer}>
                {tones.map((tone) => (
                    <TouchableOpacity
                        key={tone}
                        style={[
                            styles.toneButton,
                            {
                                backgroundColor:
                                    selectedTone === tone
                                        ? colors.primary
                                        : colors.background,
                            },
                        ]}
                        onPress={() => onSelectTone(tone)}>
                        <Text
                            style={[
                                styles.toneText,
                                {
                                    color:
                                        selectedTone === tone
                                            ? colors.background
                                            : colors.text,
                                },
                            ]}>
                            {tone}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
    },
    toneContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    toneButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        marginRight: 10,
        marginBottom: 10,
    },
    toneText: {
        fontSize: 14,
    },
});

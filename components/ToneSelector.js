import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
} from "react-native";
import { useTheme } from "../styles/theme";
import { Ionicons } from "@expo/vector-icons";

const tones = ["playful", "romantic", "sarcastic", "mysterious"];

export default function ToneSelector({ selectedTone, onSelectTone, onClose }) {
    const { colors } = useTheme();

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.toneButton,
                {
                    backgroundColor:
                        selectedTone === item ? colors.primary : "transparent",
                },
            ]}
            onPress={() => onSelectTone(item)}>
            <Text
                style={[
                    styles.toneText,
                    {
                        color:
                            selectedTone === item
                                ? colors.background
                                : colors.primary,
                    },
                ]}>
                {item}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.dropdown,
                    { backgroundColor: `${colors.background}E6` },
                ]}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>
                        Select Tone
                    </Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons
                            name="close"
                            size={24}
                            color={colors.primary}
                        />
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={tones}
                    renderItem={renderItem}
                    keyExtractor={(item) => item}
                    contentContainerStyle={styles.listContainer}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 100,
        left: 0,
        right: 0,
        justifyContent: "flex-end",
    },
    dropdown: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: "hidden",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#333333",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
    },
    listContainer: {
        paddingVertical: 10,
    },
    toneButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    toneText: {
        fontSize: 16,
        fontWeight: "500",
    },
});

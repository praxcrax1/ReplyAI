import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../styles/theme";

export default function CustomDrawerContent(props) {
    const { colors } = useTheme();

    return (
        <DrawerContentScrollView
            {...props}
            contentContainerStyle={styles.container}>
            <View style={styles.drawerContent}>
                <TouchableOpacity
                    style={styles.drawerItem}
                    onPress={() => props.navigation.navigate("Chat")}>
                    <Ionicons
                        name="chatbubbles-outline"
                        size={24}
                        color={colors.text}
                    />
                    <Text
                        style={[styles.drawerItemText, { color: colors.text }]}>
                        Chat
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.drawerItem}
                    onPress={() => props.navigation.navigate("Favorites")}>
                    <Ionicons
                        name="heart-outline"
                        size={24}
                        color={colors.text}
                    />
                    <Text
                        style={[styles.drawerItemText, { color: colors.text }]}>
                        Favorites
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.bottomContent}>
                <TouchableOpacity
                    style={styles.drawerItem}
                    onPress={() => props.navigation.navigate("Profile")}>
                    <Ionicons
                        name="person-outline"
                        size={15}
                        color={colors.text}
                    />
                    <Text
                        style={[styles.drawerItemText, { color: colors.text }]}>
                        Profile
                    </Text>
                </TouchableOpacity>
            </View>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    drawerContent: {
        flex: 1,
        paddingTop: 20,
    },
    bottomContent: {
        borderTopWidth: 1,
        borderTopColor: "#ccc",
    },
    drawerItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
    },
    drawerItemText: {
        fontSize: 16,
        marginLeft: 10,
    },
});

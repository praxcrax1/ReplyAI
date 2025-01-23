import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import ChatScreen from "./components/ChatScreen";
import ProfileScreen from "./components/ProfileScreen";
import CustomDrawerContent from "./components/CustomDrawerContent";
import { ThemeProvider } from "./styles/theme";

const Drawer = createDrawerNavigator();

export default function App() {
    return (
        <ThemeProvider>
            <SafeAreaProvider>
                <StatusBar style="light" />
                <NavigationContainer>
                    <Drawer.Navigator
                        initialRouteName="Chat"
                        drawerContent={(props) => (
                            <CustomDrawerContent {...props} />
                        )}
                        screenOptions={{
                            headerShown: true,
                            headerStyle: {
                                backgroundColor: "#000000",
                            },
                            headerTintColor: "#fff",
                            headerTitleStyle: {
                                fontWeight: "bold",
                            },
                            drawerStyle: {
                                backgroundColor: "#000000",
                            },
                            drawerLabelStyle: {
                                color: "#FFFFFF",
                            },
                        }}>
                        <Drawer.Screen
                            name="Chat"
                            component={ChatScreen}
                            options={{ title: "Reply AI" }}
                        />
                        <Drawer.Screen
                            name="Profile"
                            component={ProfileScreen}
                        />
                    </Drawer.Navigator>
                </NavigationContainer>
            </SafeAreaProvider>
        </ThemeProvider>
    );
}

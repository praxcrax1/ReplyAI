import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import ChatScreen from "./components/ChatScreen";
import ProfileScreen from "./components/ProfileScreen";
import LoginScreen from "./components/LoginScreen";
import CustomDrawerContent from "./components/CustomDrawerContent";
import { ThemeProvider } from "./styles/theme";
import SignUpScreen from "./components/SignUpScreen";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function DrawerNavigator() {
    return (
        <Drawer.Navigator
            initialRouteName="Chat"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: true,
                headerStyle: { backgroundColor: "#000000" },
                headerTintColor: "#fff",
                drawerStyle: { backgroundColor: "#000000" },
                drawerLabelStyle: { color: "#FFFFFF" },
            }}>
            <Drawer.Screen
                name="Chat"
                component={ChatScreen}
                options={{ title: "Reply AI" }}
            />
            <Drawer.Screen name="Profile" component={ProfileScreen} />
        </Drawer.Navigator>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <SafeAreaProvider>
                <StatusBar style="light" />
                <NavigationContainer>
                    <Stack.Navigator
                        initialRouteName="Login"
                        screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="SignUp" component={SignUpScreen} />
                        <Stack.Screen
                            name="Drawer"
                            component={DrawerNavigator}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </SafeAreaProvider>
        </ThemeProvider>
    );
}

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import InputScreen from "./components/InputScreen";
import FavoritesScreen from "./components/FavoritesScreen";
import { ThemeProvider } from "./styles/theme";

const Stack = createStackNavigator();

export default function App() {
    return (
        <ThemeProvider>
            <SafeAreaProvider>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="Input">
                        <Stack.Screen
                            name="Input"
                            component={InputScreen}
                            options={{ title: "Reply AI" }}
                        />
                        <Stack.Screen
                            name="Favorites"
                            component={FavoritesScreen}
                            options={{ title: "Favorites" }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </SafeAreaProvider>
        </ThemeProvider>
    );
}

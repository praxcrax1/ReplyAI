import React, { useState } from "react";
import {
    View,
    TextInput,
    Button,
    Text,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../styles/theme";
import { app } from "../utils/firebaseConfig";
import AnimatedBackground from "../components/AnimatedBackground";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const { colors } = useTheme();

    const handleLogin = async () => {
        const auth = getAuth(app);
        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.navigate("Drawer", { screen: "Chat" });
        } catch (error) {
            Alert.alert("Login Error", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={[styles.container, { backgroundColor: colors.background }]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.inner}>
                    <AnimatedBackground />
                    <Text style={[styles.title, { color: colors.text }]}>
                        Welcome to ReplyAI
                    </Text>
                    <View style={styles.formContainer}>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    color: colors.text,
                                    borderColor: colors.border,
                                },
                            ]}
                            placeholder="Email"
                            placeholderTextColor={colors.placeholder}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            editable={!isLoading}
                        />
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    color: colors.text,
                                    borderColor: colors.border,
                                },
                            ]}
                            placeholder="Password"
                            placeholderTextColor={colors.placeholder}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            editable={!isLoading}
                        />
                        {isLoading ? (
                            <ActivityIndicator
                                size="large"
                                color={colors.primary}
                            />
                        ) : (
                            <Button
                                title="Login"
                                onPress={handleLogin}
                                color={colors.primary}
                            />
                        )}
                        <Text
                            style={[styles.link, { color: colors.primary }]}
                            onPress={() => navigation.navigate("SignUp")}>
                            Don't have an account? Sign Up
                        </Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inner: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 30,
        textAlign: "center",
    },
    formContainer: {
        width: "100%",
        maxWidth: 400,
    },
    input: {
        borderWidth: 1,
        padding: 15,
        marginBottom: 20,
        borderRadius: 10,
        fontSize: 16,
    },
    link: {
        marginTop: 20,
        textAlign: "center",
        textDecorationLine: "underline",
        fontSize: 16,
    },
});

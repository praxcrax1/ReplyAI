import React, { useState } from "react";
import {
    View,
    TextInput,
    Button,
    Text,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useTheme } from "../styles/theme";
import { app } from "../utils/firebaseConfig";
import AnimatedBackground from "../components/AnimatedBackground";

export default function SignUpScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { colors } = useTheme();

    const handleSignUp = async () => {
        const auth = getAuth(app);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            Alert.alert("Success", "Account created!");
            navigation.navigate("Login");
        } catch (error) {
            Alert.alert("Signup Error", error.message);
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
                        Join ReplyAI
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
                        />
                        <Button
                            title="Sign Up"
                            onPress={handleSignUp}
                            color={colors.primary}
                        />
                        <Text
                            style={[styles.link, { color: colors.primary }]}
                            onPress={() => navigation.navigate("Login")}>
                            Already have an account? Login
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

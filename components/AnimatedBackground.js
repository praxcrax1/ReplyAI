import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const AnimatedBackground = () => {
    const animation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(animation, {
                toValue: 1,
                duration: 10000,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, height],
    });

    return (
        <View style={StyleSheet.absoluteFill}>
            <Animated.View
                style={[
                    styles.animatedBackground,
                    {
                        transform: [{ translateY }],
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    animatedBackground: {
        position: "absolute",
        width: width * 2,
        height: height * 2,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: height,
        transform: [{ rotate: "45deg" }],
    },
});

export default AnimatedBackground;

import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import { useTheme } from "../styles/theme";

const { width, height } = Dimensions.get("window");
const NUM_BOXES = 20;

const AnimatedBackground = () => {
    const { colors } = useTheme();
    const animations = useRef(
        Array(NUM_BOXES)
            .fill()
            .map(() => new Animated.Value(0))
    ).current;

    useEffect(() => {
        const animateBox = (index) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.timing(animations[index], {
                        toValue: 1,
                        duration: 3000 + Math.random() * 2000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(animations[index], {
                        toValue: 0,
                        duration: 3000 + Math.random() * 2000,
                        useNativeDriver: true,
                    }),
                ])
            );
        };

        Animated.stagger(
            200,
            animations.map((_, index) => animateBox(index))
        ).start();
    }, []);

    const renderBox = (index) => {
        const size = 20 + Math.random() * 60;
        const startX = Math.random() * width;
        const startY = Math.random() * height;

        const translateY = animations[index].interpolate({
            inputRange: [0, 1],
            outputRange: [startY, startY - 100],
        });

        const opacity = animations[index].interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0.5, 0],
        });

        const rotate = animations[index].interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "360deg"],
        });

        return (
            <Animated.View
                key={index}
                style={[
                    styles.box,
                    {
                        width: size,
                        height: size,
                        left: startX,
                        transform: [{ translateY }, { rotate }],
                        opacity,
                    },
                ]}
            />
        );
    };

    return (
        <View style={[StyleSheet.absoluteFill, styles.container]}>
            {animations.map((_, index) => renderBox(index))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
    },
    box: {
        position: "absolute",
        borderWidth: 1,
        borderColor: "#666666",
        borderRadius: 10,
    },
});

export default AnimatedBackground;

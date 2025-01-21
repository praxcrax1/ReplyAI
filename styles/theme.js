import React, { createContext, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const theme = {
        colors: {
            background: "#000000",
            text: "#FFFFFF",
            primary: "#FFFFFF",
            secondary: "#333333",
            border: "#333333",
            placeholder: "#666666",
        },
    };

    return (
        <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

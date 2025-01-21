import React, { createContext, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const theme = {
        colors: {
            background: "#FFFFFF",
            text: "#000000",
            primary: "#007AFF",
            secondary: "#5856D6",
            border: "#E5E5EA",
            placeholder: "#C7C7CC",
        },
    };

    return (
        <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

const THEME_STORAGE_KEY = "theme";

function getInitialTheme() {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (storedTheme === "light" || storedTheme === "dark") {
        return storedTheme;
    }

    return "dark";
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        const root = document.documentElement;

        root.dataset.theme = theme;
        root.classList.toggle("dark", theme === "dark");
        root.classList.toggle("light", theme === "light");

        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    function toggleTheme() {
        setTheme((currentTheme) =>
            currentTheme === "dark" ? "light" : "dark"
        );
    }

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme,
                toggleTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme deve ser usado dentro de ThemeProvider.");
    }

    return context;
}
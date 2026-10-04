import { Moon, Sun } from "lucide-react";

import { useTheme } from "../../contexts/ThemeContext";

function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    const isDark = theme === "dark";

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
            role="switch"
            aria-checked={isDark}
            className={`
                relative flex h-10 w-19 shrink-0 items-center
                rounded-full p-1
                border
                outline-none
                transition-all duration-300 ease-out
                focus-visible:ring-2
                focus-visible:ring-blue-500/40
                focus-visible:ring-offset-2
                ${
                    isDark
                        ? "border-white/10 bg-zinc-900"
                        : "border-zinc-200 bg-zinc-100"
                }
            `}
        >
            {/* Indicador deslizante */}
            <span
                aria-hidden="true"
                className={`
                    absolute top-1 flex h-8 w-8 items-center justify-center
                    rounded-full
                    shadow-sm
                    transition-all duration-300
                    ease-in-out
                    ${
                        isDark
                            ? "left-10 bg-zinc-800 text-zinc-100 shadow-black/30"
                            : "left-1 bg-white text-amber-500 shadow-zinc-300/50"
                    }
                `}
            >
                {isDark ? (
                    <Moon
                        size={16}
                        strokeWidth={2}
                        className="transition-transform duration-300"
                    />
                ) : (
                    <Sun
                        size={16}
                        strokeWidth={2}
                        className="transition-transform duration-300"
                    />
                )}
            </span>

            {/* Ícones de contexto */}
            <span
                aria-hidden="true"
                className={`
                    absolute left-2.5 transition-opacity duration-200
                    ${
                        isDark
                            ? "text-zinc-600 opacity-100"
                            : "text-zinc-400 opacity-0"
                    }
                `}
            >
                <Sun size={15} strokeWidth={1.8} />
            </span>

            <span
                aria-hidden="true"
                className={`
                    absolute right-2.5 transition-opacity duration-200
                    ${
                        isDark
                            ? "text-zinc-500 opacity-0"
                            : "text-zinc-400 opacity-100"
                    }
                `}
            >
                <Moon size={15} strokeWidth={1.8} />
            </span>
        </button>
    );
}

export default ThemeToggle;

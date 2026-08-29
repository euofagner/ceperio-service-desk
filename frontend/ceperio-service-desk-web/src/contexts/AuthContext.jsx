import { createContext, useContext, useState } from "react";
import { login as loginRequest } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    async function login(credentials) {
        const data = await loginRequest(credentials);

        localStorage.setItem("token", data.token);

        const loggedUser = {
            userId: data.userId,
            name: data.name,
            email: data.email,
            role: data.role,
        };

        localStorage.setItem("user", JSON.stringify(loggedUser));
        setUser(loggedUser);

        return data;
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: !!user,
            }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de AuthProvider.");
    }
    return context;
}
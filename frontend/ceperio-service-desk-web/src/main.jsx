import React from "react";
import ReactDOM from "react-dom/client";

import { RouterProvider } from "react-router-dom";

import { router } from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ThemeProvider>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </ThemeProvider>
    </React.StrictMode>
);
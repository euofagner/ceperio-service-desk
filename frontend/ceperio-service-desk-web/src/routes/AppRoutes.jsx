import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardPage from "../pages/DashboardPage";
import TicketsPage from "../pages/TicketsPage";
import UsersPage from "../pages/UsersPage";
import SettingsPage from "../pages/SettingsPage";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "/",
                element: <MainLayout />,
                children: [
                    { index: true, element: <TicketsPage /> },
                    { path: "dashboard", element: <DashboardPage /> },
                    { path: "tickets", element: <TicketsPage /> },
                    { path: "users", element: <UsersPage /> },
                    { path: "settings", element: <SettingsPage /> }
                ],
            }
        ]
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
]);
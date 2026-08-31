import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardPage from "../pages/DashboardPage";
import TicketsPage from "../pages/TicketsPage";
import UsersPage from "../pages/UsersPage";
import SettingsPage from "../pages/SettingsPage";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import RoleRoute from "./RoleRoute";

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
                    { path: "settings", element: <SettingsPage /> },
                    {
                        element: <RoleRoute allowedRoles={["Admin"]} />,
                        children: [
                            {
                                path: "users",
                                element: <UsersPage />,
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        element: <PublicRoute />,
        children: [
            {
                path: "/login",
                element: <LoginPage />,
            },
        ],
    },
]);
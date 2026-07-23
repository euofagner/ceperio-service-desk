import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardPage from "../pages/DashboardPage";
import TicketsPage from "../pages/TicketsPage";
import UsersPage from "../pages/UsersPage";
import SettingsPage from "../pages/SettingsPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children : [
            { index: true, element: <DashboardPage /> },
            { path: "tickets", element: <TicketsPage /> },
            { path: "users", element: <UsersPage /> },
            { path: "settings", element: <SettingsPage /> }
        ],
    },
]);
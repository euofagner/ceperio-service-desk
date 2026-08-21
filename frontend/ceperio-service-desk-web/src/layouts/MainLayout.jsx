import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { TicketModalProvider } from "../contexts/TicketModalContext";

function MainLayout() {
    return (
        <TicketModalProvider>
            <div className="min-h-screen bg-neutral-950 text-neutral-200">
                <Sidebar />

                <div className="ml-64 flex min-h-screen flex-col">
                    <Header />

                    <main className="flex-1 p-6">
                        <Outlet />
                    </main>
                </div>
            </div>
        </TicketModalProvider>
    );
}

export default MainLayout;
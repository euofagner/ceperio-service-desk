import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

function MainLayout() {
    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-200">
            <div className="flex">
                <Sidebar />

                <div className="flex-1 flex flex-col">
                    <Header />

                    <main className="flex-1 p-6">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}

export default MainLayout;
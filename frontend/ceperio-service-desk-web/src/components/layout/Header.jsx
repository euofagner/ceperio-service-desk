import { useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

function Header() {
    const location = useLocation();

    const titles = {
        "/dashboard": "Dashboard",
        "/tickets": "Tickets",
        "/users": "Usuários",
        "/settings": "Configurações",
    };

    const subtitles = {
        "/dashboard": "Visão geral",
        "/tickets": "Chamados",
        "/users": "Gerenciar usuários",
        "/settings": "Configurações do sistema",
    };

    const currentTitle = titles[location.pathname] || "Service Desk";
    const currentSubtitle = subtitles[location.pathname] || "CepeRio Service Desk";

    return (
        <header className="sticky top-0 z-30 flex min-h-20 items-center justify-between border-b border-white/6 bg-neutral-950/95 px-6 backdrop-blur">
            <div>
                <h2 className="text-xl font-semibold text-white">{currentTitle}</h2>
                <p className="mt-1 text-xs text-neutral-500">{currentSubtitle}</p>
            </div>

            <div className="flex items-center gap-3">
                <button
                    type="button"
                    className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/6 bg-white/4 text-neutral-400 transition-colors hover:bg-white/8 hover:text-white"
                    aria-label="Notificações">

                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" />
                    </svg>

                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500" />
                </button>

                <ThemeToggle />
            </div>
        </header>
    );
}

export default Header;
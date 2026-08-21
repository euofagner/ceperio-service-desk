import { useState } from "react";

import { NavLink } from "react-router-dom";

import cepelogo from "../../assets/cepelogo.png";

const navigation = [
  { name: "Dashboard", path: "/dashboard", icon: "📊" },
  { name: "Tickets", path: "/tickets", icon: "🎫" },
  { name: "Usuários", path: "/users", icon: "👥" },
  { name: "Configurações", path: "/settings", icon: "⚙️" },
];

function Sidebar() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-neutral-800 bg-neutral-950">
      <div className="flex h-24 items-center border-b border-neutral-800 px-6">
        <img src={cepelogo} alt="CepeRio" className="h-16 w-16 object-contain" />
        <div className="ml-1">
          <h1 className="text-lg font-bold tracking-tight text-white">CepeRio</h1>
          <p className="text-xs text-neutral-500">Service Desk</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5">
        <div className="space-y-1">
          {navigation.map(({ name, path, icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                [
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5",
                  "text-sm transition-all duration-200",
                  isActive
                    ? "bg-blue-500/15 text-blue-400"
                    : "text-neutral-400 hover:bg-neutral-800/70 hover:text-white"
                ].join(" ")
              }>

              {({ isActive }) => (
                <>
                  <span
                    className={`absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-blue-500 transition-all duration-200 ${isActive ? "opacity-100" : "opacity-0"}`} />

                  <span>{icon}</span>
                  <span className="font-medium">{name}</span>
                </>
              )}

            </NavLink>
          ))}
        </div>
      </nav>

      <div className="relative border-t border-white/6 p-3">
        <button
          type="button"
          onClick={() => setUserMenuOpen((open) => !open)}
          className="group flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-white/4"
        >
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-[11px] font-bold text-white">
            FS
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-neutral-950 bg-emerald-500" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">Fagner da Silva</p>
            <p className="text-xs text-neutral-500">Administrador</p>
          </div>

          <svg
            className={`h-4 w-4 shrink-0 text-neutral-500 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {userMenuOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-2xl shadow-black/30">
            <div className="border-b border-white/6 px-4 py-3">
              <p className="text-sm font-medium text-white">Fagner da Silva</p>
              <p className="mt-0.5 text-xs text-neutral-500">Administrador</p>
            </div>

            <div className="p-1.5">
              <button
                type="button"
                disabled
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-600"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M15 19a6 6 0 0 0-12 0m9-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 7v-2a3 3 0 0 0-3-3h-1" />
                </svg>
                <span>Meu perfil</span>
              </button>

              <NavLink
                to="/settings"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56v.08h-2.4v-.08a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 0 0 8.4 15a1.7 1.7 0 0 0-1.56-1.03h-.08v-2.4h.08A1.7 1.7 0 0 0 8.4 10.5a1.7 1.7 0 0 0-.34-1.88L8 8.56l1.7-1.7.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.03-1.56v-.08h2.4v.08a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.7 1.7-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.56 1.03h.08v2.4h-.08A1.7 1.7 0 0 0 19.4 15Z" />
                </svg>
                <span>Configurações</span>
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
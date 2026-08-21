import { NavLink } from "react-router-dom";
import cepelogo from "../../assets/cepelogo.png";

const navigation = [
  { name: "Dashboard", path: "/dashboard", icon: "📊" },
  { name: "Tickets", path: "/tickets", icon: "🎫" },
  { name: "Usuários", path: "/users", icon: "👥" },
  { name: "Configurações", path: "/settings", icon: "⚙️" },
];

function Sidebar() {
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

      <div className="relative border-t border-white/6 p-3 cursor-pointer">
        <div className="group flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-white/4">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-[11px] font-bold text-white">
            FS
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#09090b] bg-emerald-500" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">Fagner da Silva</p>
            <p className="text-xs text-neutral-500">Administrador</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
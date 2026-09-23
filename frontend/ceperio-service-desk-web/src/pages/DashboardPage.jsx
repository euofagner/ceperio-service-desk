import { useAuth } from "../contexts/AuthContext";

const stats = [
    {
        label: "Total de Tickets",
        value: 86,
        color: "blue",
        icon: "▣",
    },
    {
        label: "Abertos",
        value: 12,
        color: "red",
        icon: "□",
    },
    {
        label: "Em andamento",
        value: 8,
        color: "amber",
        icon: "◷",
    },
    {
        label: "Aguardando usuário",
        value: 5,
        color: "orange",
        icon: "◉",
    },
    {
        label: "Resolvidos",
        value: 24,
        color: "emerald",
        icon: "✓",
    },
    {
        label: "Fechados",
        value: 42,
        color: "violet",
        icon: "□",
    },
];

const recentTickets = [
    {
        id: 1043,
        title: "Problema no computador",
        requester: "Maria Clara",
        priority: "Alta",
        status: "Em andamento",
        statusColor: "amber",
    },
    {
        id: 1042,
        title: "Impressora não funciona",
        requester: "João Silva",
        priority: "Média",
        status: "Aberto",
        statusColor: "red",
    },
    {
        id: 1041,
        title: "Acesso ao sistema",
        requester: "Ana Costa",
        priority: "Baixa",
        status: "Aguardando usuário",
        statusColor: "orange",
    },
    {
        id: 1040,
        title: "Email corporativo bloqueado",
        requester: "Paulo Lima",
        priority: "Média",
        status: "Resolvido",
        statusColor: "emerald",
    },
    {
        id: 1039,
        title: "Notebook lento",
        requester: "Roberta Santos",
        priority: "Baixa",
        status: "Fechado",
        statusColor: "violet",
    },
];

const categories = [
    { name: "Informática", value: 74 },
    { name: "Recursos Humanos", value: 48 },
    { name: "Financeiro", value: 40 },
    { name: "Comercial", value: 32 },
    { name: "Marketing", value: 26 },
    { name: "Outros", value: 45 },
];

const agents = [
    { name: "Maria Clara", initials: "MC", tickets: 18 },
    { name: "João Silva", initials: "JS", tickets: 14 },
    { name: "Ana Costa", initials: "AC", tickets: 12 },
    { name: "Paulo Lima", initials: "PL", tickets: 10 },
    { name: "Roberta Santos", initials: "RS", tickets: 8 },
    { name: "Não atribuído", initials: "—", tickets: 7 },
];

const colorClasses = {
    blue: {
        icon: "bg-blue-500/15 text-blue-400",
        border: "border-blue-500/20",
        glow: "bg-blue-500/5",
    },
    red: {
        icon: "bg-red-500/15 text-red-400",
        border: "border-red-500/20",
        glow: "bg-red-500/5",
    },
    amber: {
        icon: "bg-amber-500/15 text-amber-400",
        border: "border-amber-500/20",
        glow: "bg-amber-500/5",
    },
    orange: {
        icon: "bg-orange-500/15 text-orange-400",
        border: "border-orange-500/20",
        glow: "bg-orange-500/5",
    },
    emerald: {
        icon: "bg-emerald-500/15 text-emerald-400",
        border: "border-emerald-500/20",
        glow: "bg-emerald-500/5",
    },
    violet: {
        icon: "bg-violet-500/15 text-violet-400",
        border: "border-violet-500/20",
        glow: "bg-violet-500/5",
    },
};

const statusClasses = {
    red: "border-red-500/20 bg-red-500/10 text-red-400",
    amber: "border-amber-500/20 bg-amber-500/10 text-amber-400",
    orange: "border-orange-500/20 bg-orange-500/10 text-orange-400",
    emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    violet: "border-violet-500/20 bg-violet-500/10 text-violet-400",
};

function DashboardPage() {
    const { user } = useAuth();

    const hour = new Date().getHours();

    const greeting =
        hour < 12
            ? "Bom dia"
            : hour < 18
                ? "Boa tarde"
                : "Boa noite";

    return (
        <div className="mx-auto max-w-[1500px] space-y-6">
            {/* Header */}
            <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                        {greeting}, {user?.name?.split(" ")[0] || "usuário"}! 👋
                    </h1>

                    <p className="mt-1 text-sm text-neutral-500">
                        Aqui está um resumo do seu Service Desk.
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    {/* Search */}
                    <div className="relative">
                        <svg
                            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.8"
                                d="m21 21-4.35-4.35m1.35-5.4a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0Z"
                            />
                        </svg>

                        <input
                            type="text"
                            placeholder="Buscar tickets..."
                            className="h-10 w-full rounded-lg border border-neutral-800 bg-neutral-900/80 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-blue-500/50 sm:w-64"
                        />
                    </div>

                    {/* Period */}
                    <button
                        type="button"
                        className="flex h-10 items-center justify-between gap-5 rounded-lg border border-neutral-800 bg-neutral-900/80 px-3 text-sm text-neutral-300 transition hover:border-neutral-700 hover:bg-neutral-900"
                    >
                        <span>Últimos 7 dias</span>

                        <svg
                            className="h-4 w-4 text-neutral-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.8"
                                d="m6 9 6 6 6-6"
                            />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Stats */}
            <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
                {stats.map((stat) => {
                    const colors = colorClasses[stat.color];

                    return (
                        <div
                            key={stat.label}
                            className={`relative overflow-hidden rounded-xl border ${colors.border} bg-neutral-900/80 p-4`}
                        >
                            <div
                                className={`absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl ${colors.glow}`}
                            />

                            <div className="relative">
                                <div className="flex items-start justify-between">
                                    <div
                                        className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold ${colors.icon}`}
                                    >
                                        {stat.icon}
                                    </div>
                                </div>

                                <p className="mt-4 text-xs text-neutral-500">
                                    {stat.label}
                                </p>

                                <p className="mt-1 text-2xl font-semibold tracking-tight text-white">
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* Main charts */}
            <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.8fr)]">
                {/* Tickets by period */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-sm font-semibold text-white">
                                Tickets por período
                            </h2>

                            <p className="mt-1 text-xs text-neutral-500">
                                Visão dos chamados ao longo do tempo
                            </p>
                        </div>

                        <div className="flex rounded-lg border border-neutral-800 bg-neutral-950 p-1">
                            {["7 dias", "30 dias", "90 dias", "Todo o período"].map(
                                (period, index) => (
                                    <button
                                        key={period}
                                        type="button"
                                        className={`rounded-md px-2.5 py-1.5 text-[11px] transition ${
                                            index === 0
                                                ? "bg-blue-600 text-white"
                                                : "text-neutral-500 hover:text-neutral-300"
                                        }`}
                                    >
                                        {period}
                                    </button>
                                )
                            )}
                        </div>
                    </div>

                    <div className="mt-6 h-64">
                        <div className="flex h-full items-end gap-3 border-b border-l border-neutral-800 px-3 pb-0">
                            {[42, 58, 48, 72, 62, 82, 68, 91, 75, 84, 70, 88].map(
                                (height, index) => (
                                    <div
                                        key={index}
                                        className="flex h-full flex-1 items-end"
                                    >
                                        <div
                                            className="w-full rounded-t bg-gradient-to-t from-blue-600/10 to-blue-500/60 transition-all hover:from-blue-600/20 hover:to-blue-400"
                                            style={{ height: `${height}%` }}
                                        />
                                    </div>
                                )
                            )}
                        </div>

                        <div className="mt-2 flex justify-between px-3 text-[10px] text-neutral-600">
                            <span>23/04</span>
                            <span>24/04</span>
                            <span>25/04</span>
                            <span>26/04</span>
                            <span>27/04</span>
                            <span>28/04</span>
                            <span>29/04</span>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-neutral-500">
                        <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                            Abertos
                        </span>

                        <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                            Em andamento
                        </span>

                        <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-orange-500" />
                            Aguardando usuário
                        </span>

                        <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            Resolvidos
                        </span>

                        <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-violet-500" />
                            Fechados
                        </span>
                    </div>
                </div>

                {/* Status */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-5">
                    <div>
                        <h2 className="text-sm font-semibold text-white">
                            Tickets por status
                        </h2>

                        <p className="mt-1 text-xs text-neutral-500">
                            Distribuição atual
                        </p>
                    </div>

                    <div className="mt-7 flex items-center justify-center">
                        <div className="relative h-44 w-44 rounded-full bg-[conic-gradient(#8b5cf6_0_49%,#22c55e_49%_77%,#f59e0b_77%_87%,#f97316_87%_93%,#ef4444_93%_100%)] p-7">
                            <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-neutral-900">
                                <span className="text-3xl font-semibold text-white">
                                    86
                                </span>

                                <span className="text-xs text-neutral-500">
                                    Total
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 space-y-3">
                        {[
                            ["Abertos", 12, "bg-red-500"],
                            ["Em andamento", 8, "bg-amber-500"],
                            ["Aguardando usuário", 5, "bg-orange-500"],
                            ["Resolvidos", 24, "bg-emerald-500"],
                            ["Fechados", 42, "bg-violet-500"],
                        ].map(([label, value, color]) => (
                            <div
                                key={label}
                                className="flex items-center justify-between text-xs"
                            >
                                <span className="flex items-center gap-2 text-neutral-400">
                                    <span className={`h-2 w-2 rounded-full ${color}`} />
                                    {label}
                                </span>

                                <span className="font-medium text-neutral-300">
                                    {value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Recent tickets */}
            <section className="rounded-xl border border-neutral-800 bg-neutral-900/70">
                <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
                    <div>
                        <h2 className="text-sm font-semibold text-white">
                            Chamados recentes
                        </h2>

                        <p className="mt-1 text-xs text-neutral-500">
                            Últimos tickets movimentados
                        </p>
                    </div>

                    <button
                        type="button"
                        className="text-xs font-medium text-blue-400 transition hover:text-blue-300"
                    >
                        Ver todos →
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] text-left">
                        <thead>
                            <tr className="border-b border-neutral-800 text-[10px] uppercase tracking-wide text-neutral-600">
                                <th className="px-5 py-3 font-medium">Ticket</th>
                                <th className="px-5 py-3 font-medium">Solicitante</th>
                                <th className="px-5 py-3 font-medium">Prioridade</th>
                                <th className="px-5 py-3 font-medium">Status</th>
                                <th className="px-5 py-3 font-medium">Atualizado</th>
                            </tr>
                        </thead>

                        <tbody>
                            {recentTickets.map((ticket) => (
                                <tr
                                    key={ticket.id}
                                    className="border-b border-neutral-800/70 last:border-0 transition hover:bg-white/[0.02]"
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="h-2 w-2 rounded-full bg-blue-500" />

                                            <div>
                                                <p className="text-xs font-medium text-neutral-200">
                                                    #{ticket.id}
                                                </p>

                                                <p className="mt-0.5 text-xs text-neutral-500">
                                                    {ticket.title}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-5 py-4 text-xs text-neutral-400">
                                        {ticket.requester}
                                    </td>

                                    <td className="px-5 py-4">
                                        <span className="rounded-md border border-neutral-700 bg-neutral-800/60 px-2 py-1 text-[10px] text-neutral-300">
                                            {ticket.priority}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4">
                                        <span
                                            className={`rounded-md border px-2 py-1 text-[10px] ${statusClasses[ticket.statusColor]}`}
                                        >
                                            {ticket.status}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4 text-xs text-neutral-500">
                                        Recentemente
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Bottom information */}
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Categories */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-5">
                    <div className="mb-5">
                        <h2 className="text-sm font-semibold text-white">
                            Tickets por categoria
                        </h2>

                        <p className="mt-1 text-xs text-neutral-500">
                            Distribuição dos chamados
                        </p>
                    </div>

                    <div className="space-y-4">
                        {categories.map((category) => {
                            const percentage = Math.round((category.value / 86) * 100);

                            return (
                                <div key={category.name}>
                                    <div className="mb-1.5 flex items-center justify-between text-xs">
                                        <span className="text-neutral-400">
                                            {category.name}
                                        </span>

                                        <span className="text-neutral-500">
                                            {category.value}
                                        </span>
                                    </div>

                                    <div className="h-1.5 overflow-hidden rounded-full bg-neutral-800">
                                        <div
                                            className="h-full rounded-full bg-blue-500 transition-all"
                                            style={{
                                                width: `${Math.min(percentage, 100)}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Agents */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-5">
                    <div className="mb-5">
                        <h2 className="text-sm font-semibold text-white">
                            Tickets por agente
                        </h2>

                        <p className="mt-1 text-xs text-neutral-500">
                            Distribuição dos tickets atribuídos
                        </p>
                    </div>

                    <div className="space-y-4">
                        {agents.map((agent) => (
                            <div key={agent.name} className="flex items-center gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-[10px] font-semibold text-blue-400">
                                    {agent.initials}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="mb-1.5 flex items-center justify-between">
                                        <span className="truncate text-xs text-neutral-300">
                                            {agent.name}
                                        </span>

                                        <span className="ml-3 text-[10px] text-neutral-500">
                                            {agent.tickets}
                                        </span>
                                    </div>

                                    <div className="h-1.5 overflow-hidden rounded-full bg-neutral-800">
                                        <div
                                            className="h-full rounded-full bg-blue-500"
                                            style={{
                                                width: `${(agent.tickets / 18) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quick access */}
            <section className="grid grid-cols-1 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/70 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    {
                        icon: "＋",
                        title: "Novo ticket",
                        description: "Abra um novo chamado",
                    },
                    {
                        icon: "◉",
                        title: "Meus chamados",
                        description: "Acompanhe seus tickets",
                    },
                    {
                        icon: "⚙",
                        title: "Configurações",
                        description: "Personalize o sistema",
                    },
                    {
                        icon: "?",
                        title: "Central de ajuda",
                        description: "Consulte a base de conhecimento",
                    },
                ].map((item, index) => (
                    <button
                        key={item.title}
                        type="button"
                        className={`flex items-center gap-3 p-4 text-left transition hover:bg-white/[0.03] ${
                            index !== 0 ? "border-t border-neutral-800 sm:border-t-0 sm:border-l" : ""
                        }`}
                    >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-sm text-blue-400">
                            {item.icon}
                        </span>

                        <span className="min-w-0">
                            <span className="block text-xs font-medium text-neutral-200">
                                {item.title}
                            </span>

                            <span className="mt-0.5 block truncate text-[10px] text-neutral-500">
                                {item.description}
                            </span>
                        </span>
                    </button>
                ))}
            </section>
        </div>
    );
}

export default DashboardPage;
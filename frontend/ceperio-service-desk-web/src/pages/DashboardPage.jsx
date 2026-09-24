import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Ticket,
    Circle,
    Clock,
    UserCheck,
    CircleCheckBig,
    Lock,
    Search,
    Plus,
    Inbox,
    Settings,
    CircleHelp,
} from "lucide-react";

import { useAuth } from "../contexts/AuthContext";
import { useDashboard } from "../hooks/useDashboard";

const colorClasses = {
    blue: { icon: "bg-blue-500/15 text-blue-400", border: "border-blue-500/20", glow: "bg-blue-500/5" },
    red: { icon: "bg-red-500/15 text-red-400", border: "border-red-500/20", glow: "bg-red-500/5" },
    amber: { icon: "bg-amber-500/15 text-amber-400", border: "border-amber-500/20", glow: "bg-amber-500/5" },
    orange: { icon: "bg-orange-500/15 text-orange-400", border: "border-orange-500/20", glow: "bg-orange-500/5" },
    emerald: { icon: "bg-emerald-500/15 text-emerald-400", border: "border-emerald-500/20", glow: "bg-emerald-500/5" },
    violet: { icon: "bg-violet-500/15 text-violet-400", border: "border-violet-500/20", glow: "bg-violet-500/5" },
};

const priorityLabels = {
    Low: "Baixa",
    Medium: "Média",
    High: "Alta",
    Critical: "Crítica",
};

const statusLabels = {
    Open: "Aberto",
    InProgress: "Em andamento",
    WaitingUser: "Aguardando usuário",
    Resolved: "Resolvido",
    Closed: "Fechado",
};

const statusDotMap = {
    Open: "bg-red-500",
    InProgress: "bg-amber-500",
    WaitingUser: "bg-orange-500",
    Resolved: "bg-emerald-500",
    Closed: "bg-violet-500",
};

const statusBadgeMap = {
    Open: "border-red-500/20 bg-red-500/10 text-red-400",
    InProgress: "border-amber-500/20 bg-amber-500/10 text-amber-400",
    WaitingUser: "border-orange-500/20 bg-orange-500/10 text-orange-400",
    Resolved: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    Closed: "border-violet-500/20 bg-violet-500/10 text-violet-400",
};

const donutColors = {
    Open: "#ef4444",
    InProgress: "#f59e0b",
    WaitingUser: "#f97316",
    Resolved: "#22c55e",
    Closed: "#8b5cf6",
};

const STATUS_ORDER = ["Open", "InProgress", "WaitingUser", "Resolved", "Closed"];

const statusToSummaryKey = {
    Open: "open",
    InProgress: "inProgress",
    WaitingUser: "waitingUser",
    Resolved: "resolved",
    Closed: "closed",
};

function DashboardPage() {
    const { user } = useAuth();
    const [days, setDays] = useState(7);

    const { dashboard, loading, error, refresh } = useDashboard(days);

    const navigate = useNavigate();

    const summary = dashboard?.summary;
    const recentTickets = dashboard?.recentTickets ?? [];
    const ticketsByStatus = dashboard?.ticketsByStatus ?? [];
    const ticketsByAgent = dashboard?.ticketsByAgent ?? [];
    const ticketsByPeriod = dashboard?.ticketsByPeriod ?? [];

    const hour = new Date().getHours();

    const greeting =
        hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

    if (loading && !dashboard) {
        return (
            <div className="flex min-h-100 items-center justify-center">
                <div className="flex items-center gap-3 text-sm text-neutral-500">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-700 border-t-blue-500" />
                    Carregando dashboard...
                </div>
            </div>
        );
    }

    if (error && !dashboard) {
        return (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
                <h2 className="text-sm font-semibold text-red-400">
                    Não foi possível carregar o dashboard
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                    Ocorreu um erro ao buscar os dados do Service Desk.
                </p>
                <button
                    type="button"
                    onClick={refresh}
                    className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
                >
                    Tentar novamente
                </button>
            </div>
        );
    }

    const stats = summary
        ? [
            { label: "Total de Tickets", value: summary.total, color: "blue", Icon: Ticket },
            { label: "Abertos", value: summary.open, color: "red", Icon: Circle },
            { label: "Em andamento", value: summary.inProgress, color: "amber", Icon: Clock },
            { label: "Aguardando usuário", value: summary.waitingUser, color: "orange", Icon: UserCheck },
            { label: "Resolvidos", value: summary.resolved, color: "emerald", Icon: CircleCheckBig },
            { label: "Fechados", value: summary.closed, color: "violet", Icon: Lock },
        ]
        : [];

    const statusDistribution = STATUS_ORDER.map((status) => {
        const found = ticketsByStatus.find((item) => item.status === status);
        return {
            status,
            label: statusLabels[status],
            count: found?.count ?? 0,
            dot: statusDotMap[status],
            color: donutColors[status],
        };
    });

    const donutTotal = summary?.total ?? 0;

    let cumulative = 0;
    const donutGradient = statusDistribution
        .filter((item) => item.count > 0)
        .map((item) => {
            const start = donutTotal > 0 ? (cumulative / donutTotal) * 100 : 0;
            cumulative += item.count;
            const end = donutTotal > 0 ? (cumulative / donutTotal) * 100 : 0;
            return `${item.color} ${start}% ${end}%`;
        })
        .join(", ");

    const periodTotals = ticketsByPeriod.map(
        (day) => day.open + day.inProgress + day.waitingUser + day.resolved + day.closed
    );
    const maxPeriodValue = Math.max(...periodTotals, 1);

    const agentsView = ticketsByAgent.map((agent) => ({
        name: agent.agentName,
        initials: (agent.agentName || "?")
            .split(" ")
            .map((part) => part[0])
            .slice(0, 2)
            .join("")
            .toUpperCase(),
        tickets: agent.ticketCount,
    }));
    const maxAgentTickets = Math.max(...agentsView.map((a) => a.tickets), 1);

    const periodSummary = ticketsByPeriod.reduce(
        (acc, day) => ({
            open: acc.open + day.open,
            inProgress: acc.inProgress + day.inProgress,
            waitingUser: acc.waitingUser + day.waitingUser,
            resolved: acc.resolved + day.resolved,
            closed: acc.closed + day.closed,
        }),
        {
            open: 0,
            inProgress: 0,
            waitingUser: 0,
            resolved: 0,
            closed: 0,
        }
    );

    const periodTotal = Object.values(periodSummary).reduce(
        (total, value) => total + value,
        0
    );

    return (
        <div className="mx-auto max-w-375 space-y-6">
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
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />

                        <input
                            type="text"
                            placeholder="Buscar tickets..."
                            className="h-10 w-full rounded-lg border border-neutral-800 bg-neutral-900/80 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-blue-500/50 sm:w-64"
                        />
                    </div>

                    <select
                        value={days}
                        onChange={(e) => setDays(Number(e.target.value))}
                        className="h-10 rounded-lg border border-neutral-800 bg-neutral-900/80 px-3 text-sm text-neutral-300 outline-none transition hover:border-neutral-700 focus:border-blue-500/50"
                    >
                        <option value={7}>Últimos 7 dias</option>
                        <option value={30}>Últimos 30 dias</option>
                        <option value={90}>Últimos 90 dias</option>
                    </select>
                </div>
            </header>

            <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
                {stats.map((stat) => {
                    const colors = colorClasses[stat.color];
                    const StatIcon = stat.Icon;

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
                                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${colors.icon}`}
                                    >
                                        <StatIcon className="h-4 w-4" strokeWidth={2} />
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

            <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.8fr)]">
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
                            {[
                                { label: "7 dias", value: 7 },
                                { label: "30 dias", value: 30 },
                                { label: "90 dias", value: 90 },
                            ].map((period) => (
                                <button
                                    key={period.value}
                                    type="button"
                                    onClick={() => setDays(period.value)}
                                    className={`rounded-md px-2.5 py-1.5 text-[11px] transition ${days === period.value
                                        ? "bg-blue-600 text-white"
                                        : "text-neutral-500 hover:text-neutral-300"
                                        }`}
                                >
                                    {period.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 h-64">
                        <div className="flex h-full items-end gap-2 border-b border-l border-neutral-800 px-3 pb-0">
                            {ticketsByPeriod.map((day, index) => {
                                const total = periodTotals[index];
                                const height = (total / maxPeriodValue) * 100;

                                const segments = [
                                    { value: day.open, color: "bg-red-500" },
                                    { value: day.inProgress, color: "bg-amber-500" },
                                    { value: day.waitingUser, color: "bg-orange-500" },
                                    { value: day.resolved, color: "bg-emerald-500" },
                                    { value: day.closed, color: "bg-violet-500" },
                                ];

                                return (
                                    <div key={day.date} className="flex h-full flex-1 items-end">
                                        <div
                                            className="flex w-full flex-col-reverse overflow-hidden rounded-t"
                                            style={{ height: `${Math.max(height, total > 0 ? 2 : 0)}%` }}
                                        >
                                            {segments.map((segment, segmentIndex) => {
                                                if (segment.value === 0) return null;
                                                return (
                                                    <div
                                                        key={segmentIndex}
                                                        className={`w-full ${segment.color} transition-all`}
                                                        style={{ height: `${(segment.value / total) * 100}%` }}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-2 flex justify-between px-3 text-[10px] text-neutral-600">
                            {ticketsByPeriod.map((day, index) => {
                                const shouldShowLabel =
                                    days === 7 ||
                                    index === 0 ||
                                    index === ticketsByPeriod.length - 1 ||
                                    index % (days === 30 ? 5 : 15) === 0;

                                if (!shouldShowLabel) {
                                    return <span key={day.date} />;
                                }

                                return (
                                    <span key={day.date}>
                                        {new Date(day.date).toLocaleDateString("pt-BR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                        })}
                                    </span>
                                );
                            })}
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
                        <div
                            className="relative h-44 w-44 rounded-full p-7"
                            style={{
                                backgroundImage: donutGradient
                                    ? `conic-gradient(${donutGradient})`
                                    : "conic-gradient(#27272a 0% 100%)",
                            }}
                        >
                            <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-neutral-900">
                                <span className="text-3xl font-semibold text-white">
                                    {donutTotal}
                                </span>

                                <span className="text-xs text-neutral-500">
                                    Total
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 space-y-3">
                        {statusDistribution.map((item) => (
                            <div
                                key={item.status}
                                className="flex items-center justify-between text-xs"
                            >
                                <span className="flex items-center gap-2 text-neutral-400">
                                    <span className={`h-2 w-2 rounded-full ${item.dot}`} />
                                    {item.label}
                                </span>

                                <span className="font-medium text-neutral-300">
                                    {item.count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

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
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-175 text-left">
                        <thead>
                            <tr className="border-b border-neutral-800 text-[10px] uppercase tracking-wide text-neutral-600">
                                <th className="px-5 py-3 font-medium">Ticket</th>
                                <th className="px-5 py-3 font-medium">Solicitante</th>
                                <th className="px-5 py-3 font-medium">Prioridade</th>
                                <th className="px-5 py-3 font-medium">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {recentTickets.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-5 py-8 text-center text-xs text-neutral-500">
                                        Nenhum ticket recente.
                                    </td>
                                </tr>
                            ) : (
                                recentTickets.map((ticket) => (
                                    <tr
                                        key={ticket.id}
                                        className="border-b border-neutral-800/70 last:border-0 transition hover:bg-white/2"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className={`h-2 w-2 rounded-full ${statusDotMap[ticket.ticketStatus]}`} />

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
                                            {ticket.createdByUserName || "Não identificado"}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="rounded-md border border-neutral-700 bg-neutral-800/60 px-2 py-1 text-[10px] text-neutral-300">
                                                {priorityLabels[ticket.ticketPriority] || ticket.ticketPriority}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`rounded-md border px-2 py-1 text-[10px] ${statusBadgeMap[ticket.ticketStatus]}`}
                                            >
                                                {statusLabels[ticket.ticketStatus] || ticket.ticketStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-5">
                    <div className="mb-5">
                        <h2 className="text-sm font-semibold text-white">
                            Resumo do período
                        </h2>

                        <p className="mt-1 text-xs text-neutral-500">
                            Distribuição dos tickets criados no período selecionado
                        </p>
                    </div>

                    <div className="space-y-4">
                        {STATUS_ORDER.map((status) => {
                            const value = periodSummary[statusToSummaryKey[status]];
                            const percentage =
                                periodTotal > 0 ? Math.round((value / periodTotal) * 100) : 0;

                            return (
                                <div key={status}>
                                    <div className="mb-1.5 flex items-center justify-between text-xs">
                                        <span className="flex items-center gap-2 text-neutral-400">
                                            <span className={`h-2 w-2 rounded-full ${statusDotMap[status]}`} />
                                            {statusLabels[status]}
                                        </span>

                                        <span className="text-neutral-500">{value}</span>
                                    </div>

                                    <div className="h-1.5 overflow-hidden rounded-full bg-neutral-800">
                                        <div
                                            className={`h-full rounded-full ${statusDotMap[status]} transition-all`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-5 border-t border-neutral-800 pt-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-neutral-500">Total no período</span>
                            <span className="text-sm font-semibold text-white">{periodTotal}</span>
                        </div>
                    </div>
                </div>

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
                        {agentsView.length === 0 ? (
                            <p className="text-xs text-neutral-500">
                                Nenhum ticket atribuído.
                            </p>
                        ) : (
                            agentsView.map((agent) => (
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
                                                    width: `${(agent.tickets / maxAgentTickets) * 100}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/70 sm:grid-cols-2 lg:grid-cols-4">
                <button
                    type="button"
                    onClick={() => navigate("/tickets?new=true")}
                    className="flex items-center gap-3 p-4 text-left transition hover:bg-white/3"
                >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                        <Plus className="h-4 w-4" strokeWidth={2} />
                    </span>

                    <span>
                        <span className="block text-xs font-medium text-neutral-200">
                            Novo ticket
                        </span>
                        <span className="mt-0.5 block text-xs text-neutral-500">
                            Abra um novo chamado
                        </span>
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/tickets")}
                    className="flex items-center gap-3 border-t border-neutral-800 p-4 text-left transition hover:bg-white/3 sm:border-t-0 sm:border-l"
                >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-neutral-300">
                        <Inbox className="h-4 w-4" strokeWidth={2} />
                    </span>

                    <span>
                        <span className="block text-xs font-medium text-neutral-200">
                            Meus chamados
                        </span>
                        <span className="mt-0.5 block text-xs text-neutral-500">
                            Acompanhe seus tickets
                        </span>
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/settings")}
                    className="flex items-center gap-3 border-t border-neutral-800 p-4 text-left transition hover:bg-white/3 sm:border-t-0 sm:border-l"
                >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-neutral-300">
                        <Settings className="h-4 w-4" strokeWidth={2} />
                    </span>

                    <span>
                        <span className="block text-xs font-medium text-neutral-200">
                            Configurações
                        </span>
                        <span className="mt-0.5 block text-xs text-neutral-500">
                            Personalize o sistema
                        </span>
                    </span>
                </button>

                <button
                    type="button"
                    disabled
                    className="flex items-center gap-3 border-t border-neutral-800 p-4 text-left opacity-50 sm:border-t-0 sm:border-l cursor-not-allowed">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-neutral-300">
                        <CircleHelp className="h-4 w-4" strokeWidth={2} />
                    </span>

                    <span>
                        <span className="block text-xs font-medium text-neutral-200">
                            Central de ajuda
                        </span>
                        <span className="mt-0.5 block text-xs text-neutral-500">
                            Consulte a base de conhecimento
                        </span>
                    </span>
                </button>
            </section>
        </div>
    );
}

export default DashboardPage;
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
    Open: "border-red-500/30 bg-red-500/10 text-red-300",
    InProgress: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    WaitingUser: "border-orange-500/30 bg-orange-500/10 text-orange-300",
    Resolved: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    Closed: "border-violet-500/30 bg-violet-500/10 text-violet-300",
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

const chartLine = (a, b) => ({
    length: Math.hypot(b.x - a.x, b.y - a.y),
    angle: Math.atan2(b.y - a.y, b.x - a.x),
});

const chartControlPoint = (current, previous, next, reverse) => {
    const p = previous || current;
    const n = next || current;
    const smoothing = 0.18;
    const o = chartLine(p, n);
    const angle = o.angle + (reverse ? Math.PI : 0);
    const length = o.length * smoothing;
    return [
        current.x + Math.cos(angle) * length,
        current.y + Math.sin(angle) * length,
    ];
};

const smoothPath = (points) =>
    points.reduce((acc, point, i, a) => {
        if (i === 0) return `M ${point.x},${point.y}`;
        const [cpsX, cpsY] = chartControlPoint(a[i - 1], a[i - 2], point);
        const [cpeX, cpeY] = chartControlPoint(point, a[i - 1], a[i + 1], true);
        return `${acc} C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point.x},${point.y}`;
    }, "");

function TicketsLineChart({ data, days }) {
    const [hoverIndex, setHoverIndex] = useState(null);

    const width = 800;
    const height = 320;
    const padding = { top: 24, right: 24, bottom: 40, left: 40 };
    const innerW = width - padding.left - padding.right;
    const innerH = height - padding.top - padding.bottom;

    const n = data.length;

    if (n === 0) {
        return (
            <div className="mt-6 flex h-64 items-center justify-center text-xs text-neutral-400">
                Nenhum dado no período.
            </div>
        );
    }

    const series = [
        { key: "open", label: "Abertos", color: donutColors.Open, values: data.map((d) => d.open) },
        { key: "inProgress", label: "Em andamento", color: donutColors.InProgress, values: data.map((d) => d.inProgress) },
        { key: "waitingUser", label: "Aguardando usuário", color: donutColors.WaitingUser, values: data.map((d) => d.waitingUser) },
        { key: "resolved", label: "Resolvidos", color: donutColors.Resolved, values: data.map((d) => d.resolved) },
        { key: "closed", label: "Fechados", color: donutColors.Closed, values: data.map((d) => d.closed) },
    ];

    const allValues = series.flatMap((s) => s.values);
    const rawMax = Math.max(...allValues, 1);
    const maxVal = Math.max(8, Math.ceil(rawMax / 8) * 8);
    const gridValues = [0, maxVal * 0.25, maxVal * 0.5, maxVal * 0.75, maxVal];

    const xStep = n > 1 ? innerW / (n - 1) : 0;
    const xFor = (i) => padding.left + i * xStep;
    const yFor = (v) => padding.top + innerH - (v / maxVal) * innerH;

    const seriesWithPoints = series.map((s) => ({
        ...s,
        points: s.values.map((v, i) => ({ x: xFor(i), y: yFor(v), value: v })),
    }));

    const tooltipX =
        hoverIndex !== null
            ? Math.max(100, Math.min(width - 100, xFor(hoverIndex)))
            : 0;

    const shouldShowLabel = (i) => {
        if (n <= 7) return true;
        if (i === 0 || i === n - 1) return true;
        const step = days === 30 ? 5 : 15;
        return i % step === 0;
    };

    const formatDate = (d) =>
        new Date(d).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
        });

    return (
        <div className="relative mt-6">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="h-auto w-full overflow-visible"
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    {seriesWithPoints.map((s) => (
                        <linearGradient
                            key={s.key}
                            id={`line-grad-${s.key}`}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop offset="0%" stopColor={s.color} stopOpacity="0.22" />
                            <stop offset="100%" stopColor={s.color} stopOpacity="0" />
                        </linearGradient>
                    ))}
                </defs>

                {gridValues.map((v, i) => (
                    <g key={i}>
                        <line
                            x1={padding.left}
                            x2={width - padding.right}
                            y1={yFor(v)}
                            y2={yFor(v)}
                            stroke="rgba(255,255,255,0.05)"
                            strokeDasharray="3 6"
                        />
                        <text
                            x={padding.left - 12}
                            y={yFor(v) + 3.5}
                            textAnchor="end"
                            fontSize="10"
                            className="fill-neutral-500"
                        >
                            {Math.round(v)}
                        </text>
                    </g>
                ))}

                {hoverIndex !== null && (
                    <line
                        x1={xFor(hoverIndex)}
                        x2={xFor(hoverIndex)}
                        y1={padding.top}
                        y2={padding.top + innerH}
                        stroke="rgba(255,255,255,0.18)"
                        strokeDasharray="3 4"
                    />
                )}

                {data.map((d, i) => (
                    <text
                        key={d.date}
                        x={xFor(i)}
                        y={height - 14}
                        textAnchor="middle"
                        fontSize="10"
                        className={
                            hoverIndex === i ? "fill-neutral-200" : "fill-neutral-500"
                        }
                        opacity={shouldShowLabel(i) ? 1 : 0}
                    >
                        {formatDate(d.date)}
                    </text>
                ))}

                {seriesWithPoints.map((s) => {
                    const pathD = smoothPath(s.points);
                    const areaD = `${pathD} L ${s.points[s.points.length - 1].x},${padding.top + innerH} L ${s.points[0].x},${padding.top + innerH} Z`;
                    return (
                        <path
                            key={`area-${s.key}`}
                            d={areaD}
                            fill={`url(#line-grad-${s.key})`}
                            opacity={hoverIndex === null ? 1 : 0.35}
                            className="transition-opacity duration-200"
                        />
                    );
                })}

                {seriesWithPoints.map((s) => (
                    <path
                        key={`line-${s.key}`}
                        d={smoothPath(s.points)}
                        fill="none"
                        stroke={s.color}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={hoverIndex === null ? 1 : 0.55}
                        className="transition-opacity duration-200"
                        style={{ filter: "drop-shadow(0 0 6px rgba(0,0,0,0.35))" }}
                    />
                ))}

                {hoverIndex !== null &&
                    seriesWithPoints.map((s) => {
                        const p = s.points[hoverIndex];
                        return (
                            <g key={`dot-${s.key}`}>
                                <circle cx={p.x} cy={p.y} r="8" fill={s.color} opacity="0.18" />
                                <circle
                                    cx={p.x}
                                    cy={p.y}
                                    r="3.5"
                                    fill="#171717"
                                    stroke={s.color}
                                    strokeWidth="2"
                                />
                            </g>
                        );
                    })}

                {data.map((d, i) => {
                    const halfStep = n > 1 ? xStep / 2 : innerW / 2;
                    return (
                        <rect
                            key={`hit-${d.date}`}
                            x={xFor(i) - halfStep}
                            y={padding.top}
                            width={n > 1 ? xStep : innerW}
                            height={innerH}
                            fill="transparent"
                            onMouseEnter={() => setHoverIndex(i)}
                            onMouseLeave={() => setHoverIndex(null)}
                            style={{ cursor: "crosshair" }}
                        />
                    );
                })}
            </svg>

            {hoverIndex !== null && (
                <div
                    className="pointer-events-none absolute top-0 z-20 -translate-x-1/2 transition-all duration-150"
                    style={{ left: `${(tooltipX / width) * 100}%` }}
                >
                    <div className="min-w-45 rounded-xl border border-neutral-800 bg-neutral-950/95 p-3 shadow-2xl shadow-black/60 backdrop-blur-xl">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                            {formatDate(data[hoverIndex].date)}
                        </p>
                        <div className="space-y-1.5">
                            {series.map((s) => (
                                <div
                                    key={s.key}
                                    className="flex items-center justify-between gap-4 text-xs"
                                >
                                    <span className="flex items-center gap-2 text-neutral-300">
                                        <span
                                            className="h-1.5 w-1.5 rounded-full"
                                            style={{ backgroundColor: s.color }}
                                        />
                                        {s.label}
                                    </span>
                                    <span className="font-semibold tabular-nums text-white">
                                        {s.values[hoverIndex]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function TicketsDonut({ statusDistribution, donutTotal, donutGradient, donutGlow }) {
    const [hoverStatus, setHoverStatus] = useState(null);

    const hoveredItem = hoverStatus
        ? statusDistribution.find((s) => s.status === hoverStatus)
        : null;

    const activeGlow = hoveredItem
        ? `${hoveredItem.color}55`
        : donutGlow
            ? `conic-gradient(${donutGlow})`
            : "transparent";

    const activeBackgroundImage = donutGradient
        ? `conic-gradient(${donutGradient})`
        : "conic-gradient(#27272a 0% 100%)";

    const size = 192;           
    const cx = size / 2;
    const cy = size / 2;
    const rExt = size / 2;       
    const rInt = 64;         

    const polar = (radius, angleDeg) => {
        const rad = ((angleDeg - 90) * Math.PI) / 180;
        return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
    };

    const slicePath = (startAngle, endAngle) => {
        const sweep = endAngle - startAngle;
        if (sweep >= 359.999) {
            return `
                M ${cx} ${cy - rExt}
                A ${rExt} ${rExt} 0 1 1 ${cx - 0.01} ${cy - rExt}
                Z
                M ${cx} ${cy - rInt}
                A ${rInt} ${rInt} 0 1 0 ${cx - 0.01} ${cy - rInt}
                Z
            `;
        }

        const startExt = polar(rExt, startAngle);
        const endExt = polar(rExt, endAngle);
        const startInt = polar(rInt, endAngle);
        const endInt = polar(rInt, startAngle);
        const largeArc = sweep > 180 ? 1 : 0;

        return `
            M ${startExt.x} ${startExt.y}
            A ${rExt} ${rExt} 0 ${largeArc} 1 ${endExt.x} ${endExt.y}
            L ${startInt.x} ${startInt.y}
            A ${rInt} ${rInt} 0 ${largeArc} 0 ${endInt.x} ${endInt.y}
            Z
        `;
    };

    const slices = (() => {
        let acc = 0;
        return statusDistribution
            .filter((item) => item.count > 0)
            .map((item) => {
                const start = donutTotal > 0 ? (acc / donutTotal) * 360 : 0;
                acc += item.count;
                const end = donutTotal > 0 ? (acc / donutTotal) * 360 : 0;
                return { ...item, start, end };
            });
    })();

    return (
        <div className="relative mt-7 flex items-center justify-center">
            <div
                className="pointer-events-none absolute h-48 w-48 rounded-full blur-3xl opacity-70 transition-all duration-300"
                style={{
                    background: activeGlow,
                    maskImage:
                        "radial-gradient(circle, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 55%, transparent 75%)",
                    WebkitMaskImage:
                        "radial-gradient(circle, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 55%, transparent 75%)",
                }}
            />

            {/* overlay do hover */}
            <div className="relative h-48 w-48">
                <div
                    className="absolute inset-0 rounded-full p-8 shadow-[0_0_40px_-10px_rgba(0,0,0,0.6)]"
                    style={{ backgroundImage: activeBackgroundImage }}
                >
                    <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-neutral-950/95 ring-1 ring-white/4">
                        {hoveredItem ? (
                            <>
                                <span
                                    className="text-3xl font-semibold tracking-tight transition-colors duration-200"
                                    style={{ color: hoveredItem.color }}
                                >
                                    {hoveredItem.count}
                                </span>
                                <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-neutral-400">
                                    {hoveredItem.label}
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="text-3xl font-semibold tracking-tight text-white">
                                    {donutTotal}
                                </span>
                                <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                                    Total
                                </span>
                            </>
                        )}
                    </div>
                </div>

                <svg
                    viewBox={`0 0 ${size} ${size}`}
                    className="absolute inset-0 h-full w-full"
                    style={{ pointerEvents: "none" }}
                >
                    {slices.map((s) => (
                        <path
                            key={s.status}
                            d={slicePath(s.start, s.end)}
                            fill="transparent"
                            style={{ pointerEvents: "all", cursor: "pointer" }}
                            onMouseEnter={() => setHoverStatus(s.status)}
                            onMouseLeave={() => setHoverStatus(null)}
                            onFocus={() => setHoverStatus(s.status)}
                            onBlur={() => setHoverStatus(null)}
                            tabIndex={0}
                            aria-label={`${s.label}: ${s.count} tickets`}
                        />
                    ))}
                </svg>
            </div>
        </div>
    );
}

function DashboardPage() {
    const { user } = useAuth();
    const [days, setDays] = useState(7);
    const [search, setSearch] = useState("");

    const { dashboard, loading, error, refresh } = useDashboard(days);

    const navigate = useNavigate();

    function handleSearch() {
        const value = search.trim();

        if (!value) {
            navigate("/tickets");
            return;
        }

        navigate(`/tickets?search=${encodeURIComponent(value)}`);
    }

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
                <div className="flex items-center gap-3 text-sm font-medium text-neutral-300">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-700 border-t-blue-500" />
                    Carregando dashboard...
                </div>
            </div>
        );
    }

    if (error && !dashboard) {
        return (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
                <h2 className="text-sm font-semibold text-red-300">
                    Não foi possível carregar o dashboard
                </h2>
                <p className="mt-1 text-sm text-neutral-300">
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

    const donutGlow = statusDistribution
        .filter((item) => item.count > 0)
        .map((item) => `${item.color}33`)
        .join(", ");

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

                    <p className="mt-1 text-sm text-neutral-300">
                        Aqui está um resumo do seu Service Desk.
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative">
                        <button
                            type="button"
                            onClick={handleSearch}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 transition hover:text-white"
                            aria-label="Buscar tickets"
                        >
                            <Search className="h-4 w-4" strokeWidth={1.8} />
                        </button>

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch();
                                }
                            }}
                            placeholder="Buscar tickets..."
                            className="h-10 w-full rounded-lg border border-neutral-800 bg-neutral-900/80 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-neutral-500 focus:border-blue-500/50 sm:w-64"
                        />
                    </div>

                    <select
                        value={days}
                        onChange={(e) => setDays(Number(e.target.value))}
                        className="h-10 rounded-lg border border-neutral-800 bg-neutral-900/80 px-3 text-sm text-neutral-200 outline-none transition hover:border-neutral-700 focus:border-blue-500/50"
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
                            className={`group relative overflow-hidden rounded-xl border ${colors.border} bg-neutral-900/80 p-4 transition-all duration-300 ease-out hover:-translate-y-2 hover:border-white/15 hover:bg-neutral-900 hover:shadow-lg hover:shadow-black/40`}
                        >
                            <div
                                className={`absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl ${colors.glow} transition-opacity duration-300 group-hover:opacity-100 opacity-70`}
                            />

                            <div className="relative">
                                <div className="flex items-start justify-between">
                                    <div
                                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${colors.icon} transition-transform duration-300 group-hover:scale-105`}
                                    >
                                        <StatIcon className="h-4 w-4" strokeWidth={2} />
                                    </div>
                                </div>

                                <p className="mt-4 text-xs font-medium text-neutral-300">
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

                            <p className="mt-1 text-xs text-neutral-300">
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
                                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${days === period.value
                                        ? "bg-blue-600 text-white"
                                        : "text-neutral-400 hover:text-neutral-200"
                                        }`}
                                >
                                    {period.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <TicketsLineChart data={ticketsByPeriod} days={days} />

                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-neutral-300">
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

                {/* donut */}
                <div className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/70 p-5">
                    <div>
                        <h2 className="text-sm font-semibold text-white">
                            Tickets por status
                        </h2>

                        <p className="mt-1 text-xs text-neutral-300">
                            Passe o mouse para detalhes
                        </p>
                    </div>

                    <TicketsDonut
                        statusDistribution={statusDistribution}
                        donutTotal={donutTotal}
                        donutGradient={donutGradient}
                        donutGlow={donutGlow}
                    />

                    <div className="mt-7 space-y-3">
                        {statusDistribution.map((item) => (
                            <div
                                key={item.status}
                                className="flex items-center justify-between text-xs"
                            >
                                <span className="flex items-center gap-2.5 text-neutral-300">
                                    <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
                                    {item.label}
                                </span>

                                <span className="font-medium tabular-nums text-neutral-100">
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

                        <p className="mt-1 text-xs text-neutral-300">
                            Últimos tickets movimentados
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-175 text-left">
                        <thead>
                            <tr className="border-b border-neutral-800 text-xs uppercase tracking-wide text-neutral-400">
                                <th className="px-5 py-3 font-semibold">Ticket</th>
                                <th className="px-5 py-3 font-semibold">Solicitante</th>
                                <th className="px-5 py-3 font-semibold">Prioridade</th>
                                <th className="px-5 py-3 font-semibold">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {recentTickets.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-5 py-8 text-center text-xs text-neutral-400">
                                        Nenhum ticket recente.
                                    </td>
                                </tr>
                            ) : (
                                recentTickets.map((ticket) => (
                                    <tr
                                        key={ticket.id}
                                        onClick={() =>
                                            navigate("/tickets", {
                                                state: { openTicketId: ticket.id },
                                            })
                                        }
                                        className="border-b border-neutral-800/70 last:border-0 transition hover:bg-white/2 cursor-pointer">

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className={`h-2 w-2 rounded-full ${statusDotMap[ticket.ticketStatus]}`} />

                                                <div>
                                                    <p className="text-xs font-semibold text-white">
                                                        #{ticket.id}
                                                    </p>

                                                    <p className="mt-0.5 text-xs text-neutral-300">
                                                        {ticket.title}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 text-xs text-neutral-200">
                                            {ticket.createdByUserName || "Não identificado"}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="rounded-md border border-neutral-700 bg-neutral-800/60 px-2 py-1 text-xs font-medium text-neutral-200">
                                                {priorityLabels[ticket.ticketPriority] || ticket.ticketPriority}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`rounded-md border px-2 py-1 text-xs font-medium ${statusBadgeMap[ticket.ticketStatus]}`}
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

                        <p className="mt-1 text-xs text-neutral-300">
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
                                        <span className="flex items-center gap-2 text-neutral-200">
                                            <span className={`h-2 w-2 rounded-full ${statusDotMap[status]}`} />
                                            {statusLabels[status]}
                                        </span>

                                        <span className="font-semibold text-neutral-100">{value}</span>
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
                            <span className="text-xs font-medium text-neutral-300">Total no período</span>
                            <span className="text-sm font-semibold text-white">{periodTotal}</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-5">
                    <div className="mb-5">
                        <h2 className="text-sm font-semibold text-white">
                            Tickets por agente
                        </h2>

                        <p className="mt-1 text-xs text-neutral-300">
                            Distribuição dos tickets atribuídos
                        </p>
                    </div>

                    <div className="space-y-4">
                        {agentsView.length === 0 ? (
                            <p className="text-xs text-neutral-400">
                                Nenhum ticket atribuído.
                            </p>
                        ) : (
                            agentsView.map((agent) => (
                                <div key={agent.name} className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-xs font-semibold text-blue-300">
                                        {agent.initials}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="mb-1.5 flex items-center justify-between">
                                            <span className="truncate text-xs font-medium text-neutral-200">
                                                {agent.name}
                                            </span>

                                            <span className="ml-3 text-xs font-semibold text-neutral-100">
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
                    onClick={() =>
                        navigate("/tickets", {
                            state: { openCreateModal: true },
                        })
                    }
                    className="flex items-center gap-3 p-4 text-left transition hover:bg-white/3">

                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                        <Plus className="h-4 w-4" strokeWidth={2} />
                    </span>

                    <span>
                        <span className="block text-xs font-semibold text-white">
                            Novo ticket
                        </span>
                        <span className="mt-0.5 block text-xs text-neutral-300">
                            Abra um novo chamado
                        </span>
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/tickets")}
                    className="flex items-center gap-3 border-t border-neutral-800 p-4 text-left transition hover:bg-white/3 sm:border-t-0 sm:border-l"
                >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-neutral-200">
                        <Inbox className="h-4 w-4" strokeWidth={2} />
                    </span>

                    <span>
                        <span className="block text-xs font-semibold text-white">
                            Meus chamados
                        </span>
                        <span className="mt-0.5 block text-xs text-neutral-300">
                            Acompanhe seus tickets
                        </span>
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/settings")}
                    className="flex items-center gap-3 border-t border-neutral-800 p-4 text-left transition hover:bg-white/3 sm:border-t-0 sm:border-l"
                >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-neutral-200">
                        <Settings className="h-4 w-4" strokeWidth={2} />
                    </span>

                    <span>
                        <span className="block text-xs font-semibold text-white">
                            Configurações
                        </span>
                        <span className="mt-0.5 block text-xs text-neutral-300">
                            Personalize o sistema
                        </span>
                    </span>
                </button>

                <button
                    type="button"
                    disabled
                    className="flex items-center gap-3 border-t border-neutral-800 p-4 text-left opacity-60 sm:border-t-0 sm:border-l cursor-not-allowed">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-neutral-300">
                        <CircleHelp className="h-4 w-4" strokeWidth={2} />
                    </span>

                    <span>
                        <span className="block text-xs font-semibold text-neutral-200">
                            Central de ajuda
                        </span>
                        <span className="mt-0.5 block text-xs text-neutral-400">
                            Consulte a base de conhecimento
                        </span>
                    </span>
                </button>
            </section>
        </div>
    );
}

export default DashboardPage;
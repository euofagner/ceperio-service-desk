import { Card } from "../ui";

const ticketStatuses = [
    {
        key: "open",
        label: "Abertos",
        color: "border-l-red-500",
        indicator: "bg-red-500",
        valueColor: "text-red-400",
    },
    {
        key: "inProgress",
        label: "Em andamento",
        color: "border-l-amber-500",
        indicator: "bg-amber-500",
        valueColor: "text-amber-400",
    },
    {
        key: "resolved",
        label: "Resolvidos",
        color: "border-l-emerald-500",
        indicator: "bg-emerald-500",
        valueColor: "text-emerald-400",
    },
    {
        key: "closed",
        label: "Fechados",
        color: "border-l-slate-400",
        indicator: "bg-slate-400",
        valueColor: "text-slate-400",
    },
];

function TicketSummary({ summary }) {
    return (
        <section
            aria-label="Resumo dos chamados"
            className="mb-6"
        >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {ticketStatuses.map((item) => (
                    <Card
                        key={item.key}
                        className={[
                            "group relative overflow-hidden",
                            "rounded-xl border border-white/8",
                            "border-l-[3px]",
                            item.color,
                            "bg-neutral-900/70 p-5",
                            "transition-all duration-200 ease-out",
                            "hover:-translate-y-0.5",
                            "hover:border-white/[0.14]",
                            "hover:bg-neutral-800/80",
                            "focus-within:ring-2",
                            "focus-within:ring-white/20",
                            "motion-reduce:transform-none",
                        ].join(" ")}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <p className="text-sm font-medium tracking-wide text-neutral-400">
                                    {item.label}
                                </p>

                                <p
                                    className={[
                                        "mt-3 text-3xl font-semibold",
                                        "tracking-tight tabular-nums",
                                        item.valueColor,
                                    ].join(" ")}
                                >
                                    {summary[item.key] ?? 0}
                                </p>
                            </div>

                            <span
                                aria-hidden="true"
                                className={[
                                    "mt-1 h-2.5 w-2.5 shrink-0",
                                    "rounded-full",
                                    item.indicator,
                                    "ring-4 ring-white/4",
                                ].join(" ")}
                            />
                        </div>

                        <div className="mt-4 h-px bg-white/6" />

                        <p className="mt-3 text-xs text-neutral-500">
                            Total de chamados {item.label.toLowerCase()}
                        </p>
                    </Card>
                ))}
            </div>
        </section>
    );
}

export default TicketSummary;
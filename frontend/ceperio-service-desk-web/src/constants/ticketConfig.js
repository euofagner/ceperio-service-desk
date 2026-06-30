export const statusConfig = {
    0: { label: "Aberto", dot: "bg-red-500", badge: "bg-red-500/10 text-red-400 border-red-500/20" },
    1: { label: "Em andamento", dot: "bg-yellow-500", badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
    2: { label: "Resolvido", dot: "bg-green-500", badge: "bg-green-500/10 text-green-400 border-green-500/20" },
    3: { label: "Fechado", dot: "bg-neutral-500", badge: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20" }
};

export const priorityConfig = {
    0: { label: "Baixa", color: "text-green-400", icon: "⬇️" },
    1: { label: "Média", color: "text-blue-400", icon: "📌" },
    2: { label: "Alta", color: "text-orange-400", icon: "🔥" },
    3: { label: "Crítica", color: "text-red-400", icon: "🚨" }
};
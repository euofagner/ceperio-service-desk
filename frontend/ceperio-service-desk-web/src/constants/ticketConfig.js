import { ChevronDown, Minus, Flame, Siren } from "../assets/icons/PriorityIcons";
import { Open, InProgress, Solved, Closed } from "../assets/icons/StatusIcons";

export const statusConfig = {
    0: { label: "Aberto", dot: "bg-red-500", badge: "bg-red-500/10 text-red-400 border-red-500/20", icon: Open },
    1: { label: "Em andamento", dot: "bg-yellow-500", badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", icon: InProgress },
    2: { label: "Resolvido", dot: "bg-green-500", badge: "bg-green-500/10 text-green-400 border-green-500/20", icon: Solved },
    3: { label: "Fechado", dot: "bg-neutral-500", badge: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20", icon: Closed }
};

export const priorityConfig = {
    0: { label: "Baixa", color: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: ChevronDown },
    1: { label: "Média", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", icon: Minus },
    2: { label: "Alta", color: "bg-red-500/10 text-red-400 border-red-500/20", icon: Flame },
    3: { label: "Crítica", color: "bg-purple-500/10 text-purple-400 border-purple-500/20", icon: Siren }
};
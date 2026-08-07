import { Card } from "../ui";

function TicketSummary({ summary }) {
    const items = [
        { label: "Abertos", value: summary.open, color: "bg-red-500/10 border-red-500/20 text-red-400" },
        { label: "Em andamento", value: summary.inProgress, color: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" },
        { label: "Resolvidos", value: summary.resolved, color: "bg-green-500/10 border-green-500/20 text-green-400" },
        { label: "Fechados", value: summary.closed, color: "bg-neutral-500/10 border-neutral-500/20 text-neutral-400" },
    ];

    return (
        <div className="grid grid-cols-4 gap-4 mb-6">
            {items.map(item => (
                <Card key={item.label} className={`p-4 ${item.color}`}>
                    <p className="text-2xl font-bold">{item.value}</p>
                    <p className="text-xs mt-1 opacity-70">{item.label}</p>
                </Card>
            ))}
        </div>
    );
}

export default TicketSummary;
import { formatDate } from "../utils/formatDate";
import { statusConfig, priorityConfig } from "../constants/ticketConfig";

export default function TicketCard({ ticket, onEdit, onDeleteClick, deleteTarget, onCancelDelete, onConfirmDelete, deleting }) {
    const status = statusConfig[ticket.ticketStatus] || statusConfig[0];
    const priority = priorityConfig[ticket.ticketPriority] || priorityConfig[1];
    const isDeleteOpen = deleteTarget === ticket.id;

    return (
        <div className="group bg-neutral-900 hover:border-neutral-600 hover:shadow-lg transition-colors rounded-lg border border-neutral-800/50">
            <div
                onClick={() => onEdit(ticket)}
                className="flex items-center gap-4 px-5 py-4 cursor-pointer">
                <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${status.dot}`} />
                <div className="flex-1 min-w-1">
                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs text-neutral-600 font-mono">#{ticket.id}</span>
                        <h3 className="text-sm font-medium text-white truncate">{ticket.title}</h3>
                    </div>
                    <p className="text-sm text-neutral-500 mb-2 line-clamp-1">{ticket.description}</p>
                    <div className="flex items-center gap-3 text-xs">
                        <span className={`px-2 py-0.5 rounded-full border ${status.badge}`}>
                            {status.label}
                        </span>
                        <span className="text-neutral-500">·</span>  
                        <span className={`flex items-center gap-1 ${priority.color}`}>
                            <span>{priority.icon}</span>
                            <span>{priority.label}</span>
                        </span>
                    </div>
                </div>

                <span className="text-neutral-500 text-sm">{formatDate(ticket.createdAt)}</span>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDeleteClick(ticket.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-neutral-300 transition-all p-1 rounded">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                </button>
            </div>

            {isDeleteOpen && (
                <div className="px-5 py-3 bg-neutral-800/50 border-t border-neutral-800 flex items-center justify-between">
                    <span className="text-sm text-neutral-400">Excluir ticket #{ticket.id}?</span>
                    <div className="flex gap-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); onCancelDelete(); }}
                            className="px-3 py-1 text-xs text-neutral-400 hover:text-white transition-colors">
                            Cancelar
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onConfirmDelete(ticket.id); }}
                            disabled={deleting}
                            className="px-3 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors disabled:opacity-50">
                            {deleting ? "Excluindo..." : "Excluir"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
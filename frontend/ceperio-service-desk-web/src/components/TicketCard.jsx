import TicketDate from "./TicketDate";
import { formatDate, isNew } from "../utils/formatDate";
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
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${status.dot}`} />

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-1">
                            <span className="text-[15px] text-neutral-500 font-mono font-semibold shrink-0">#{ticket.id}</span>

                            <h3 className="text-[15px] font-medium text-white truncate">{ticket.title}</h3>

                            {ticket.ticketStatus === 0 && isNew(ticket.createdAt) && (
                                <span className="px-1.5 py-0.5 text-[12px] flex font-medium bg-blue-500/20 text-blue-400 rounded shrink-0">
                                    Novo
                                </span>
                            )}
                        </div>

                        <p className="text-sm text-neutral-400 mb-2 line-clamp-1">{ticket.description}</p>

                        <div className="flex items-center gap-3 text-xs">
                            <span className={`px-2 py-0.5 rounded-full border ${status.badge} flex items-center gap-1`}>
                                <status.icon className="w-3 h-3" />
                                {status.label}
                            </span>

                            <span className="text-neutral-500">|</span>

                            <span className={`px-2 py-0.5 rounded-full border ${priority.color} shrink-0 flex items-center gap-1`}>
                                <priority.icon className="w-3 h-3" />
                                <span>{priority.label}</span>
                            </span>
                        </div>
                    </div>
                </div>

                <TicketDate content={new Date(ticket.createdAt).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}>
                    <span className="text-neutral-500 text-[16px] cursor-default">
                        {formatDate(ticket.createdAt)}
                    </span>
                </TicketDate>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDeleteClick(ticket.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-neutral-300 transition-all p-1 rounded shrink-0">
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
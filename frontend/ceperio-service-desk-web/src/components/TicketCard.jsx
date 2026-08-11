import { formatDate, isNew } from "../utils/formatDate";
import { statusConfig, priorityConfig } from "../constants/ticketConfig";

import TicketDate from "./TicketDate";
import DeleteConfirm from "./DeleteConfirm";

import { Badge, Button, Card, IconButton } from "./ui";


export default function TicketCard({ ticket, onEdit, onDeleteClick, deleteTarget, onCancelDelete, onConfirmDelete, deleting }) {
    const status = statusConfig[ticket.ticketStatus] || statusConfig[0];
    const priority = priorityConfig[ticket.ticketPriority] || priorityConfig[1];
    const isDeleteOpen = deleteTarget === ticket.id;

    return (
        <Card className="group border-neutral-800/50 hover:border-neutral-600 hover:shadow-lg transition-colors">
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
                                <Badge className="bg-blue-500/20 border-blue-500/20 text-blue-400 text-[12px] rounded-sm font-medium shrink-0">
                                    Novo
                                </Badge>
                            )}
                        </div>

                        <p className="text-sm text-neutral-400 mb-2 line-clamp-1">{ticket.description}</p>

                        <div className="flex items-center gap-3 text-xs">
                            <Badge icon={status.icon} className={status.badge}>
                                {status.label}
                            </Badge>

                            <span className="text-neutral-500">|</span>

                            <Badge icon={priority.icon} className={priority.color}>
                                {priority.label}
                            </Badge>
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

                <IconButton
                    variant="ghost"
                    label="Excluir ticket"
                    className="opacity-0 group-hover:opacity-100 shrink-0"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDeleteClick(ticket.id);
                    }}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                </IconButton>
            </div>

            {isDeleteOpen && (
                <DeleteConfirm
                    ticketId={ticket.id}
                    onCancel={onCancelDelete}
                    onConfirm={onConfirmDelete}
                    deleting={deleting} />
            )}
        </Card>
    );
}
import { formatDate, isNew } from "../utils/formatDate";
import { statusConfig, priorityConfig } from "../constants/ticketConfig";

import TicketDate from "./TicketDate";
import DeleteConfirm from "./DeleteConfirm";

import { Badge, Card, IconButton } from "./ui";

import { useAuth } from "../contexts/AuthContext";


export default function TicketCard({
    ticket,
    onEdit,
    onDeleteClick,
    deleteTarget,
    onCancelDelete,
    onConfirmDelete,
    deleting,
    onAssignTicket
}) {
    const status =
        statusConfig[ticket.ticketStatus] || statusConfig.Open;

    const priority =
        priorityConfig[ticket.ticketPriority] ||
        priorityConfig.Medium;

    const isDeleteOpen = deleteTarget === ticket.id;

    const { user } = useAuth();

    const canAssign =
        user?.role === "Agent" &&
        !ticket.assignedAgentId &&
        ticket.ticketStatus !== "Closed";

    return (
        <Card
            className="
                group
                w-full
                min-w-0
                border-neutral-800/50
                hover:border-neutral-600
                hover:shadow-lg
                transition-colors
                overflow-hidden">
            <div
                onClick={() => onEdit(ticket)}
                className="
                    flex
                    flex-col
                    gap-4
                    px-4
                    py-4
                    cursor-pointer
                    sm:px-5
                    sm:py-4
                    lg:flex-row
                    lg:items-center
                    lg:gap-4">

                <div
                    className="
                        w-full
                        h-1
                        rounded-full
                        shrink-0
                        lg:w-1
                        lg:h-auto
                        lg:self-stretch
                        lg:min-h-20.5">
                    <div
                        className={`
                            w-full
                            h-full
                            rounded-full
                            ${status.dot}
                            opacity-80
                            lg:w-full`} />
                </div>

                <div
                    className="
                        flex-1
                        min-w-0
                        w-full">
                    <div className="flex items-start gap-2 min-w-0 mb-1">

                        <span
                            className="
                                text-[13px]
                                sm:text-[15px]
                                text-neutral-500
                                font-mono
                                font-semibold
                                shrink-0">

                            #{ticket.id}
                        </span>

                        <h3
                            className="
                                min-w-0
                                flex-1
                                text-[14px]
                                sm:text-[15px]
                                font-medium
                                text-white
                                truncate">

                            {ticket.title}
                        </h3>

                        {ticket.ticketStatus === "Open" &&
                            isNew(ticket.createdAt) && (
                                <Badge
                                    className="
                                        bg-blue-500/20
                                        border-blue-500/20
                                        text-blue-400
                                        text-[10px]
                                        sm:text-[12px]
                                        rounded-sm
                                        font-medium
                                        shrink-0">

                                    Novo
                                </Badge>
                            )}
                    </div>

                    <p
                        className="
                            text-[12px]
                            sm:text-[13px]
                            text-neutral-400
                            mb-3
                            line-clamp-2
                            sm:line-clamp-1">

                        {ticket.description}
                    </p>

                    <div
                        className="
                            flex
                            items-center
                            gap-1.5
                            mt-2
                            min-w-0
                            text-[10px]
                            sm:text-[12px]">

                        <span className="text-neutral-400 shrink-0">
                            Responsável
                        </span>

                        <span className="text-neutral-500 shrink-0">
                            |
                        </span>

                        <span
                            className="
                                truncate
                                text-[12px]
                                sm:text-[14px]
                                font-medium
                                text-neutral-300">

                            {ticket.assignedAgentName ||
                                "Não atribuído"}
                        </span>
                    </div>
                </div>

                {/* requester*/}
                <div
                    className="
                        flex
                        items-center
                        gap-2
                        min-w-0
                        w-full
                        lg:w-auto
                        lg:min-w-37.5">

                    <div
                        className="
                            relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-cyan-400 to-blue-600 text-[11px] font-bold text-white">

                        {(ticket.createdByUserName || "?")
                            .split(" ")
                            .slice(0, 2)
                            .map((name) => name[0])
                            .join("")
                            .toUpperCase()}
                    </div>

                    <div className="min-w-0">
                        <p
                            className="
                                truncate
                                text-[12px]
                                sm:text-[14px]
                                font-medium
                                text-neutral-300">

                            {ticket.createdByUserName ||
                                "Não identificado"}
                        </p>

                        <p
                            className="
                                mt-0.5
                                text-[10px]
                                sm:text-[12px]
                                text-neutral-400">

                            Solicitante
                        </p>
                    </div>
                </div>

                {/* status and priority*/}
                <div className="min-w-0">
                    <Badge
                        icon={priority.icon}
                        className={`
                            ${priority.color}
                            inline-flex
                            rounded-md
                            px-2
                            py-2
                            text-[10px]
                            whitespace-nowrap`}>

                        {priority.label}
                    </Badge>
                </div>

                <div className="min-w-0">
                    <Badge
                        icon={status.icon}
                        className={`
                            ${status.badge}
                            inline-flex
                            rounded-md
                            px-2
                            py-2
                            text-[10px]
                            whitespace-nowrap`}>

                        {status.label}
                    </Badge>
                </div>

                {/* date */}
                <div
                    className="
                        hidden sm:flex
                        flex-col
                        items-end
                        justify-center
                        gap-1
                        shrink-0
                        min-w-22">
                    <span className="text-[11px] uppercase font-semibold tracking-wide text-neutral-500">
                        Criado
                    </span>

                    <TicketDate
                        content={new Date(ticket.createdAt).toLocaleString(
                            "pt-BR",
                            {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                            }
                        )}>
                        <span className="truncate
                                text-[12px]
                                sm:text-[14px]
                                font-medium
                                text-neutral-300">
                            {formatDate(ticket.createdAt)}
                        </span>
                    </TicketDate>
                </div>

                <div className="flex items-center justify-end gap-2 w-full lg:w-auto">
                    {canAssign && (
                        <button
                            type="button"
                            className="
                                cursor-pointer
                                rounded-md
                                border border-blue-500/20
                                bg-blue-500/10
                                px-3 py-2
                                text-[11px] font-medium
                                text-blue-400
                                transition-colors
                                hover:bg-blue-500/20
                                hover:text-blue-300"
                            onClick={(e) => {
                                e.stopPropagation();
                                onAssignTicket(ticket.id);
                            }}>
                            Assumir
                        </button>
                    )}

                    {user?.role === "Admin" && (
                        <IconButton
                            variant="ghost"
                            label="Excluir ticket"
                            className="
                                h-8 w-8 shrink-0
                                opacity-100
                                text-neutral-500
                                transition-all
                                lg:opacity-0
                                lg:group-hover:opacity-100
                                focus:opacity-100
                                hover:bg-neutral-800
                                hover:text-neutral-300"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteClick(ticket.id);
                            }}>

                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                        </IconButton>
                    )}
                </div>
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

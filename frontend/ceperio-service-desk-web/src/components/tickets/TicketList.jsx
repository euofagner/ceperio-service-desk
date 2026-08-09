import { Button, EmptyState } from "../ui";

import TicketCard from "../TicketCard"

function TicketList({
    tickets,
    allTickets,
    search,
    onClearSearch,
    onClearFilter,
    onCreateTicket,
    onEdit,
    onDeleteClick,
    deleteTarget,
    onCancelDelete,
    onConfirmDelete,
    deleting,
}) {
    if (tickets.length > 0) {
        return (
            <div className="space-y-3">
                {tickets.map((ticket) => (
                    <TicketCard
                        key={ticket.id}
                        ticket={ticket}
                        onEdit={onEdit}
                        onDeleteClick={onDeleteClick}
                        deleteTarget={deleteTarget}
                        onCancelDelete={onCancelDelete}
                        onConfirmDelete={onConfirmDelete}
                        deleting={deleting}
                    />
                ))}
            </div>
        );
    }

    if (allTickets.length === 0) {
        return (
            <EmptyState
                icon="🎫"
                title="Nenhum ticket encontrado"
                description="Crie o primeiro ticket para começar"
                action={<Button onClick={onCreateTicket}>Criar Ticket</Button>}
            />
        );
    }

    if (search.trim()) {
        return (
            <EmptyState
                icon="🔍"
                title={`Nenhum resultado para "${search}"`}
                description="Tente outro termo de busca"
                action={<Button variant="secondary" onClick={onClearSearch}>Limpar busca</Button>}
            />
        );
    }

    return (
        <EmptyState
            icon="📋"
            title="Nenhum ticket neste status"
            description="Tente selecionar outro filtro"
            action={<Button variant="secondary" onClick={onClearFilter}>Limpar filtro</Button>}
        />
    );
}

export default TicketList;
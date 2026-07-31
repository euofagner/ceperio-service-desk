import Button from "../ui/Button";

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
            <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
                <svg className="w-17 h-17 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-white text-lg mt-4">Nenhum ticket encontrado</h3>
                <p className="text-neutral-500 mt-2">Crie o primeiro ticket para começar</p>
                <Button onClick={onCreateTicket}>Criar Ticket</Button>
            </div>
        );
    }

    if (search.trim()) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
                <span className="text-4xl">🔍</span>
                <h3 className="text-white text-lg mt-4">Nenhum resultado para "{search}"</h3>
                <p className="text-neutral-500 mt-2">Tente outro termo de busca</p>
                <Button variant="secondary" onClick={onClearSearch}>Limpar busca</Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
            <span className="text-4xl">📋</span>
            <h3 className="text-white text-lg mt-4">Nenhum ticket neste status</h3>
            <p className="text-neutral-500 mt-2">Tente selecionar outro filtro</p>
            <Button variant="secondary" onClick={onClearFilter}>Limpar filtro</Button>
        </div>
    );
}

export default TicketList;
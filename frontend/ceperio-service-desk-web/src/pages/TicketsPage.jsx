import { useEffect, useState } from "react";
import { useToast } from "../hooks/useToast";
import { useTickets } from "../hooks/useTickets";

import api from "../services/api";
import Toast from "../components/Toast";
import Skeleton from "../components/Skeleton";
import cepelogo from "../assets/cepelogo.png";
import TicketCard from "../components/TicketCard";
import TicketModal from "../components/TicketModal";
import TicketList from "../components/tickets/TicketList";
import TicketHeader from "../components/tickets/TicketHeader";
import TicketToolbar from "../components/tickets/TicketToolbar";
import TicketSummary from "../components/tickets/TicketSummary";

function TicketsPage() {
    const [filter, setFilter] = useState("all");

    const [search, setSearch] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editingTicket, setEditingTicket] = useState(null);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const { toast, setToast, showToast, pauseToast, resumeToast } = useToast();

    const { tickets, summary, loading, refresh, page, setPage, totalPages, hasNextPage, hasPreviousPage } = useTickets();

    function openCreateModal() {
        setEditingTicket(null);
        setShowModal(true);
    }

    function openEditModal(ticket) {
        setEditingTicket(ticket);
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
        setEditingTicket(null);
    }

    async function handleSubmit(ticketId, formData) {
        try {
            if (ticketId) {
                const ticket = tickets.find(t => t.id === ticketId);
                await api.put(`/tickets/${ticketId}`, {
                    id: ticketId,
                    ...formData,
                    createdAt: ticket.createdAt,
                });
                showToast("Ticket atualizado com sucesso!");
            } else {
                await api.post("/tickets", formData);
                showToast("Ticket criado com sucesso!");
            }
            await refresh();
        } catch {
            showToast(ticketId ? "Erro ao salvar ticket." : "Erro ao criar ticket.", "error");
        }
    }

    async function handleDeleteTicket(id) {
        setDeleting(true);
        try {
            await api.delete(`/tickets/${id}`);
            setDeleteTarget(null);
            await refresh();
            showToast("Ticket excluído com sucesso!");
        } catch {
            showToast("Erro ao excluir ticket.", "error");
        } finally {
            setDeleting(false);
        }
    }

    const filteredBySearch = search.trim()
        ? tickets.filter(t =>
            t.title.toLowerCase().includes(search.toLowerCase()) ||
            t.description.toLowerCase().includes(search.toLowerCase())
        )
        : tickets;

    const filteredTickets = filter === "all"
        ? filteredBySearch
        : filteredBySearch.filter(t => t.ticketStatus === parseInt(filter));

    if (loading) {
        return <Skeleton logo={cepelogo} />;
    }

    return (
        <div>
            <div className="max-w-5xl mx-auto">
                <TicketHeader userName="Fagner" onCreateTicket={openCreateModal} />

                <TicketSummary summary={summary} />

                <TicketToolbar
                    search={search}
                    filter={filter}
                    onSearchChange={setSearch}
                    onFilterChange={setFilter} />

                {/* tickets list */}
                <TicketList
                    tickets={filteredTickets}
                    allTickets={tickets}
                    search={search}
                    onClearSearch={() => setSearch("")}
                    onClearFilter={() => setFilter("all")}
                    onCreateTicket={openCreateModal}
                    onEdit={openEditModal}
                    onDeleteClick={(id) => setDeleteTarget(deleteTarget === id ? null : id)}
                    deleteTarget={deleteTarget}
                    onCancelDelete={() => setDeleteTarget(null)}
                    onConfirmDelete={handleDeleteTicket}
                    deleting={deleting}
                />

                <div className="mt-4 font-bold text-neutral-500">
                    {tickets.length > 0 ? (
                        <>
                            Mostrando {(page - 1) * 5 + 1} a {Math.min(page * 5, summary.total)} de {summary.total} tickets
                        </>
                    ) : (
                        <>Nenhum ticket encontrado</>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-800">
                        <span className="text-neutral-500">
                            Página {page} de {totalPages}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(page - 1)}
                                disabled={!hasPreviousPage}
                                className="px-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white hover:border-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                ← Anterior
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${p === page
                                        ? 'bg-white text-black'
                                        : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                                        }`}>
                                    {p}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={!hasNextPage}
                                className="px-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white hover:border-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                Próximo →
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* create and update ticket */}
            {showModal && (
                <TicketModal
                    ticket={editingTicket}
                    onSubmit={handleSubmit}
                    onClose={closeModal} />
            )}

            <Toast
                toast={toast}
                onClose={() => setToast(null)}
                onMouseEnter={pauseToast}
                onMouseLeave={resumeToast} />
        </div>
    );
}

export default TicketsPage;
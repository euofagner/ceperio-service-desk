import { useEffect, useState } from "react";

import { useToast } from "../hooks/useToast";
import { useTickets } from "../hooks/useTickets";

import api from "../services/api";

import Skeleton from "../components/Skeleton";
import TicketCard from "../components/TicketCard";
import Toast from "../components/Toast";
import TicketModal from "../components/TicketModal";
import TicketList from "../components/tickets/TicketList";
import TicketPagination from "../components/tickets/TicketPagination";
import TicketHeader from "../components/tickets/TicketHeader";
import TicketToolbar from "../components/tickets/TicketToolbar";
import TicketSummary from "../components/tickets/TicketSummary";

import cepelogo from "../assets/cepelogo.png";

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
                    deleting={deleting} />

                <TicketPagination
                    ticketsCount={tickets.length}
                    summary={summary}
                    page={page}
                    totalPages={totalPages}
                    hasPreviousPage={hasPreviousPage}
                    hasNextPage={hasNextPage}
                    onPageChange={setPage} />
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
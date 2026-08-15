import { useState } from "react";
import { useToast } from "../hooks/useToast";
import { useTickets } from "../hooks/useTickets";
import { useDebounce } from "../hooks/useDebounce";
import { createTicket, updateTicket, deleteTicket } from "../services/ticketService";
import Skeleton from "../components/Skeleton";
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
    const debouncedSearch = useDebounce(search, 300);

    const [showModal, setShowModal] = useState(false);
    const [editingTicket, setEditingTicket] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const { toast, setToast, showToast, pauseToast, resumeToast } = useToast();

    const statusParam = filter === "all" ? null : parseInt(filter);

    const { tickets, summary, loading, refresh, page, setPage, totalPages, hasNextPage, hasPreviousPage } = useTickets(debouncedSearch, statusParam);

    function openCreateModal() { setEditingTicket(null); setShowModal(true); }
    function openEditModal(ticket) { setEditingTicket(ticket); setShowModal(true); }
    function closeModal() { setShowModal(false); setEditingTicket(null); }

    async function handleSubmit(ticketId, formData) {
        try {
            if (ticketId) {
                const ticket = tickets.find(t => t.id === ticketId);
                await updateTicket(ticketId, formData, ticket);
                showToast("Ticket atualizado com sucesso!");
            } else {
                await createTicket(formData);
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
            await deleteTicket(id);
            setDeleteTarget(null);
            await refresh();
            showToast("Ticket excluído com sucesso!");
        } catch {
            showToast("Erro ao excluir ticket.", "error");
        } finally {
            setDeleting(false);
        }
    }

    if (loading && tickets.length === 0) return <Skeleton logo={cepelogo} />;

    return (
        <div>
            <div className="max-w-5xl mx-auto">
                <TicketHeader userName="Fagner" onCreateTicket={openCreateModal} />
                <TicketSummary summary={summary} />
                <TicketToolbar search={search} filter={filter} onSearchChange={setSearch} onFilterChange={setFilter} />
                <div className="relative">
                    {loading && tickets.length > 0 && (
                        <div className="absolute right-0 -top-8 flex items-center gap-2 text-xs text-neutral-500">
                            <span className="w-3 h-3 border-2 border-neutral-700 border-t-white rounded-full animate-spin" />
                            Carregando...
                        </div>
                    )}

                    <TicketList
                        tickets={tickets}
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
                </div>
                <TicketPagination
                    ticketsCount={tickets.length}
                    summary={summary}
                    page={page}
                    totalPages={totalPages}
                    hasPreviousPage={hasPreviousPage}
                    hasNextPage={hasNextPage}
                    onPageChange={setPage}
                />
            </div>
            {showModal && <TicketModal ticket={editingTicket} onSubmit={handleSubmit} onClose={closeModal} />}
            <Toast toast={toast} onClose={() => setToast(null)} onMouseEnter={pauseToast} onMouseLeave={resumeToast} />
        </div>
    );
}

export default TicketsPage;
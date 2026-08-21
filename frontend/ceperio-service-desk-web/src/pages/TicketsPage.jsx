import { useState } from "react";

import cepelogo from "../assets/cepelogo.png";

import Skeleton from "../components/Skeleton";
import Toast from "../components/Toast";
import TicketModal from "../components/TicketModal";
import TicketList from "../components/tickets/TicketList";
import TicketPagination from "../components/tickets/TicketPagination";
import TicketSummary from "../components/tickets/TicketSummary";
import TicketToolbar from "../components/tickets/TicketToolbar";

import { useDebounce } from "../hooks/useDebounce";
import { useTickets } from "../hooks/useTickets";
import { useToast } from "../hooks/useToast";

import { useTicketModal } from "../contexts/TicketModalContext";

import { createTicket, deleteTicket, updateTicket } from "../services/ticketService";
import { getHttpErrorMessage } from "../utils/httpError";

function TicketsPage() {
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const { toast, setToast, showToast, pauseToast, resumeToast } = useToast();
    const { showModal, editingTicket, openCreateModal, openEditModal, closeModal } = useTicketModal();

    const statusParam = filter === "all" ? null : parseInt(filter);

    const { tickets, summary, loading, refresh, page, setPage, totalCount, pageSize, totalPages, hasNextPage, hasPreviousPage } = useTickets(debouncedSearch, statusParam);

    async function handleSubmit(ticketId, formData) {
        try {
            if (ticketId) {
                await updateTicket(ticketId, formData);
                showToast("Ticket atualizado com sucesso!");
            } else {
                await createTicket(formData);
                showToast("Ticket criado com sucesso!");
            }

            closeModal();
            await refresh();
        } catch (error) {
            if (error.errorType === "validation") {
                throw error;
            }
            showToast(getHttpErrorMessage(error, ticketId ? "Erro ao salvar ticket." : "Erro ao criar ticket."), "error");
        }
    }

    async function handleDeleteTicket(id) {
        setDeleting(true);
        try {
            await deleteTicket(id);
            setDeleteTarget(null);
            await refresh();
            showToast("Ticket excluído com sucesso!");
        } catch (error) {
            showToast(getHttpErrorMessage(error, "Erro ao excluir ticket."), "error");
        } finally {
            setDeleting(false);
        }
    }

    if (loading && tickets.length === 0) {
        return <Skeleton logo={cepelogo} />;
    }

    return (
        <div>
            <div className="mx-auto max-w-5xl">
                <TicketSummary summary={summary} />
                <TicketToolbar search={search} filter={filter} onSearchChange={setSearch} onFilterChange={setFilter} />

                <div className="relative">
                    {loading && tickets.length > 0 && (
                        <div className="absolute -top-8 right-0 flex items-center gap-2 text-xs text-neutral-500">
                            <span className="h-3 w-3 animate-spin rounded-full border-2 border-neutral-700 border-t-white" />
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
                    totalCount={totalCount}
                    page={page}
                    pageSize={pageSize}
                    totalPages={totalPages}
                    hasPreviousPage={hasPreviousPage}
                    hasNextPage={hasNextPage}
                    onPageChange={setPage}
                />
            </div>

            {showModal && (
                <TicketModal ticket={editingTicket} onSubmit={handleSubmit} onClose={closeModal} />
            )}

            <Toast toast={toast} onClose={() => setToast(null)} onMouseEnter={pauseToast} onMouseLeave={resumeToast} />
        </div>
    );
}

export default TicketsPage;
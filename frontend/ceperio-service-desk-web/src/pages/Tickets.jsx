import { useToast } from "../hooks/useToast";
import { useEffect, useState } from "react";
import { useTickets } from "../hooks/useTickets";
import { formatDate } from "../utils/formatDate";
import { priorityConfig, statusConfig } from "../constants/ticketConfig";
import api from "../services/api";
import Toast from "../components/Toast";
import Skeleton from "../components/Skeleton";
import cepelogo from "../assets/cepelogo.png";
import TicketCard from "../components/TicketCard";
import TicketModal from "../components/TicketModal";

function Tickets() {
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
        <div className="min-h-screen bg-neutral-950 text-neutral-200">
            <div className="max-w-5xl mx-auto px-6 py-12">
                <div className="mb-5">
                    <div className="flex items-center mb-2">
                        <img
                            src={cepelogo}
                            alt="Company Logo"
                            className="h-15 w-auto" />
                        <div>
                            <h1 className="text-2xl font-semibold text-white">
                                CepeRio Service Desk
                            </h1>

                            <div className="flex gap-4 mt-2 text-xs text-neutral-500">
                                <span>{tickets.length} tickets</span>
                                <span>Atualizado agora</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-neutral-500 text-sm">
                        Tickets de chamados de TI dos departamentos
                    </p>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                        <p className="text-2xl font-bold text-red-400">{summary.open}</p>
                        <p className="text-xs text-red-400/70 mt-1">Abertos</p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                        <p className="text-2xl font-bold text-yellow-400">{summary.inProgress}</p>
                        <p className="text-xs text-yellow-400/70 mt-1">Em andamento</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                        <p className="text-2xl font-bold text-green-400">{summary.resolved}</p>
                        <p className="text-xs text-green-400/70 mt-1">Resolvidos</p>
                    </div>
                    <div className="bg-neutral-500/10 border border-neutral-500/20 rounded-xl p-4">
                        <p className="text-2xl font-bold text-neutral-400">{summary.closed}</p>
                        <p className="text-xs text-neutral-400/70 mt-1">Fechados</p>
                    </div>
                </div>

                {/* Search input */}
                <div className="mb-5">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por título ou descrição..."
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-700" />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white">

                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* tickets filter and +ticket button*/}
                <div className="flex items-center justify-between mb-5 gap-3">
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer">
                        <span className="text-lg leading-none">+</span> Novo Ticket
                    </button>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-00 focus:outline-none focus:border-neutral-700">

                        <option value="all">Todos os status</option>
                        <option value="0">Aberto</option>
                        <option value="1">Em andamento</option>
                        <option value="2">Resolvido</option>
                        <option value="3">Fechado</option>
                    </select>
                </div>

                {/* tickets list */}
                <div className="space-y-3">
                    {filteredTickets.length > 0 ? (
                        filteredTickets.map((ticket) => {
                            const status = statusConfig[ticket.ticketStatus] || statusConfig[0];
                            const priority = priorityConfig[ticket.ticketPriority] || priorityConfig[1];

                            return (
                                <TicketCard
                                    key={ticket.id}
                                    ticket={ticket}
                                    onEdit={openEditModal}
                                    onDeleteClick={(id) => setDeleteTarget(deleteTarget === id ? null : id)}
                                    deleteTarget={deleteTarget}
                                    onCancelDelete={() => setDeleteTarget(null)}
                                    onConfirmDelete={handleDeleteTicket}
                                    deleting={deleting} />
                            );
                        })
                    ) : tickets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
                            <svg className="w-17 h-17 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-white text-lg mt-4">Nenhum ticket encontrado</h3>
                            <p className="text-neutral-500 mt-2">Crie o primeiro ticket para começar</p>
                            <button onClick={openCreateModal} className="mt-4 px-4 py-2 bg-white text-black rounded-lg hover:bg-neutral-200">
                                Criar Ticket
                            </button>
                        </div>
                    ) : search.trim() ? (
                        <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
                            <span className="text-4xl">🔍</span>
                            <h3 className="text-white text-lg mt-4">Nenhum resultado para "{search}"</h3>
                            <p className="text-neutral-500 mt-2">Tente outro termo de busca</p>
                            <button onClick={() => setSearch("")} className="mt-4 px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700">
                                Limpar busca
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
                            <span className="text-4xl">📋</span>
                            <h3 className="text-white text-lg mt-4">Nenhum ticket neste status</h3>
                            <p className="text-neutral-500 mt-2">Tente selecionar outro filtro</p>
                            <button onClick={() => setFilter("all")} className="mt-4 px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700">
                                Limpar filtro
                            </button>
                        </div>
                    )}
                </div>

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

export default Tickets
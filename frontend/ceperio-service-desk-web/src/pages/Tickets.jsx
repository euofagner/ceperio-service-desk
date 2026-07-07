import { useToast } from "../hooks/useToast";
import { formatDate } from "../utils/formatDate";
import { useEffect, useState } from "react";
import cepelogo from "../assets/cepelogo.png";
import TicketCard from "../components/TicketCard";
import TicketModal from "../components/TicketModal";
import api from "../services/api";
import { priorityConfig, statusConfig } from "../constants/ticketConfig";

function Tickets() {
    const [tickets, setTickets] = useState([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    const [summary, setSummary] = useState({
        total: 0,
        open: 0,
        inProgress: 0,
        resolved: 0,
        closed: 0
    });

    const [showModal, setShowModal] = useState(false);
    const [editingTicket, setEditingTicket] = useState(null);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const { toast, setToast, showToast, pauseToast, resumeToast } = useToast();

    async function getTickets() {
        try {
            const ticketsFromApi = await api.get("/tickets");
            setTickets(ticketsFromApi.data);
        } catch {
            showToast("Erro ao carregar tickets. Verifique sua conexão.", "error");
        }
        finally {
            setLoading(false);
        }
    }

    async function getSummary() {
        try {
            const response = await api.get("/tickets/summary");
            setSummary(response.data);
        } catch {

        }
    }

    useEffect(() => {
        getTickets();
        getSummary();
    }, []);

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
            await getTickets();
        } catch {
            showToast(ticketId ? "Erro ao salvar ticket. Verifique sua conexão." : "Erro ao criar ticket. Verifique sua conexão.", "error");
        }
    }

    async function handleDeleteTicket(id) {
        setDeleting(true);
        try {
            await api.delete(`/tickets/${id}`);
            setDeleteTarget(null);
            await getTickets();
            showToast("Ticket excluído com sucesso!");
        } catch {
            showToast("Erro ao excluir ticket. Verifique sua conexão.", "error");
        }
        finally {
            setDeleting(false);
        }
    }

    const filteredTickets = filter === "all"
        ? tickets
        : tickets.filter(t => t.ticketStatus === parseInt(filter));

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <div className="w-full max-w-md">
                    <div className="flex items-center gap-4 mb-8">
                        <img
                            src={cepelogo}
                            alt="Logo"
                            className="h-12" />

                        <div>
                            <h1 className="text-white font-semibold">
                                Ceperio Service Desk
                            </h1>
                            <p className="text-neutral-500 text-sm">
                                Sincronizando chamados...
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {[...Array(4)].map((_, index) => (
                            <div
                                key={index}
                                className="bg-neutral-900 rounded-lg p-5">
                                <div className="flex gap-4">
                                    <div className="w-2 h-2 rounded-full bg-neutral-700 mt-2 animate-pulse" />

                                    <div className="flex-1">
                                        <div className="h-4 w-3/5 bg-neutral-800 rounded animate-pulse mb-3" />
                                        <div className="h-3 w-full bg-neutral-800 rounded animate-pulse mb-2" />
                                        <div className="h-3 w-2/3 bg-neutral-800 rounded animate-pulse mb-3" />

                                        <div className="flex gap-2">
                                            <div className="h-5 w-20 bg-neutral-800 rounded-full animate-pulse" />
                                            <div className="h-5 w-16 bg-neutral-800 rounded-full animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="h-3 w-16 bg-neutral-800 rounded animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-200">
            <div className="max-w-7xl mx-auto px-6 py-12">
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

                <div className="flex gap-3 mb-6">
                    <span className="bg-red-500/10 text-red-400 text-xs font-semibold rounded-full px-3 py-1">
                        {summary.open} ticket{summary.open !== 1 && "s"} aberto{summary.open !== 1 && "s"}
                    </span>
                    <span className="bg-yellow-500/10 text-yellow-400 text-xs items-center font-semibold rounded-full px-3 py-1">
                        {summary.inProgress} ticket{summary.inProgress !== 1 && "s"} em andamento
                    </span>
                    <span className="bg-green-500/10 text-green-400 items-center font-semibold text-xs px-3 py-1 rounded-full">
                        {summary.resolved} ticket{summary.resolved !== 1 && "s"} resolvido{summary.resolved !== 1 && "s"}
                    </span>
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
                            <button onClick={openCreateModal} className="mt-4 px-4 py-2 bg-white text-black rounded-lg hover:bg-neutral-200 ">
                                Criar Ticket
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <span className="text-4xl">🔍</span>
                            <h3 className="text-white text-lg mt-4">Nenhum ticket neste status</h3>
                            <p className="text-neutral-500 mt-2">Tente selecionar outro filtro</p>
                        </div>
                    )}
                </div>

                <div className="mt-4 font-bold text-neutral-500">
                    Mostrando {filteredTickets.length} de {tickets.length} tickets
                </div>
            </div>

            {/* create and update ticket */}
            {showModal && (
                <TicketModal
                    ticket={editingTicket}
                    onSubmit={handleSubmit}
                    onClose={closeModal} />
            )}

            {/* action ticket notification (toast) */}
            {toast && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in" onMouseEnter={pauseToast} onMouseLeave={resumeToast}>
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm shadow-lg ${toast.type === 'success'
                        ? 'bg-green-950 border-green-800 text-green-300'
                        : 'bg-red-950 border-red-800 text-red-300'
                        }`}>
                        {toast.type === 'success' ? (
                            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                        <span>{toast.message}</span>
                        <button onClick={() => setToast(null)} className="ml-4 text-neutral-500 hover:text-white">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Tickets
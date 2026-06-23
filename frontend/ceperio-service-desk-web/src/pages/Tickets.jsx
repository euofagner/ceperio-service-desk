import { useEffect, useState } from "react";
import api from "../services/api";
import cepelogo from "../assets/cepelogo.png";

const statusConfig = {
    0: { label: "Aberto", dot: "bg-red-500", badge: "bg-red-500/10 text-red-400 border-red-500/20" },
    1: { label: "Em andamento", dot: "bg-yellow-500", badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
    2: { label: "Resolvido", dot: "bg-green-500", badge: "bg-green-500/10 text-green-400 border-green-500/20" },
    3: { label: "Fechado", dot: "bg-neutral-500", badge: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20" }
};

const priorityConfig = {
    0: { label: "Baixa", color: "text-yellow-500" },
    1: { label: "Média", color: "text-yellow-500" },
    2: { label: "Alta", color: "text-yellow-500" },
    3: { label: "Crítica", color: "text-yellow-500" }
};

function Tickets() {

    const [tickets, setTickets] = useState([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [newTicket, setNewTicket] = useState({
        title: "",
        description: "",
        ticketPriority: 1
    });
    const [submitting, setSubmitting] = useState(false);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    async function getTickets() {
        try {
            const ticketsFromApi = await api.get("/tickets");
            setTickets(ticketsFromApi.data);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getTickets();
    }, []);

    async function handleCreateTicket(e) {
        e.preventDefault();
        if (!newTicket.title.trim()) return;

        setSubmitting(true);
        try {
            await api.post("/tickets", newTicket);
            setShowModal(false);
            setNewTicket({ title: "", description: "", ticketPriority: 1 });
            await getTickets(); 
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDeleteTicket(id) {
        setDeleting(true);
        try {
            await api.delete(`/tickets/${id}`);
            setDeleteTarget(null);
            await getTickets();
        } finally {
            setDeleting(false);
        }
    }

    const filteredTickets = filter === "all"
        ? tickets
        : tickets.filter(t => t.ticketStatus === parseInt(filter));

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diff === 0) return "Hoje";
        if (diff === 1) return "Ontem";
        return `há ${diff} dias`;
    }

    const openTickets = tickets.filter(t => t.ticketStatus === 0).length;
    const inProgressTickets = tickets.filter(t => t.ticketStatus === 1).length;
    const solvedTickets = tickets.filter(t => t.ticketStatus === 2).length;

    if (loading) {
        return (
            <div className="bg-neutral-950 text-neutral-200 min-h-screen flex items-center justify-center">
                <p>Carregando tickets...</p>
            </div>
        )
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
                        {openTickets} ticket{openTickets !== 1 && "s"} aberto{openTickets !== 1 && "s"}
                    </span>
                    <span className="bg-yellow-500/10 text-yellow-400 text-xs items-center font-semibold rounded-full px-3 py-1">
                        {inProgressTickets} ticket{inProgressTickets !== 1 && "s"} em andamento
                    </span>
                    <span className="bg-green-500/10 text-green-400 items-center font-semibold text-xs px-3 py-1 rounded-full">
                        {solvedTickets} ticket{solvedTickets !== 1 && "s"} resolvido{solvedTickets !== 1 && "s"}
                    </span>
                </div>

                {/* tickets filter and +ticket button*/}
                <div className="flex items-center justify-between mb-5 gap-3">
                    <button
                        onClick={() => setShowModal(true)}
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
                    {filteredTickets.map((ticket) => {
                        const status = statusConfig[ticket.ticketStatus] || statusConfig[0];
                        const priority = priorityConfig[ticket.ticketPriority] || priorityConfig[1];

                        return (
                            <div
                                key={ticket.id}
                                className="group bg-neutral-900 hover:border-neutral-600 hover:shadow-lg transition-colors rounded-lg cursor-pointer border border-neutral-800/50">

                                <div className="flex items-center gap-4 px-5 py-4">
                                    {/* Status dot */}
                                    <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${status.dot}`} />

                                    {/* Conteúdo */}
                                    <div className="flex-1 min-w-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-xs text-neutral-600 font-mono">
                                                #{ticket.id}
                                            </span>
                                            <h3 className="text-sm font-medium text-white truncate">
                                                {ticket.title}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-neutral-500 mb-2 line-clamp-1">
                                            {ticket.description}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[11px] px-2 py-0.5 rounded-full border ${status.badge}`}>
                                                {status.label}
                                            </span>
                                            <span className="text-sm">
                                                {priority.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Data */}
                                    <span className="text-neutral-500">
                                        {formatDate(ticket.createdAt)}
                                    </span>

                                    {/* exclude ticket */}
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteTarget(deleteTarget === ticket.id ? null : ticket.id)
                                    }} className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-neutral-300 transition-all p-1 rounded">

                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                        </svg>
                                    </button>
                                </div>
                                {/* AQUI - Confirmação de delete */}
                                {deleteTarget === ticket.id && (
                                    <div className="px-5 py-3 bg-neutral-800/50 border-t border-neutral-800 flex items-center justify-between">
                                        <span className="text-sm text-neutral-400">
                                            Excluir ticket #{ticket.id}?
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDeleteTarget(null);
                                                }}
                                                className="px-3 py-1 text-xs text-neutral-400 hover:text-white transition-colors">
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteTicket(ticket.id);
                                                }}
                                                disabled={deleting}
                                                className="px-3 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors disabled:opacity-50">
                                                {deleting ? "Excluindo..." : "Excluir"}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="mt-4 font-bold text-neutral-500">
                    Mostrando {filteredTickets.length} de {tickets.length} tickets
                </div>
            </div>

            {/* create ticket */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setShowModal(false)} />

                    <div className="relative bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-lg mx-4 p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">
                            Novo Ticket
                        </h2>

                        <form onSubmit={handleCreateTicket} className="space-y-4">
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">
                                    Título
                                </label>
                                <input
                                    type="text"
                                    value={newTicket.title}
                                    onChange={(e) =>
                                        setNewTicket({ ...newTicket, title: e.target.value })
                                    }
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500" placeholder="Ex: Impressora não funciona" required />
                            </div>

                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">
                                    Descrição
                                </label>
                                <textarea
                                    value={newTicket.description}
                                    onChange={(e) =>
                                        setNewTicket({ ...newTicket, description: e.target.value })
                                    }
                                    rows={3}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 resize-none" placeholder="Descreva o problema..." />
                            </div>

                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">
                                    Prioridade
                                </label>
                                <select
                                    value={newTicket.ticketPriority}
                                    onChange={(e) =>
                                        setNewTicket({
                                            ...newTicket,
                                            ticketPriority: parseInt(e.target.value),
                                        })
                                    }
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-500">

                                    <option value={0}>Baixa</option>
                                    <option value={1}>Média</option>
                                    <option value={2}>Alta</option>
                                    <option value={3}>Crítica</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 bg-neutral-800 text-neutral-300 text-sm rounded-lg hover:bg-neutral-700 transition-colors">
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || !newTicket.title.trim()}
                                    className="flex-1 px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                    {submitting ? "Criando..." : "Criar Ticket"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Tickets
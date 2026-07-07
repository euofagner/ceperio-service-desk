import { useState, useEffect } from "react";

function TicketModal({ ticket, onSubmit, onClose }) {
    const editing = ticket !== null;

    const [formData, setFormData] = useState({
        title: ticket?.title || "",
        description: ticket?.description || "",
        ticketPriority: ticket?.ticketPriority ?? 1,
        ticketStatus: ticket?.ticketStatus ?? 0
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === "Escape") onClose();
        }

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!formData.title.trim()) return;
        
        if (editing) {
            const nothingChanged = 
                formData.title === ticket.title &&
                formData.description === (ticket.description || "") &&
                formData.ticketPriority === ticket.ticketPriority &&
                formData.ticketStatus === ticket.ticketStatus;
                
            if (nothingChanged) {
                onClose();
                return;
            }
        }

        setSubmitting(true);
        try {
            await onSubmit(ticket?.id, formData);
            onClose();
        } finally {
            setSubmitting(false);
        }
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div className="relative bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-lg mx-4 p-6" 
                onClick={(e) => e.stopPropagation()}>
                    
                <h2 className="text-lg font-semibold text-white mb-4">
                    {editing ? "Editar Ticket" : "Novo Ticket"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-neutral-400 mb-1">Título</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                            placeholder="Ex: Impressora não funciona"
                            required />
                    </div>

                    <div>
                        <label className="block text-sm text-neutral-400 mb-1">Descrição</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 resize-none"
                            placeholder="Descreva o problema..." />
                    </div>

                    {editing && (
                        <div>
                            <label className="block text-sm text-neutral-400 mb-1">Status</label>
                            <select
                                value={formData.ticketStatus}
                                onChange={(e) => setFormData({ ...formData, ticketStatus: parseInt(e.target.value) })}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-500">
                                <option value={0}>Aberto</option>
                                <option value={1}>Em andamento</option>
                                <option value={2}>Resolvido</option>
                                <option value={3}>Fechado</option>
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm text-neutral-400 mb-1">Prioridade</label>
                        <select
                            value={formData.ticketPriority}
                            onChange={(e) => setFormData({ ...formData, ticketPriority: parseInt(e.target.value) })}
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
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-neutral-800 text-neutral-300 text-sm rounded-lg hover:bg-neutral-700 transition-colors">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || !formData.title.trim()}
                            className="flex-1 px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {submitting ? "Salvando..." : editing ? "Salvar" : "Criar Ticket"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TicketModal;
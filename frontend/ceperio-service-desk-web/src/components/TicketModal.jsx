import { useState, useEffect } from "react";

import { Button, FormField, Input, Modal, Select, Spinner, Textarea } from "./ui";

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
        <Modal onClose={onClose}>
            <h2 className="text-lg font-semibold text-white mb-4">
                {editing ? "Editar Ticket" : "Novo Ticket"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <FormField label="Título">
                    <Input type="text" value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Ex: Impressora não funciona" required />
                </FormField>

                <FormField label="Descrição">
                    <Textarea value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3} placeholder="Descreva o problema..." />
            </FormField>

                {editing && (
                    <FormField label="Status">
                        <Select value={formData.ticketStatus}
                            onChange={(e) => setFormData({ ...formData, ticketStatus: parseInt(e.target.value) })}>
                            <option value={0}>Aberto</option>
                            <option value={1}>Em andamento</option>
                            <option value={2}>Resolvido</option>
                            <option value={3}>Fechado</option>
                        </Select>
                    </FormField>
                )}

                <FormField label="Prioridade">
                    <Select value={formData.ticketPriority}
                        onChange={(e) => setFormData({ ...formData, ticketPriority: parseInt(e.target.value) })}>
                        <option value={0}>Baixa</option>
                        <option value={1}>Média</option>
                        <option value={2}>Alta</option>
                        <option value={3}>Crítica</option>
                    </Select>
                </FormField>

                <div className="flex gap-3 pt-2">
                    <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancelar</Button>

                    <Button type="submit" variant="primary" className="flex-1" disabled={submitting || !formData.title.trim()}>
                        {submitting && <Spinner size="sm" />}
                        {submitting ? "Salvando..." : editing ? "Salvar" : "Criar Ticket"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

export default TicketModal;
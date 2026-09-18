import { useState, useEffect } from "react";

import { Button, FormField, Input, Modal, Select, Spinner, Textarea } from "./ui";

import { getValidationErrors } from "../utils/httpError";

import { useAuth } from "../contexts/AuthContext";

import CommentList from "./CommentList";

function TicketModal({ ticket, onSubmit, onRequestInformation, onClose }) {
    const editing = ticket !== null;

    const [formData, setFormData] = useState({
        title: ticket?.title || "",
        description: ticket?.description || "",
        ticketPriority: ticket?.ticketPriority ?? "Medium",
        ticketStatus: ticket?.ticketStatus ?? "Open"
    });

    const [submitting, setSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const { user } = useAuth();

    const [requestingInformation, setRequestingInformation] = useState(false);
    const [requestContent, setRequestContent] = useState("");
    const [commentRefreshKey, setCommentRefreshKey] = useState(0);

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

        setSubmitting(true);
        setValidationErrors({});

        try {
            await onSubmit(ticket?.id, formData);
            onClose();
        } catch (error) {
            const errors = getValidationErrors(error);
            if (Object.keys(errors).length > 0) {
                setValidationErrors(errors);
            }
        } finally {
            setSubmitting(false);
        }
    }

    async function handleRequestInformation() {
        const content = requestContent.trim();
        if (!content) return;

        setRequestingInformation(true);
        try {
            await onRequestInformation(ticket.id, content);
            setRequestContent("");
            setFormData((current) => ({ ...current, ticketStatus: "WaitingUser" }));
            setCommentRefreshKey((current) => current + 1);
        }
        finally {
            setRequestingInformation(false);
        }
    }

    return (
        <Modal onClose={onClose}>
            <h2 className="text-lg font-semibold text-white mb-4">
                {editing ? "Editar Ticket" : "Novo Ticket"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <FormField label="Título">
                    <Input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Ex: Impressora não funciona"
                    />
                    {validationErrors.Title && (
                        <p className="text-xs text-red-400 mt-1">{validationErrors.Title.join(" ")}</p>
                    )}
                </FormField>

                <FormField label="Descrição">
                    <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        placeholder="Descreva o problema..."
                    />
                    {validationErrors.Description && (
                        <p className="text-xs text-red-400 mt-1">{validationErrors.Description.join(" ")}</p>
                    )}
                </FormField>

                {editing && (user?.role === "Agent" || user?.role === "Admin") && (
                    <FormField label="Status">
                        <Select
                            value={formData.ticketStatus}
                            onChange={(e) => setFormData({ ...formData, ticketStatus: e.target.value })}>
                            <option value="Open">Aberto</option>
                            <option value="InProgress">Em andamento</option>
                            <option value="Resolved">Resolvido</option>
                            <option value="Closed">Fechado</option>
                        </Select>
                    </FormField>
                )}

                {(user?.role === "Agent" || user?.role === "Admin") && (
                    <FormField label="Prioridade">
                        <Select
                            value={formData.ticketPriority}
                            onChange={(e) => setFormData({ ...formData, ticketPriority: e.target.value })}>
                            <option value="Low">Baixa</option>
                            <option value="Medium">Média</option>
                            <option value="High">Alta</option>
                            <option value="Critical">Crítica</option>
                        </Select>
                    </FormField>
                )}

                {editing && (
                    <div className="border-t border-neutral-800 pt-4">
                        <h3 className="mb-3 text-sm font-semibold text-white">Comentários</h3>
                        <CommentList ticketId={ticket.id} refreshKey={commentRefreshKey} />
                    </div>
                )}

                {user?.role === "Agent" && formData.ticketStatus === "InProgress" && (
                    <div className="mt-4 border-t border-neutral-800 pt-4">
                        <FormField label="Solicitar informações">
                            <Textarea
                                value={requestContent}
                                onChange={(e) => setRequestContent(e.target.value)}
                                rows={3}
                                placeholder="Descreva quais informações são necessárias para continuar..."
                            />
                        </FormField>

                        <div className="mt-3 flex justify-end">
                            <Button
                                type="button"
                                variant="secondary"
                                disabled={requestingInformation || !requestContent.trim()}
                                onClick={handleRequestInformation}
                            >
                                {requestingInformation && <Spinner size="sm" />}
                                {requestingInformation ? "Enviando..." : "Solicitar informações"}
                            </Button>
                        </div>
                    </div>
                )}

                <div className="flex gap-3 pt-2">
                    <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
                        Cancelar
                    </Button>
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
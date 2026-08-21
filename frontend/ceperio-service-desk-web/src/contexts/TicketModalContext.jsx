import { createContext, useContext, useState } from "react";

const TicketModalContext = createContext(null);

export function TicketModalProvider({ children }) {
    const [showModal, setShowModal] = useState(false);
    const [editingTicket, setEditingTicket] = useState(null);

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

    return (
        <TicketModalContext.Provider
            value={{
                showModal,
                editingTicket,
                openCreateModal,
                openEditModal,
                closeModal,
            }}
        >
            {children}
        </TicketModalContext.Provider>
    );
}

export function useTicketModal() {
    const context = useContext(TicketModalContext);
    if (!context) {
        throw new Error("useTicketModal deve ser usado dentro de TicketModalProvider.");
    }
    return context;
}
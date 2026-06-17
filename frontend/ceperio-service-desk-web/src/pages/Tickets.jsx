import { useEffect, useState } from "react";
import api from "../services/api";
import cepelogo from "../assets/cepelogo.png";

function Tickets() {

    const [tickets, setTickets] = useState([]);

    async function getTickets() {
        const ticketsFromApi = await api.get("/tickets");

        setTickets(ticketsFromApi.data);
    }

    useEffect(() => {
        getTickets();
    }, []);

    const status = {
        0: "Aberto",
        1: "Em andamento",
        2: "Resolvido",
        3: "Fechado"
    };

    const priority = {
        0: "Baixa",
        1: "Média",
        2: "Alta",
        3: "Crítica"
    };

    const statusColor = {
        0: "bg-red-900 text-red-300",
        1: "bg-yellow-900 text-yellow-300",
        2: "bg-green-900 text-green-300",
        3: "bg-gray-700 text-gray-300",
    };

    const priorityColor = {
        0: "text-green-400",
        1: "text-blue-400",
        2: "text-orange-400",
        3: "text-red-400 font-bold",
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-200">
            <div className="max-w-4x1 mx-auto px-6 py-12">
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

                {/* tickets list */}
                <div className="space-y-3">
                    {tickets.map(ticket =>
                        <div
                            key={ticket.id}
                            className="bg-neutral-900 border-neutral-800 rounded-lg p-5 hover:border-neutral-700 transition-colors">

                            <div className="flex justify-between items-start mb-2">
                                <h2>{ticket.title}</h2>
                                <span className="text-neutral-500">
                                    #{ticket.id}
                                </span>
                            </div>

                            <p className="text-gray-400 text-sm mb-3">
                                {ticket.description}
                            </p>

                            <div className="flex gap-3 text-xs">
                                <span className={`px-2 py-1 rounded-full ${statusColor[ticket.ticketStatus] || "bg-gray-800 text-gray-300"}`}>
                                    Status: {status[ticket.ticketStatus]}
                                </span>

                                <span className={priorityColor[ticket.ticketPriority]}>
                                    <span className="text-white">Prioridade: </span>
                                    {priority[ticket.ticketPriority] || ticket.ticketPriority}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Tickets
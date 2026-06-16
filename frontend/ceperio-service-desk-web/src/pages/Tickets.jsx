import { useEffect, useState } from "react";
import api from "../services/api";

function Tickets() {

    const [tickets, setTickets] = useState([]);

    async function getTickets() {
        const ticketsFromApi = await api.get("/tickets");

        setTickets(ticketsFromApi.data);
    }

    useEffect(() => {
        getTickets();
    }, []);

    return (
        <div className="min-h-screen text-gray-200 bg-neutral-900 p-8">
            <h1>Tickets</h1>

            <div>
                {tickets.map(ticket =>
                    <div key={ticket.id}>
                        <br />
                        <h2>{ticket.title}</h2>
                        <p>{ticket.description}</p>
                        <span>
                            Status: {ticket.ticketStatus} | Prioridade: {ticket.ticketPriority}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Tickets
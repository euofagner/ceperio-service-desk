import api from "./api";

export async function getTickets({ search = "", status = null, page = 1, pageSize = 5 } = {}) {
    const params = { page, pageSize };
    if (search.trim()) params.search = search.trim();
    if (status !== null && status !== undefined) params.status = status;

    const response = await api.get("/tickets", { params });
    return response.data;
}

export async function getSummary() {
    const response = await api.get("/tickets/summary");
    return response.data;
}

export async function createTicket(formData) {
    const response = await api.post("/tickets", formData);
    return response.data;
}

export async function updateTicket(id, formData) {
    const response = await api.put(`/tickets/${id}`, formData);
    return response.data;
}

export async function deleteTicket(id) {
    await api.delete(`/tickets/${id}`);
}
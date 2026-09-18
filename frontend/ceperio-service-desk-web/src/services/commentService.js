import api from "./api";

export async function getComments(ticketId) {
    const response = await api.get(`/tickets/${ticketId}/comments`);
    return response.data;
}

export async function requestInformation(ticketId, content) {
    const response = await api.post(`/tickets/${ticketId}/request-information`, { content });
    return response.data;
}
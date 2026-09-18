import api from "./api";

export async function getComments(ticketId) {
    const response = await api.get(`/tickets/${ticketId}/comments`);
    return response.data;
}

export async function createComment(ticketId, content) {
    const response = await api.post(`/tickets/${ticketId}/comments`, { content });
    return response.data;
}

export async function requestInformation(ticketId, content) {
    const response = await api.post(`/tickets/${ticketId}/request-information`, { content });
    return response.data;
}

export async function respondToRequest(ticketId, content) {
    const response = await api.post(`/tickets/${ticketId}/respond-to-request`, { content });
    return response.data;
}


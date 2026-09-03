import api from "./api";

export async function getUsers() {
    const response = await api.get("/Users");
    return response.data;
}

export async function updateUserRole(id, role) {
    const response = await api.put(`/Users/${id}/role`, { role });
    return response.data;
}
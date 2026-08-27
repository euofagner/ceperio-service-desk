import api from "./api";

export async function login(credentials) {
    const response = await api.post("/Auth/login", credentials);
    return response.data;
}

export async function register(userData) {
    const response = await api.post("/Auth/register", userData);
    return response.data;
}
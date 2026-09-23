import api from "./api";

export async function getDashboard(days = 7) {
    const response = await api.get("/dashboard", { params: { days } });
    return response.data;
}
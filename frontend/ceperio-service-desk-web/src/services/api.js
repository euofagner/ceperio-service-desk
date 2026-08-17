import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:7290/api"
});

api.interceptors.response.use(
    response => response,

    error => {
        if (!error.response) {
            error.userMessage = "Não foi possível conectar ao servidor.";
            error.errorType = "network";
            return Promise.reject(error);
        }

        const { status, data } = error.response;

        switch (status) {
            case 400:
                error.userMessage = data?.title || data || "Requisição inválida.";
                error.errorType = "bad_request";
                break;
            case 401:
                error.userMessage = "Sua sessão expirou ou você não está autenticado.";
                error.errorType = "unauthorized";
                break;
            case 403:
                error.userMessage = "Você não tem permissão para realizar esta ação.";
                error.errorType = "forbidden";
                break;
            case 404:
                error.userMessage = data?.title || data || "Recurso não encontrado.";
                error.errorType = "not_found";
                break;
            case 409:
                error.userMessage = data?.title || data || "Conflito ao processar a operação.";
                error.errorType = "conflict";
                break;
            case 500:
                error.userMessage = "Ocorreu um erro interno no servidor.";
                error.errorType = "server";
                break;
            default:
                error.userMessage = "Ocorreu um erro ao processar a requisição.";
                error.errorType = "http";
        }

        return Promise.reject(error);
    }
);

export default api;
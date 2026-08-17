export function getHttpErrorMessage(error, fallback = "Ocorreu um erro.") {
    if (!error) return fallback;

    if (error.userMessage) return error.userMessage;

    if (!error.response) return "Não foi possível conectar ao servidor.";

    const { data } = error.response;

    return data?.detail || data?.title || fallback;
}
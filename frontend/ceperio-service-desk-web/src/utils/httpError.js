export function getHttpErrorMessage(error, fallback = "Ocorreu um erro.") {
    if (!error) return fallback;
    if (error.userMessage) return error.userMessage;
    if (!error.response) return "Não foi possível conectar ao servidor.";
    return fallback;
}
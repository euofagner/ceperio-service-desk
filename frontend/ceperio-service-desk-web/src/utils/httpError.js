export function getHttpErrorMessage(error, fallback = "Ocorreu um erro.") {
    if (!error) return fallback;
    if (error.userMessage) return error.userMessage;
    if (!error.response) return "Não foi possível conectar ao servidor.";

    const { data } = error.response;

    if (data?.errors) {
        const messages = Object.values(data.errors).flat().filter(Boolean);
        if (messages.length > 0) return messages.join(" ");
    }

    return data?.detail || data?.title || fallback;
}

export function getValidationErrors(error) {
    if (!error?.response?.data?.errors) return {};
    return error.response.data.errors;
}
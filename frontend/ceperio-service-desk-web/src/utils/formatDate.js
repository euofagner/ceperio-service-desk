export function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diff === 0) return "Hoje";
    if (diff === 1) return "Ontem";
    return `há ${diff} dias`;
}
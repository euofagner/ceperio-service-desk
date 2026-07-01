export function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();

    const diffMinutes = Math.floor((now - date) / (1000 * 60)); 

    if (diffMinutes < 1) return "Agora";

    if (diffMinutes < 60) return `${diffMinutes} min atrás`;

    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours < 24) return `${diffHours} h atrás`

    const diffDays = Math.floor(diffHours / 24);

    if (diffDays === 1) return "Ontem";

    return `há ${diffDays} dias`;
}
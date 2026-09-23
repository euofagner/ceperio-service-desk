import { useCallback, useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardService";

export function useDashboard(days = 7) {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadDashboard = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getDashboard(days);
            setDashboard(data);
        } catch (error) {
            console.error("Erro ao carregar dashboard:", error);
            setError(error);
        } finally {
            setLoading(false);
        }
    }, [days]);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    return { dashboard, loading, error, refresh: loadDashboard };
}
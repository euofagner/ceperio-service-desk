import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

export function useTickets() {
    const [tickets, setTickets] = useState([]);
    const [summary, setSummary] = useState({
        total: 0,
        open: 0,
        inProgress: 0,
        resolved: 0,
        closed: 0
    });
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const pageSize = 5;

    const getTickets = useCallback(async (search = "") => {
        const params = { page, pageSize };
        if (search) params.search = search;

        const response = await api.get("/tickets", { params });
        setTickets(response.data.items);
        setTotalPages(response.data.totalPages);
        setHasNextPage(response.data.hasNextPage);
        setHasPreviousPage(response.data.hasPreviousPage);
    }, [page]);

    const getSummary = useCallback(async () => {
        const response = await api.get("/tickets/summary");
        setSummary(response.data);
    }, []);

    const fetchAll = useCallback(async (search = "") => {
        setLoading(true);
        try {
            await Promise.all([getTickets(search), getSummary()]);
        } finally {
            setLoading(false);
        }
    }, [getTickets, getSummary]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    return {
        tickets,
        setTickets,
        summary,
        loading,
        refresh: fetchAll,
        page,
        setPage,
        totalPages,
        hasNextPage,
        hasPreviousPage
    };
}
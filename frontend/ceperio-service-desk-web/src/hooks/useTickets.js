import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

export function useTickets(search = "", status = null) {
    const [tickets, setTickets] = useState([]);
    const [summary, setSummary] = useState({
        total: 0, open: 0, inProgress: 0, resolved: 0, closed: 0
    });
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const pageSize = 5;

    const getTickets = useCallback(async () => {
        const params = { page, pageSize };
        if (search.trim()) params.search = search.trim();
        if (status !== null && status !== undefined) params.status = status;

        const response = await api.get("/tickets", { params });
        setTickets(response.data.items);
        setTotalPages(response.data.totalPages);
        setHasNextPage(response.data.hasNextPage);
        setHasPreviousPage(response.data.hasPreviousPage);
    }, [search, status, page]);

    const getSummary = useCallback(async () => {
        const response = await api.get("/tickets/summary");
        setSummary(response.data);
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            await Promise.all([getTickets(), getSummary()]);
        } finally {
            setLoading(false);
        }
    }, [getTickets, getSummary]);

    useEffect(() => {
        setPage(1);
    }, [search, status]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        tickets,
        summary,
        loading,
        page,
        setPage,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        refresh: fetchData
    };
}
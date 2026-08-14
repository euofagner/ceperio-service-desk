import { useState, useEffect, useCallback, useRef } from "react";
import api from "../services/api";

export function useTickets() {
    const [tickets, setTickets] = useState([]);
    const [summary, setSummary] = useState({
        total: 0, open: 0, inProgress: 0, resolved: 0, closed: 0
    });
    const [loading, setLoading] = useState(true);
    const [initialLoad, setInitialLoad] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const pageSize = 5;

    const currentSearch = useRef("");
    const currentStatus = useRef(null);

    const getTickets = useCallback(async (search = "", status = null) => {
        const params = { page, pageSize };
        if (search) params.search = search;
        if (status !== null && status !== undefined) params.status = status;

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

    const fetchAll = useCallback(async (search = "", showLoader = false, status = null) => {
        if (showLoader) setLoading(true);
        currentSearch.current = search;
        currentStatus.current = status;
        try {
            await Promise.all([getTickets(search, status), getSummary()]);
        } finally {
            if (showLoader) setLoading(false);
        }
    }, [getTickets, getSummary]);

    useEffect(() => {
        if (initialLoad) {
            fetchAll("", true);
            setInitialLoad(false);
        }
    }, [initialLoad, fetchAll]);

    useEffect(() => {
        if (!initialLoad) {
            fetchAll(currentSearch.current, false, currentStatus.current);
        }
    }, [page]);

    return {
        tickets,
        summary,
        loading,
        refresh: (search = "", status = null) => fetchAll(search, false, status),
        page,
        setPage,
        totalPages,
        hasNextPage,
        hasPreviousPage,
    };
}
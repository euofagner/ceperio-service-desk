import { useState, useEffect, useCallback, useRef } from "react";
import { getTickets, getSummary } from "../services/ticketService";

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
    const firstLoad = useRef(true);

    const fetchTickets = useCallback(async () => {
        const data = await getTickets({ search, status, page, pageSize });
        setTickets(data.items);
        setTotalPages(data.totalPages);
        setHasNextPage(data.hasNextPage);
        setHasPreviousPage(data.hasPreviousPage);
    }, [search, status, page]);

    const fetchSummary = useCallback(async () => {
        const data = await getSummary();
        setSummary(data);
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            await Promise.all([fetchTickets(), fetchSummary()]);
        } finally {
            setLoading(false);
        }
    }, [fetchTickets, fetchSummary]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }
        setPage(1);
    }, [search, status]);

    return {
        tickets,
        summary,
        loading,
        page,
        setPage,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        refresh: fetchData,
    };
}
import { useState, useEffect, useCallback } from "react";
import { getTickets, getSummary } from "../services/ticketService";

export function useTickets(search = "", status = null) {
    const [tickets, setTickets] = useState([]);
    const [summary, setSummary] = useState({
        total: 0, open: 0, inProgress: 0, resolved: 0, closed: 0
    });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const pageSize = 5;

    useEffect(() => {
        setPage(1);
    }, [search, status]);

    useEffect(() => {
        let cancelled = false;

        async function loadTickets() {
            setLoading(true);
            try {
                const data = await getTickets({ search, status, page, pageSize });
                if (cancelled) return;
                setTickets(data.items);
                setTotalCount(data.totalCount);
                setTotalPages(data.totalPages);
                setHasNextPage(data.hasNextPage);
                setHasPreviousPage(data.hasPreviousPage);
            } catch (error) {
                if (!cancelled) console.error("Erro ao carregar tickets:", error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadTickets();
        return () => { cancelled = true; };
    }, [search, status, page]);

    useEffect(() => {
        async function loadSummary() {
            try {
                const data = await getSummary();
                setSummary(data);
            } catch (error) {
                console.error("Erro ao carregar resumo:", error);
            }
        }
        loadSummary();
    }, []);

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            const [ticketsData, summaryData] = await Promise.all([
                getTickets({ search, status, page, pageSize }),
                getSummary()
            ]);
            setTickets(ticketsData.items);
            setTotalCount(ticketsData.totalCount);
            setTotalPages(ticketsData.totalPages);
            setHasNextPage(ticketsData.hasNextPage);
            setHasPreviousPage(ticketsData.hasPreviousPage);
            setSummary(summaryData);
        } finally {
            setLoading(false);
        }
    }, [search, status, page]);

    return {
        tickets,
        summary,
        loading,
        page,
        setPage,
        totalCount,
        pageSize,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        refresh,
    };
}
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

    const fetchData = useCallback(async (targetPage = page) => {
        setLoading(true);
        try {
            const [ticketsData, summaryData] = await Promise.all([
                getTickets({ search, status, page: targetPage, pageSize }),
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
    }, [search, status, page, pageSize]);

    useEffect(() => {
        setPage(1);
        fetchData(1);
    }, [search, status]);

    useEffect(() => {
        fetchData(page);
    }, [page]);

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
        refresh: () => fetchData(page),
    };
}
function TicketPagination({
    ticketsCount,
    summary,
    page,
    totalPages,
    hasPreviousPage,
    hasNextPage,
    onPageChange,
}) {
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        <>
            <div className="mt-4 font-bold text-neutral-500 text-xs">
                {ticketsCount > 0 ? (
                    <>Mostrando {(page - 1) * 5 + 1} a {Math.min(page * 5, summary.total)} de {summary.total} tickets</>
                ) : (
                    <>Nenhum ticket encontrado</>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-800">
                    <span className="text-neutral-500 text-xs">
                        Página {page} de {totalPages}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onPageChange(page - 1)}
                            disabled={!hasPreviousPage}
                            className="px-3 py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white hover:border-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            ← Anterior
                        </button>
                        {pages.map((p) => (
                            <button
                                key={p}
                                onClick={() => onPageChange(p)}
                                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${p === page
                                        ? "bg-white text-black"
                                        : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            onClick={() => onPageChange(page + 1)}
                            disabled={!hasNextPage}
                            className="px-3 py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white hover:border-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            Próximo →
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default TicketPagination;
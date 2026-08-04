import Button from "../ui/Button";

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
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onPageChange(page - 1)}
                            disabled={!hasPreviousPage}
                        >
                            ← Anterior
                        </Button>
                        {pages.map((p) => (
                            <Button
                                key={p}
                                variant="secondary"
                                size="sm"
                                className={p === page ? "bg-white text-black hover:bg-neutral-200" : ""}
                                onClick={() => onPageChange(p)}
                            >
                                {p}
                            </Button>
                        ))}
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onPageChange(page + 1)}
                            disabled={!hasNextPage}
                        >
                            Próximo →
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}

export default TicketPagination;
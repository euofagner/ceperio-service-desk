import Button from "../ui/Button";
import { getPaginationPages } from "../../utils/pagination";

function TicketPagination({
    ticketsCount,
    totalCount,
    page,
    pageSize,
    totalPages,
    hasPreviousPage,
    hasNextPage,
    onPageChange,
}) {
    const pages = getPaginationPages(page, totalPages);
    const firstItem = ticketsCount > 0 ? (page - 1) * pageSize + 1 : 0;
    const lastItem = Math.min(page * pageSize, totalCount);

    return (
        <>
            <div className="mt-4 font-bold text-neutral-500 text-xs">
                {ticketsCount > 0 ? (
                    <>Mostrando {firstItem} a {lastItem} de {totalCount} tickets</>
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
                        <Button variant="secondary" size="sm" onClick={() => onPageChange(page - 1)} disabled={!hasPreviousPage}>
                            ← Anterior
                        </Button>
                        {pages.map((p, index) => {
                            if (p === "...") {
                                return (
                                    <span key={`ellipsis-${index}`} className="flex items-center justify-center px-2 text-neutral-500 text-sm">
                                        ...
                                    </span>
                                );
                            }
                            return (
                                <Button
                                    key={p}
                                    variant="secondary"
                                    size="sm"
                                    className={p === page ? "bg-white text-black hover:bg-neutral-200" : ""}
                                    onClick={() => onPageChange(p)}
                                >
                                    {p}
                                </Button>
                            );
                        })}
                        <Button variant="secondary" size="sm" onClick={() => onPageChange(page + 1)} disabled={!hasNextPage}>
                            Próximo →
                        </Button>
                    </div>
                </div>
    )}
        </>
    );
}

export default TicketPagination;
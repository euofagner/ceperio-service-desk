import Button from "./ui/Button";

function DeleteConfirm({ ticketId, onCancel, onConfirm, deleting }) {
    return (
        <div className="px-5 py-3 bg-neutral-800/50 border-t border-neutral-800 flex items-center justify-between">
            <span className="text-sm text-neutral-400">
                Excluir ticket #{ticketId}?
            </span>
            <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button variant="danger" size="sm" onClick={() => onConfirm(ticketId)} disabled={deleting}>
                    {deleting ? "Excluindo..." : "Excluir"}
                </Button>
            </div>
        </div>
    );
}

export default DeleteConfirm;
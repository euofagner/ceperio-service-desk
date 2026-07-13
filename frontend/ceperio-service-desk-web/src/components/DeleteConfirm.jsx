function DeleteConfirm({ ticketId, onCancel, onConfirm, deleting }) {
    return (
        <div className="px-5 py-3 bg-neutral-800/50 border-t border-neutral-800 flex items-center justify-between">
            <span className="text-sm text-neutral-400">
                Excluir ticket #{ticketId}?
            </span>
            <div className="flex gap-2">
                <button
                    onClick={(e) => { e.stopPropagation(); onCancel(); }}
                    className="px-3 py-1 text-xs text-neutral-400 hover:text-white transition-colors"
                >
                    Cancelar
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onConfirm(ticketId); }}
                    disabled={deleting}
                    className="px-3 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors disabled:opacity-50"
                >
                    {deleting ? "Excluindo..." : "Excluir"}
                </button>
            </div>
        </div>
    );
}

export default DeleteConfirm;
function Toast({ toast, onClose, onMouseEnter, onMouseLeave }) {
    if (!toast) return null;

    return (
        <div
            className="fixed top-4 right-4 z-50 animate-slide-in"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm shadow-lg ${
                toast.type === 'success'
                    ? 'bg-green-950 border-green-800 text-green-300'
                    : 'bg-red-950 border-red-800 text-red-300'
            }`}>
                {toast.type === 'success' ? (
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}
                <span>{toast.message}</span>
                <button onClick={onClose} className="ml-4 text-neutral-500 hover:text-white">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default Toast;
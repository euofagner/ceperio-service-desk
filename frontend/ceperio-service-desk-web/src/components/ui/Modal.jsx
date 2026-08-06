function Modal({ children, onClose, maxWidth = "max-w-lg" }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose} />
            <div
                className={`relative w-full ${maxWidth} mx-4 rounded-xl border border-neutral-800 bg-neutral-900 p-6`}
                onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}

export default Modal;
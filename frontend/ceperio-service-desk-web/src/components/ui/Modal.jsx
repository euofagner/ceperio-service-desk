import { useEffect } from "react";

function Modal({ children, onClose, maxWidth = "max-w-lg" }) {
    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div
                className={`
                    relative w-full ${maxWidth}
                    max-h-[calc(100vh-2rem)]
                    overflow-y-auto
                    overscroll-contain
                    rounded-xl border border-neutral-800 bg-neutral-900 p-6
                `}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}

export default Modal;
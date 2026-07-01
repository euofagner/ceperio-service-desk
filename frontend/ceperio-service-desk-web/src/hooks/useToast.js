import { useRef, useState } from "react";

export function useToast() {
    const [toast, setToast] = useState(null);
    const toastTimer = useRef(null);

    function showToast(message, type = "success") {
        pauseToast();

        setToast({ message, type });

        resumeToast();
    }

    function pauseToast() {
        if (toastTimer.current) clearTimeout(toastTimer.current);
    }

    function resumeToast() {
        toastTimer.current = setTimeout(() => setToast(null), 3000);
    }

    return {
        toast,
        setToast,
        showToast,
        pauseToast,
        resumeToast
    };
}
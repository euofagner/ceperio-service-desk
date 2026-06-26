import { useState } from "react";

export function useToast() {
    const [toast, setToast] = useState(null);
    const [toastTimer, setToastTimer] = useState(null);

    function showToast(message, type = 'success') {
        pauseToast();

        setToast({ message, type });

        resumeToast();
    }

    function pauseToast() {
        if (toastTimer) clearTimeout(toastTimer);
    }

    function resumeToast() {
        const timer = setTimeout(() => setToast(null), 3000);
        setToastTimer(timer);
    }

    return {
        toast,
        setToast,
        showToast,
        pauseToast,
        resumeToast
    };
}
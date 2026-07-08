import { useState } from "react";

export default function TicketDate({ children, content }) {
    const [visible, setVisible] = useState(false);
    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}>
            {children}
            {visible && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs rounded-lg shadow-lg whitespace-nowrap z-50">
                    {content}

                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-800 border border-neutral-700 border-t-0 border-l-0 rotate-45 -mt-1" />
                </div>
            )}
        </div>
    );
}
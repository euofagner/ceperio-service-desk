function Card({ children, className = "", ...props }) {
    return (
        <div
            className={`rounded-lg border border-neutral-800 bg-neutral-900 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

export default Card;
function Badge({ children, className = "", icon: Icon }) {
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${className}`}>
            {Icon && <Icon className="w-3 h-3" />}
            {children}
        </span>
    );
}

export default Badge;
function Select({ className = "", children, ...props }) {
    const base =
        "w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-500";

    return (
        <select className={`${base} ${className}`} {...props}>
            {children}
        </select>
    );
}

export default Select;
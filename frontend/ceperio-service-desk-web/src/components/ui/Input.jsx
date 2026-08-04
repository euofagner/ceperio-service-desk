function Input({ className = "", ...props }) {
    const base =
        "w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500";

    return (
        <input
            className={`${base} ${className}`}
            {...props}
        />
    );
}

export default Input;
function Button({ children, variant = "primary", size = "md", className = "", ...props }) {
    const base = "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

    const variants = {
        primary: "bg-white text-black hover:bg-neutral-200",
        secondary: "bg-neutral-800 text-neutral-300 hover:bg-neutral-700",
        danger: "bg-red-500/20 text-red-400 hover:bg-red-500/30",
        ghost: "text-neutral-400 hover:text-white hover:bg-neutral-800",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
    };

    return (
        <button
            className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}>
                
            {children}
        </button>
    );
}

export default Button;
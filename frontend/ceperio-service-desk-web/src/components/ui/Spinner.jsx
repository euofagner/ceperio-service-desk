function Spinner({ size = "md" }) {
    const sizes = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-8 h-8",
    };

    return (
        <span
            className={`inline-block rounded-full border-2 border-neutral-600 border-t-white animate-spin ${sizes[size] ?? sizes.md}`}
            aria-label="Carregando" />
    );
}

export default Spinner;
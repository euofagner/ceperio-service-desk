function FormField({ label, children }) {
    return (
        <div>
            <label className="block text-sm text-neutral-400 mb-1">
                {label}
            </label>
            {children}
        </div>
    );
}

export default FormField;
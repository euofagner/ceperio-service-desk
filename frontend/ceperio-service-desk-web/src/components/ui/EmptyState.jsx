function EmptyState({ icon, title, description, action }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
            {icon && <span className="text-4xl">{icon}</span>}
            <h3 className="text-white text-lg mt-4">{title}</h3>
            {description && <p className="text-neutral-500 mt-2">{description}</p>}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}

export default EmptyState;
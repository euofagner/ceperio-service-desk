function TicketToolbar({ search, filter, onSearchChange, onFilterChange }) {
    return (
        <>
            {/* Search input */}
            <div className="mb-5">
                <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Buscar por título ou descrição..."
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-700"
                    />
                    {search && (
                        <button
                            onClick={() => onSearchChange("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Filter */}
            <div className="flex items-center justify-end mb-5 gap-3">
                <select
                    value={filter}
                    onChange={(e) => onFilterChange(e.target.value)}
                    className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-300 focus:outline-none focus:border-neutral-700"
                >
                    <option value="all">Todos os status</option>
                    <option value="0">Aberto</option>
                    <option value="1">Em andamento</option>
                    <option value="2">Resolvido</option>
                    <option value="3">Fechado</option>
                </select>
            </div>
        </>
    );
}

export default TicketToolbar;
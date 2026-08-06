import { Button, Input, Select } from "../ui";

function TicketToolbar({ search, filter, onSearchChange, onFilterChange }) {
    return (
        <>
            <div className="mb-5">
                <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <Input
                        type="text"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Buscar por título ou descrição..."
                        className="pl-10 pr-10 bg-neutral-900" />
                    {search && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            onClick={() => onSearchChange("")}>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </Button>
                    )}
                </div>
            </div>

            {/* Filter */}
            <div className="flex items-center justify-end mb-5 gap-3">
                <Select
                    value={filter}
                    onChange={(e) => onFilterChange(e.target.value)}
                    fullWidth={false}
                    className="ml-auto bg-neutral-900 border-neutral-800 text-neutral-300">
                    <option value="all">Todos os status</option>
                    <option value="0">Aberto</option>
                    <option value="1">Em andamento</option>
                    <option value="2">Resolvido</option>
                    <option value="3">Fechado</option>
                </Select>
            </div>
        </>
    );
}

export default TicketToolbar;
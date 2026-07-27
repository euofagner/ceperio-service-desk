function TicketHeader({ onCreateTicket }) {
    return (
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-xl font-semibold text-white">
                    Olá, {userName} 👋
                </h1>
                <p className="text-sm text-neutral-500 mt-1">
                    Bem-vindo ao Ceperio Service Desk
                </p>
            </div>
            <div className="flex items-center gap-3">
                <button className="relative p-2 text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-neutral-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button
                    onClick={onCreateTicket}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors">
                    <span className="text-lg leading-none">+</span> Novo Ticket
                </button>
            </div>
        </div>
    );
}

export default TicketHeader;
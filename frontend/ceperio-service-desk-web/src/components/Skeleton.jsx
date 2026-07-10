function Skeleton({ logo }) {
    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
            <div className="w-full max-w-md">
                <div className="flex items-center gap-4 mb-8">
                    <img
                        src={logo}
                        alt="Logo"
                        className="h-12" />
                    <div>
                        <h1 className="text-white font-semibold">
                            Ceperio Service Desk
                        </h1>
                        <p className="text-neutral-500 text-sm">
                            Sincronizando chamados...
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    {[...Array(4)].map((_, index) => (
                        <div
                            key={index}
                            className="bg-neutral-900 rounded-lg p-5">
                            <div className="flex gap-4">
                                <div className="w-2 h-2 rounded-full bg-neutral-700 mt-2 animate-pulse" />
                                <div className="flex-1">
                                    <div className="h-4 w-3/5 bg-neutral-800 rounded animate-pulse mb-3" />
                                    <div className="h-3 w-full bg-neutral-800 rounded animate-pulse mb-2" />
                                    <div className="h-3 w-2/3 bg-neutral-800 rounded animate-pulse mb-3" />
                                    <div className="flex gap-2">
                                        <div className="h-5 w-20 bg-neutral-800 rounded-full animate-pulse" />
                                        <div className="h-5 w-16 bg-neutral-800 rounded-full animate-pulse" />
                                    </div>
                                </div>
                                <div className="h-3 w-16 bg-neutral-800 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Skeleton;
import { LogOut, Palette, User } from "lucide-react";

import { useAuth } from "../contexts/AuthContext";

function SettingsPage() {
    const { user, logout } = useAuth();

    return (
        <div className="mx-auto max-w-4xl">
            <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                    Sistema
                </p>

                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                    Configurações
                </h1>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                    Personalize sua experiência e gerencie as configurações da
                    sua conta.
                </p>
            </div>

            <div className="space-y-6">
                <section className="overflow-hidden rounded-xl border border-white/6 bg-white/[0.02]">
                    <div className="flex items-start gap-4 border-b border-white/6 px-5 py-5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/8 bg-white/[0.035] text-zinc-400">
                            <Palette size={18} strokeWidth={1.7} />
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-white">
                                Aparência
                            </h2>

                            <p className="mt-1 text-xs leading-5 text-zinc-500">
                                Personalize a aparência do Service Desk.
                            </p>
                        </div>
                    </div>

                    <div className="px-5 py-5">
                        <div className="flex items-center justify-between gap-6">
                            <div>
                                <p className="text-sm font-medium text-zinc-300">
                                    Tema
                                </p>

                                <p className="mt-1 text-xs text-zinc-600">
                                    Escolha como o sistema deve ser exibido.
                                </p>
                            </div>

                            <span className="rounded-md border border-white/6 bg-white/[0.025] px-3 py-1.5 text-xs text-zinc-500">
                                Em breve
                            </span>
                        </div>
                    </div>
                </section>

                <section className="overflow-hidden rounded-xl border border-white/6 bg-white/[0.02]">
                    <div className="flex items-start gap-4 border-b border-white/6 px-5 py-5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/8 bg-white/[0.035] text-zinc-400">
                            <User size={18} strokeWidth={1.7} />
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-white">
                                Conta
                            </h2>

                            <p className="mt-1 text-xs leading-5 text-zinc-500">
                                Informações da conta atualmente conectada.
                            </p>
                        </div>
                    </div>

                    <div className="divide-y divide-white/6">
                        <div className="flex items-center justify-between gap-6 px-5 py-4">
                            <div>
                                <p className="text-xs text-zinc-500">
                                    Nome
                                </p>

                                <p className="mt-1 text-sm text-zinc-200">
                                    {user?.name || "—"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-6 px-5 py-4">
                            <div>
                                <p className="text-xs text-zinc-500">
                                    Email
                                </p>

                                <p className="mt-1 text-sm text-zinc-200">
                                    {user?.email || "—"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-6 px-5 py-4">
                            <div>
                                <p className="text-xs text-zinc-500">
                                    Perfil
                                </p>

                                <p className="mt-1 text-sm text-zinc-200">
                                    {user?.role || "—"}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="overflow-hidden rounded-xl border border-red-500/10 bg-red-500/[0.015]">
                    <div className="flex items-start gap-4 px-5 py-5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-500/10 bg-red-500/[0.04] text-red-400">
                            <LogOut size={18} strokeWidth={1.7} />
                        </div>

                        <div className="flex flex-1 items-center justify-between gap-6">
                            <div>
                                <h2 className="text-sm font-semibold text-zinc-200">
                                    Sessão
                                </h2>

                                <p className="mt-1 text-xs leading-5 text-zinc-500">
                                    Encerre sua sessão neste dispositivo.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={logout}
                                className="shrink-0 rounded-lg border border-red-500/15 bg-red-500/[0.04] px-3.5 py-2 text-xs font-medium text-red-400 transition-colors hover:border-red-500/25 hover:bg-red-500/[0.08] hover:text-red-300"
                            >
                                Sair
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default SettingsPage;
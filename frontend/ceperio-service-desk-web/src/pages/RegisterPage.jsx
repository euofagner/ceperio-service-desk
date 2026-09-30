import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CircleAlert, LoaderCircle } from "lucide-react";

import { register } from "../services/authService";
import cepelogo from "../assets/cepelogo.png";

function RegisterPage() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        setMessage("");

        if (password !== confirmPassword) {
            setMessage("As senhas não coincidem.");
            return;
        }

        setLoading(true);

        try {
            await register({
                name,
                email,
                password,
            });

            navigate("/login", {
                replace: true,
                state: {
                    message:
                        "Conta criada com sucesso. Faça login para continuar.",
                },
            });
        } catch (error) {
            if (error.response?.status === 409) {
                setMessage("Este email já está cadastrado.");
            } else {
                setMessage(
                    "Não foi possível criar sua conta. Tente novamente."
                );
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#09090b] text-zinc-100">
            <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_480px]">
                <section
                    aria-hidden="true"
                    className="relative hidden overflow-hidden border-r border-white/6 bg-[#0c0c0f] lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
                    <div className="relative z-10">
                        <div className="flex items-center">
                            <img
                                src={cepelogo}
                                alt="CepeRio"
                                className="h-14 w-auto object-contain"
                            />

                            <span className="text-sm font-semibold tracking-wider text-white">
                                CepeRio
                            </span>
                        </div>
                    </div>

                    <div className="relative z-10 max-w-lg">
                        <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/8 bg-white/2.5 px-3.5 py-2">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />

                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                            </span>

                            <span className="text-[11px] font-medium tracking-wide text-zinc-400">
                                Cepe Rio Service Desk
                            </span>
                        </div>

                        <h2 className="max-w-xl text-[42px] font-semibold leading-[1.08] tracking-[-0.045em] text-white xl:text-[52px]">
                            Seu suporte no Clube,
                            <br />

                            <span className="text-zinc-500">
                                mais simples.
                            </span>
                        </h2>

                        <p className="mt-7 max-w-lg text-[16px] leading-7 text-zinc-500">
                            Abra solicitações, acompanhe o andamento dos seus chamados e fale com o time de suporte
                            em um único ambiente.
                        </p>

                        <div className="mt-10 flex items-center gap-7">
                            <div>
                                <p className="text-[16px] font-medium text-zinc-300">
                                    Chamados organizados
                                </p>

                                <p className="mt-1 text-[14px] text-nowrap text-zinc-500">
                                    Cada solicitação com histórico completo
                                </p>
                            </div>

                            <div
                                className="h-10 w-px shrink-0 bg-white/10"
                                aria-hidden="true"
                            />

                            <div>
                                <p className="text-[16px] font-medium text-zinc-300">
                                    Registro de atendimentos
                                </p>

                                <p className="mt-1 text-[14px] text-nowrap text-zinc-500">
                                    Acompanhe o status dos seus chamados
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between text-[15px] text-zinc-500">
                        <span>
                            © {new Date().getFullYear()} CepeRio
                        </span>

                        <span>
                            Desenvolvido por Fagner da Silva - Estagiário do
                            Clube dos Empregados da Petrobras
                        </span>
                    </div>

                    <div
                        className="pointer-events-none absolute inset-0 opacity-[0.035]"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
                            backgroundSize: "48px 48px",
                            maskImage:
                                "linear-gradient(to bottom, black, transparent 85%)",
                        }}
                    />

                    <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-blue-500/[0.07] blur-3xl" />
                </section>

                <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:min-h-0 lg:px-10">
                    <div className="w-full max-w-95">
                        <div className="mb-10 flex items-center lg:hidden">
                            <img
                                src={cepelogo}
                                alt="CepeRio"
                                className="h-9 w-auto object-contain"
                            />
                        </div>

                        <div className="mb-8">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                                Nova conta
                            </p>

                            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-[28px]">
                                Criar sua conta
                            </h1>

                            <p className="mt-2 text-sm leading-6 text-zinc-500">
                                Preencha seus dados para começar a usar o
                                CepeRio Service Desk.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-5">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="mb-2 block text-xs font-medium text-zinc-300">
                                        Nome
                                    </label>

                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        autoComplete="name"
                                        required
                                        placeholder="Seu nome completo"
                                        className="h-11 w-full rounded-lg border border-white/9 bg-white/[0.035] px-3.5 text-sm text-white outline-none transition duration-150 placeholder:text-zinc-600 hover:border-white/[0.14] focus:border-white/25 focus:bg-white/4.5 focus:ring-4 focus:ring-white/4"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-xs font-medium text-zinc-300">
                                        Email
                                    </label>

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        autoComplete="email"
                                        required
                                        placeholder="voce@empresa.com"
                                        className="h-11 w-full rounded-lg border border-white/9 bg-white/[0.035] px-3.5 text-sm text-white outline-none transition duration-150 placeholder:text-zinc-600 hover:border-white/[0.14] focus:border-white/25 focus:bg-white/4.5 focus:ring-4 focus:ring-white/4"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="mb-2 block text-xs font-medium text-zinc-300">
                                        Senha
                                    </label>

                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        autoComplete="new-password"
                                        required
                                        minLength={6}
                                        placeholder="Mínimo de 6 caracteres"
                                        aria-describedby="password-hint"
                                        className="h-11 w-full rounded-lg border border-white/9 bg-white/[0.035] px-3.5 text-sm text-white outline-none transition duration-150 placeholder:text-zinc-600 
                                        hover:border-white/[0.14] focus:border-white/25 focus:bg-white/4.5 focus:ring-4 
                                        focus:ring-white/4"
                                    />

                                    <p
                                        id="password-hint"
                                        className="mt-2 text-[11px] text-zinc-600">
                                        Use pelo menos 6 caracteres.
                                    </p>
                                </div>

                                <div>
                                    <label
                                        htmlFor="confirmPassword"
                                        className="mb-2 block text-xs font-medium text-zinc-300">
                                        Confirmar senha
                                    </label>

                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        autoComplete="new-password"
                                        required
                                        minLength={6}
                                        placeholder="Digite a senha novamente"
                                        className="h-11 w-full rounded-lg border border-white/9 bg-white/[0.035] px-3.5 text-sm text-white outline-none transition duration-150 placeholder:text-zinc-600 
                                        hover:border-white/[0.14] focus:border-white/25 focus:bg-white/4.5 focus:ring-4 
                                        focus:ring-white/4"
                                    />
                                </div>
                            </div>

                            {message && (
                                <div
                                    role="alert"
                                    className="mt-5 flex items-start gap-2.5 rounded-lg border border-red-500/15 
                                    bg-red-500/6 px-3.5 py-3">
                                    <CircleAlert
                                        aria-hidden="true"
                                        size={16}
                                        strokeWidth={1.8}
                                        className="mt-0.5 shrink-0 text-red-400"
                                    />

                                    <p className="text-xs leading-5 text-red-300">
                                        {message}
                                    </p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="group mt-7 flex h-11 w-full items-center justify-center gap-2 rounded-lg 
                                bg-white px-4 text-sm font-semibold text-zinc-950 outline-none transition duration-150 
                                hover:bg-zinc-200 focus:ring-4 focus:ring-white/12 disabled:cursor-not-allowed 
                                disabled:opacity-50">
                                {loading ? (
                                    <>
                                        <LoaderCircle
                                            aria-hidden="true"
                                            size={16}
                                            strokeWidth={2}
                                            className="animate-spin"
                                        />

                                        <span>Criando conta...</span>
                                    </>
                                ) : (
                                    <span>Criar conta</span>
                                )}
                            </button>
                        </form>

                        <div className="my-7 flex items-center gap-3">
                            <div className="h-px flex-1 bg-white/6" />

                            <span className="text-[10px] uppercase tracking-[0.12em] text-zinc-700">
                                ou
                            </span>

                            <div className="h-px flex-1 bg-white/6" />
                        </div>

                        <p className="text-center text-[13px] text-zinc-500">
                            Já possui uma conta?{" "}
                            <Link
                                to="/login"
                                className="font-medium text-zinc-200 underline decoration-white/20 underline-offset-4 
                                transition-colors hover:text-white hover:decoration-white/50 focus:outline-none 
                                focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-[#09090b]">
                                Entrar
                            </Link>
                        </p>

                        <p className="mt-8 text-center text-[13px] leading-5 text-zinc-400">
                            Ao criar sua conta, você poderá abrir e acompanhar seus chamados
                            pelo CepeRio Service Desk.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default RegisterPage;

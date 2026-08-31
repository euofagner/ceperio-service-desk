import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function LoginPage() {
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        if (!email || !password) return;

        setLoading(true);
        setMessage("");

        try {
            const data = await login({ email, password });
            setMessage(`Login OK: ${data.name} (${data.role})`);
        } catch (error) {
            setMessage("Erro ao entrar. Verifique suas credenciais.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
            <form onSubmit={handleSubmit} className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
                <h1 className="text-white text-lg font-semibold">Entrar</h1>

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                    required
                />

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Senha"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white text-black font-medium rounded-lg py-2 text-sm hover:bg-neutral-200 disabled:opacity-50"
                >
                    {loading ? "Entrando..." : "Entrar"}
                </button>

                {message && (
                    <p className="text-xs text-neutral-400">{message}</p>
                )}
            </form>
        </div>
    );
}

export default LoginPage;
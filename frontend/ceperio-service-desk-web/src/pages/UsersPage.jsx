import { useEffect, useState } from "react";
import { getUsers } from "../services/userService";

import cepelogo from "../assets/cepelogo.png";

function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadUsers() {
            try {
                const data = await getUsers();
                setUsers(data);
            } catch (error) {
                setError(error.userMessage || "Não foi possível carregar os usuários.");
            } finally {
                setLoading(false);
            }
        }

        loadUsers();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center">

                    <div className="relative flex items-center justify-center">
                        <img
                            src={cepelogo}
                            alt="CepeRio"
                            className="relative h-14 w-14 object-contain" />
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                        <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500 [animation-delay:150ms]" />
                        <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500 [animation-delay:300ms]" />
                    </div>

                    <div className="mt-4 text-center">
                        <p className="font-medium text-neutral-300">
                            Carregando usuários...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-400">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-white">Usuários</h1>
                <p className="text-sm text-neutral-400 mt-1">
                    Gerencie os usuários e seus níveis de acesso.
                </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
                <table className="w-full">
                    <thead className="border-b border-neutral-800">
                        <tr className="text-left text-sm text-neutral-400">
                            <th className="px-6 py-4">Nome</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Perfil</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b border-neutral-800 last:border-b-0">
                                <td className="px-6 py-4 text-white">{user.name}</td>
                                <td className="px-6 py-4 text-neutral-400">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-neutral-300">{user.role}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-neutral-300">
                                        {user.isActive ? "Ativo" : "Inativo"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UsersPage;


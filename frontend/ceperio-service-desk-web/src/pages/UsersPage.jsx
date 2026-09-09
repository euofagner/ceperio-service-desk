import { useEffect, useState } from "react";
import { getUsers, updateUserRole } from "../services/userService";

import cepelogo from "../assets/cepelogo.png";

function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingUserId, setUpdatingUserId] = useState(null);

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

    async function handleRoleChange(user, newRole) {
        if (user.role === newRole) return;

        try {
            setUpdatingUserId(user.id);

            const updatedUser = await updateUserRole(user.id, newRole);

            setUsers((currentUsers) =>
                currentUsers.map((currentUser) =>
                    currentUser.id === updatedUser.id ? updatedUser : currentUser
                )
            );
        } catch (error) {
            setError(error.userMessage || "Não foi possível alterar o perfil do usuário.");
        } finally {
            setUpdatingUserId(null);
        }
    }

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
                            <th className="px-6 py-4">Ações</th>
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
                                <td className="px-6 py-4">
                                    <div className="relative inline-flex">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user, e.target.value)}
                                            disabled={updatingUserId === user.id}
                                            className="
                                                appearance-none
                                                rounded-md
                                                border border-neutral-800
                                                bg-neutral-900
                                                px-3 py-2 pr-9
                                                text-sm font-medium
                                                text-neutral-200
                                                outline-none
                                                transition-colors duration-150
                                                hover:border-neutral-700
                                                hover:bg-neutral-800
                                                focus:border-neutral-600
                                                disabled:cursor-not-allowed
                                                disabled:opacity-50">
                                            <option value="User">User</option>
                                            <option value="Agent">Agent</option>
                                            <option value="Admin">Admin</option>
                                        </select>

                                        <svg
                                            className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-300"
                                            viewBox="0 0 20 20"
                                            fill="currentColor">
                                            <path
                                                fillRule="evenodd"
                                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                                clipRule="evenodd" />
                                        </svg>
                                    </div>
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


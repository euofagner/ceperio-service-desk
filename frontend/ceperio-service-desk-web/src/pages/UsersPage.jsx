import { useEffect, useMemo, useState } from "react";
import { ChevronDown, CircleAlert, Users } from "lucide-react";

import { getUsers, updateUserRole } from "../services/userService";

import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

import { useAuth } from "../contexts/AuthContext";

import cepelogo from "../assets/cepelogo.png";

const ROLES = {
    USER: "User",
    AGENT: "Agent",
    ADMIN: "Admin",
};

const ROLE_LABELS = {
    [ROLES.USER]: "Usuário",
    [ROLES.AGENT]: "Agente",
    [ROLES.ADMIN]: "Administrador",
};

const ROLE_OPTIONS = [
    ROLES.USER,
    ROLES.AGENT,
    ROLES.ADMIN,
];

const ROLE_STYLES = {
    [ROLES.ADMIN]:
        "border-purple-500/20 bg-purple-500/10 text-purple-300",

    [ROLES.AGENT]:
        "border-blue-500/20 bg-blue-500/10 text-blue-300",

    [ROLES.USER]:
        "border-neutral-700 bg-neutral-800/60 text-neutral-300",
};

function formatName(name = "") {
    return name
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map(
            (part) =>
                part.charAt(0).toUpperCase() + part.slice(1)
        )
        .join(" ");
}

function getInitials(name = "") {
    return (
        formatName(name)
            .split(" ")
            .filter(Boolean)
            .map((part) => part[0])
            .slice(0, 2)
            .join("") || "?"
    );
}

function LoadingState() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-neutral-950">
            <div className="flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900">
                    <img
                        src={cepelogo}
                        alt="CepeRio"
                        className="h-10 w-10 object-contain" />
                </div>

                <div
                    className="mt-5 flex items-center gap-1.5"
                    aria-label="Carregando">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500 [animation-delay:300ms]" />
                </div>

                <p className="mt-4 text-sm font-medium text-neutral-400">
                    Carregando usuários...
                </p>
            </div>
        </div>
    );
}

function ErrorState({ message }) {
    return (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4">
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                    <CircleAlert
                        className="h-5 w-5 text-red-400"
                        strokeWidth={1.8}
                        aria-hidden="true" />
                </div>

                <div>
                    <p className="text-sm font-medium text-red-300">
                        Não foi possível carregar os usuários
                    </p>

                    <p className="mt-0.5 text-sm text-red-400/80">
                        {message}
                    </p>
                </div>
            </div>
        </div>
    );
}

function SummaryCard({ label, value, description }) {
    return (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 px-5 py-4">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                {label}
            </p>

            <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
                {value}
            </p>

            <p className="mt-1 text-xs text-neutral-500">
                {description}
            </p>
        </div>
    );
}

function UserRoleBadge({ role }) {
    return (
        <span
            className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium ${ROLE_STYLES[role] ?? ROLE_STYLES[ROLES.USER]
                }`}>
            {ROLE_LABELS[role] ?? role}
        </span>
    );
}

function UserStatus({ isActive }) {
    return (
        <div className="flex items-center gap-2">
            <span
                className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-400" : "bg-neutral-600"
                    }`}
                aria-hidden="true"
            />

            <span
                className={`text-sm ${isActive
                    ? "text-emerald-300"
                    : "text-neutral-500"
                    }`}
            >
                {isActive ? "Ativo" : "Inativo"}
            </span>
        </div>
    );
}

function RoleSelector({ user, isUpdating, onChange }) {
    return (
        <div className="relative inline-flex">
            <select
                value={user.role}
                onChange={(event) =>
                    onChange(user, event.target.value)
                }
                disabled={isUpdating}
                aria-label={`Alterar perfil de ${formatName(user.name)}`}
                className="
                    min-w-28.75
                    cursor-pointer
                    appearance-none
                    rounded-lg
                    border border-neutral-700
                    bg-neutral-800/70
                    px-3 py-2
                    pr-9
                    text-left
                    text-sm font-medium
                    text-neutral-200
                    outline-none
                    transition-colors
                    duration-150
                    hover:border-neutral-600
                    hover:bg-neutral-800
                    focus:border-neutral-600
                    focus:ring-0
                    disabled:cursor-not-allowed
                    disabled:opacity-50">

                {ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role}>
                        {ROLE_LABELS[role]}
                    </option>
                ))}
            </select>

            <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-500"
                strokeWidth={1.8}
                aria-hidden="true"
            />
        </div>
    );
}

function UserRow({ user, isUpdating, onRoleChange }) {
    const formattedName = formatName(user.name);
    const initials = getInitials(user.name);

    return (
        <tr className="group transition-colors duration-150 hover:bg-neutral-800/30">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div
                        className="
                            flex h-9 w-9 shrink-0
                            items-center justify-center
                            rounded-full
                            bg-linear-to-br
                            from-cyan-400
                            to-blue-600
                            text-[11px]
                            font-bold
                            text-white
                            ring-1
                            ring-inset
                            ring-white/10"
                        aria-hidden="true">
                        {initials}
                    </div>

                    <span className="font-medium text-neutral-200">
                        {formattedName}
                    </span>
                </div>
            </td>

            <td className="px-6 py-4">
                <span className="text-sm text-neutral-400">
                    {user.email}
                </span>
            </td>

            <td className="px-6 py-4">
                <UserRoleBadge role={user.role} />
            </td>

            <td className="px-6 py-4">
                <UserStatus isActive={user.isActive} />
            </td>

            <td className="px-6 py-4 text-right">
                <RoleSelector
                    user={user}
                    isUpdating={isUpdating}
                    onChange={onRoleChange}
                />
            </td>
        </tr>
    );
}

function UsersTable({ users, updatingUserId, onRoleChange }) {
    return (
        <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/60">
            <div className="overflow-x-auto">
                <table className="w-full min-w-190">
                    <caption className="sr-only">
                        Lista de usuários e seus níveis de acesso
                    </caption>

                    <thead>
                        <tr className="border-b border-neutral-800 bg-neutral-900/80">
                            {[
                                "Nome",
                                "Email",
                                "Perfil",
                                "Status",
                            ].map((heading) => (
                                <th
                                    key={heading}
                                    scope="col"
                                    className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                                    {heading}
                                </th>
                            ))}

                            <th
                                scope="col"
                                className="px-6 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                                Ações
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-neutral-800/70">
                        {users.length > 0 ? (
                            users.map((user) => (
                                <UserRow
                                    key={user.id}
                                    user={user}
                                    isUpdating={
                                        updatingUserId === user.id
                                    }
                                    onRoleChange={onRoleChange}
                                />
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-6 py-12 text-center text-sm text-neutral-500">
                                    Nenhum usuário encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between border-t border-neutral-800 bg-neutral-900/40 px-6 py-3.5">
                <p className="text-xs text-neutral-500">
                    Gerenciamento de acesso
                </p>

                <p className="text-xs text-neutral-500">
                    Alterações de perfil são aplicadas imediatamente
                </p>
            </div>
        </div>
    );
}

function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingUserId, setUpdatingUserId] = useState(null);

    const {
        toast,
        setToast,
        showToast,
        pauseToast,
        resumeToast,
    } = useToast();

    const { user: authenticatedUser, logout } = useAuth();

    useEffect(() => {
        let mounted = true;

        async function loadUsers() {
            try {
                setLoading(true);
                setError("");

                const data = await getUsers();

                if (mounted) {
                    setUsers(data);
                }
            } catch (error) {
                if (mounted) {
                    setError(
                        error.userMessage ||
                        "Não foi possível carregar os usuários."
                    );
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadUsers();

        return () => {
            mounted = false;
        };
    }, []);

    async function handleRoleChange(user, newRole) {
        if (
            user.role === newRole ||
            updatingUserId === user.id
        ) {
            return;
        }

        setUpdatingUserId(user.id);

        try {
            const updatedUser = await updateUserRole(
                user.id,
                newRole
            );

            setUsers((currentUsers) =>
                currentUsers.map((currentUser) =>
                    currentUser.id === updatedUser.id
                        ? updatedUser
                        : currentUser
                )
            );

            if (updatedUser.id === authenticatedUser?.userId) {
                logout();
                return;
            }

            showToast(
                "Perfil do usuário atualizado com sucesso!"
            );
        } catch (error) {
            showToast(
                error.userMessage ||
                "Não foi possível alterar o perfil do usuário.",
                "error"
            );
        } finally {
            setUpdatingUserId(null);
        }
    }

    const userStats = useMemo(() => {
        return users.reduce(
            (stats, user) => {
                stats.total += 1;

                if (user.role === ROLES.ADMIN) {
                    stats.admin += 1;
                }

                if (user.role === ROLES.AGENT) {
                    stats.agent += 1;
                }

                if (user.role === ROLES.USER) {
                    stats.user += 1;
                }

                return stats;
            },
            {
                total: 0,
                admin: 0,
                agent: 0,
                user: 0,
            }
        );
    }, [users]);

    if (loading) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorState message={error} />;
    }

    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-white">
                        Usuários
                    </h1>

                    <p className="mt-1.5 text-sm text-neutral-400">
                        Gerencie os usuários e seus níveis de acesso.
                    </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <Users
                        className="h-4 w-4 text-neutral-600"
                        strokeWidth={1.8}
                        aria-hidden="true"
                    />

                    <span>
                        {userStats.total}{" "}
                        {userStats.total === 1
                            ? "usuário"
                            : "usuários"}
                    </span>
                </div>
            </header>

            <section
                aria-label="Resumo dos usuários"
                className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryCard
                    label="Total"
                    value={userStats.total}
                    description="Usuários cadastrados"
                />

                <SummaryCard
                    label="Administradores"
                    value={userStats.admin}
                    description="Com acesso administrativo"
                />

                <SummaryCard
                    label="Agentes"
                    value={userStats.agent}
                    description="Com acesso de atendimento"
                />

                <SummaryCard
                    label="Usuários"
                    value={userStats.user}
                    description="Com acesso padrão"
                />
            </section>

            <UsersTable
                users={users}
                updatingUserId={updatingUserId}
                onRoleChange={handleRoleChange}
            />

            <Toast
                toast={toast}
                onClose={() => setToast(null)}
                onMouseEnter={pauseToast}
                onMouseLeave={resumeToast}
            />
        </div>
    );
}

export default UsersPage;

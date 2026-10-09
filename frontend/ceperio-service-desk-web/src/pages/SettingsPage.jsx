import { useState } from "react";
import {
    Bell,
    Check,
    ChevronRight,
    KeyRound,
    LogOut,
    Pencil,
    Trash2,
    User,
    X,
} from "lucide-react";

import { useAuth } from "../contexts/AuthContext";

function SettingsPage() {
    const { user, logout } = useAuth();

    const [activeSection, setActiveSection] = useState("account");
    const [editingProfile, setEditingProfile] = useState(false);
    const [editingPersonal, setEditingPersonal] = useState(false);

    const [profileData, setProfileData] = useState({
        department: "",
    });

    const [personalData, setPersonalData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        role: user?.role || "",
        department: "",
    });

    const navigationItems = [
        {
            id: "account",
            label: "Minha conta",
            icon: User,
        },
        {
            id: "password",
            label: "Senha",
            icon: KeyRound,
        },
        {
            id: "notifications",
            label: "Notificações",
            icon: Bell,
        },
        {
            id: "delete",
            label: "Deletar conta",
            icon: Trash2,
            destructive: true,
        },
    ];

    const handlePersonalChange = (field, value) => {
        setPersonalData((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleDepartmentChange = (value) => {
        setProfileData({
            department: value,
        });

        setPersonalData((current) => ({
            ...current,
            department: value,
        }));
    };

    const renderSectionContent = () => {
        if (activeSection === "password") {
            return (
                <section className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#151617]">
                    <div className="flex items-start gap-3.5 border-b border-white/[0.07] px-5 py-5 sm:px-6">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.035] text-zinc-400">
                            <KeyRound size={17} strokeWidth={1.8} />
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-white">
                                Senha
                            </h2>

                            <p className="mt-1 text-xs leading-5 text-zinc-500">
                                Gerencie a senha utilizada para acessar sua
                                conta.
                            </p>
                        </div>
                    </div>

                    <div className="px-5 py-6 sm:px-6">
                        <div className="max-w-xl">
                            <div>
                                <label
                                    htmlFor="current-password"
                                    className="text-xs font-medium text-zinc-400"
                                >
                                    Senha atual
                                </label>

                                <input
                                    id="current-password"
                                    type="password"
                                    placeholder="Digite sua senha atual"
                                    className="mt-2 h-10 w-full rounded-lg border border-white/8 bg-white/2.5 
                                    px-3 text-sm text-zinc-200 outline-none transition-colors placeholder:text-zinc-700 focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/10"
                                />
                            </div>

                            <div className="mt-5">
                                <label
                                    htmlFor="new-password"
                                    className="text-xs font-medium text-zinc-400"
                                >
                                    Nova senha
                                </label>

                                <input
                                    id="new-password"
                                    type="password"
                                    placeholder="Digite sua nova senha"
                                    className="mt-2 h-10 w-full rounded-lg border border-white/8 
                                    bg-white/2.5 px-3 text-sm text-zinc-200 outline-none transition-colors
                                    placeholder:text-zinc-700 focus:border-blue-500/40 focus:ring-2 
                                    focus:ring-blue-500/10"
                                />
                            </div>

                            <div className="mt-5">
                                <label
                                    htmlFor="confirm-password"
                                    className="text-xs font-medium text-zinc-400"
                                >
                                    Confirmar nova senha
                                </label>

                                <input
                                    id="confirm-password"
                                    type="password"
                                    placeholder="Repita sua nova senha"
                                    className="mt-2 h-10 w-full rounded-lg border border-white/8 
                                    bg-white/2.5 px-3 text-sm text-zinc-200 outline-none transition-colors
                                    placeholder:text-zinc-700 focus:border-blue-500/40 focus:ring-2 
                                    focus:ring-blue-500/10"
                                />
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    type="button"
                                    className="inline-flex h-9 items-center justify-center rounded-lg bg-blue-600 px-4 text-xs font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 active:scale-[0.98]"
                                >
                                    Atualizar senha
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            );
        }

        if (activeSection === "notifications") {
            return (
                <section className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#151617]">
                    <div className="flex items-start gap-3.5 border-b border-white/[0.07] px-5 py-5 sm:px-6">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.035] text-zinc-400">
                            <Bell size={17} strokeWidth={1.8} />
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-white">
                                Notificações
                            </h2>

                            <p className="mt-1 text-xs leading-5 text-zinc-500">
                                Escolha quais notificações deseja receber.
                            </p>
                        </div>
                    </div>

                    <div className="divide-y divide-white/6">
                        <div className="flex items-center justify-between gap-5 px-5 py-5 sm:px-6">
                            <div>
                                <p className="text-sm font-medium text-zinc-200">
                                    Atualizações da conta
                                </p>

                                <p className="mt-1 text-xs leading-5 text-zinc-600">
                                    Receba informações importantes sobre sua
                                    conta.
                                </p>
                            </div>

                            <button
                                type="button"
                                aria-label="Ativar notificações de atualizações da conta"
                                className="relative h-6 w-11 shrink-0 rounded-full bg-blue-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                            >
                                <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
                            </button>
                        </div>

                        <div className="flex items-center justify-between gap-5 px-5 py-5 sm:px-6">
                            <div>
                                <p className="text-sm font-medium text-zinc-200">
                                    Atividade
                                </p>

                                <p className="mt-1 text-xs leading-5 text-zinc-600">
                                    Seja avisado sobre atividades relacionadas
                                    à sua conta.
                                </p>
                            </div>

                            <button
                                type="button"
                                aria-label="Ativar notificações de atividade"
                                className="relative h-6 w-11 shrink-0 rounded-full bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                            >
                                <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-zinc-500 shadow-sm" />
                            </button>
                        </div>
                    </div>
                </section>
            );
        }

        if (activeSection === "delete") {
            return (
                <section className="overflow-hidden rounded-xl border border-red-500/12 bg-red-500/2.5">
                    <div className="flex items-start gap-3.5 border-b border-red-500/8 px-5 py-5 sm:px-6">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border 
                        border-red-500/12 bg-red-500/4.5 text-red-400">
                            <Trash2 size={17} strokeWidth={1.8} />
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-zinc-200">
                                Deletar conta
                            </h2>

                            <p className="mt-1 text-xs leading-5 text-zinc-500">
                                Exclua permanentemente sua conta e os dados
                                associados.
                            </p>
                        </div>
                    </div>

                    <div className="px-5 py-6 sm:px-6">
                        <p className="max-w-xl text-sm leading-6 text-zinc-400">
                            Esta ação é permanente e não poderá ser desfeita.
                            Certifique-se de que deseja continuar antes de
                            excluir sua conta.
                        </p>

                        <button
                            type="button"
                            className="mt-5 inline-flex h-9 items-center justify-center rounded-lg border 
                            border-red-500/18 bg-red-500/5 px-4 text-xs font-medium text-red-400 
                            transition-colors hover:border-red-500/30 hover:bg-red-500/9 hover:text-red-300 
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/30"
                        >
                            Deletar minha conta
                        </button>
                    </div>
                </section>
            );
        }

        return (
            <>
                <section
                    id="profile"
                    className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#151617]"
                >
                    <div className="border-b border-white/[0.07] px-5 py-5 sm:px-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-sm font-semibold text-white">
                                    Minha conta
                                </h2>

                                <p className="mt-1 text-xs leading-5 text-zinc-500">
                                    Gerencie suas informações pessoais e dados
                                    da conta.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="px-5 py-6 sm:px-6">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 items-center gap-4">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full 
                                border border-white/8 bg-white/4.5 text-zinc-400">
                                    <User
                                        size={28}
                                        strokeWidth={1.45}
                                    />
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-base font-semibold tracking-[-0.01em] text-white">
                                        {user?.name || "Seu nome"}
                                    </p>

                                    <p className="mt-1 text-xs text-zinc-500">
                                        {user?.role || "Usuário"}
                                    </p>

                                    <div className="mt-2 flex items-center gap-1.5">
                                        <span className="text-xs text-zinc-600">
                                            Departamento:
                                        </span>

                                        <span className="truncate text-xs text-zinc-400">
                                            {profileData.department ||
                                                "Adicione seu departamento"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setEditingProfile(true)}
                                className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border 
                                border-blue-500/10 bg-blue-500/[0.07] px-3.5 text-xs font-medium text-blue-400 
                                outline-none transition-all hover:border-blue-500/18 hover:bg-blue-500/11 
                                hover:text-blue-300 focus-visible:ring-2 focus-visible:ring-blue-500/30 active:scale-[0.98]"
                            >
                                <Pencil size={14} strokeWidth={1.8} />
                                Editar
                            </button>
                        </div>

                        {editingProfile && (
                            <div className="mt-6 border-t border-white/6 pt-5">
                                <label
                                    htmlFor="department"
                                    className="text-[13px] font-medium text-zinc-300"
                                >
                                    Departamento
                                </label>

                                <input
                                    id="department"
                                    type="text"
                                    value={profileData.department}
                                    onChange={(event) =>
                                        handleDepartmentChange(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Ex.: TI, Financeiro, RH..."
                                    autoFocus
                                    className="mt-2 h-10 w-full rounded-lg border border-white/8 
                                    bg-white/2.5 px-3 text-sm outline-none 
                                    transition-colors placeholder:text-zinc-700 focus:border-blue-500/40 
                                    focus:ring-2 focus:ring-blue-500/10"
                                />

                                <div className="mt-4 flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setEditingProfile(false)
                                        }
                                        className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-zinc-500 transition-colors hover:bg-white/4 hover:text-zinc-300"
                                    >
                                        <X size={14} />
                                        Cancelar
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setEditingProfile(false)
                                        }
                                        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 text-xs font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                                    >
                                        <Check size={14} />
                                        Salvar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <section className="mt-5 overflow-hidden rounded-xl border border-white/[0.07] bg-[#151617]">
                    <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] px-5 py-5 sm:px-6">
                        <div>
                            <h2 className="text-sm font-semibold text-white">
                                Informações pessoais
                            </h2>

                            <p className="mt-1 text-xs leading-5 text-zinc-500">
                                Informações utilizadas para identificar sua
                                conta.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setEditingPersonal(true)}
                            className="inline-flex h-9 shrink-0 items-center justify-center gap-2 
                            rounded-lg border border-blue-500/10 bg-blue-500/[0.07] px-3.5 
                            text-xs font-medium text-blue-400 outline-none transition-all 
                            hover:border-blue-500/18 hover:bg-blue-500/11 hover:text-blue-300 
                            focus-visible:ring-2 focus-visible:ring-blue-500/30 active:scale-[0.98]"
                        >
                            <Pencil size={14} strokeWidth={1.8} />
                            <span className="hidden sm:inline">Editar</span>
                        </button>
                    </div>

                    {editingPersonal ? (
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 px-5 py-6 sm:grid-cols-2 sm:px-6">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="text-[13px] font-medium text-zinc-400"
                                >
                                    Nome
                                </label>

                                <input
                                    id="name"
                                    value={personalData.name}
                                    onChange={(event) =>
                                        handlePersonalChange(
                                            "name",
                                            event.target.value
                                        )
                                    }
                                    className="mt-2 h-10 w-full rounded-lg border border-white/8 bg-white/2.5 
                                    px-3 text-sm text-zinc-200 outline-none transition-colors focus:border-blue-500/40 
                                    focus:ring-2 focus:ring-blue-500/10"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="role"
                                    className="text-[13px] font-medium text-zinc-400"
                                >
                                    Perfil
                                </label>

                                <input
                                    id="role"
                                    value={personalData.role}
                                    onChange={(event) =>
                                        handlePersonalChange(
                                            "role",
                                            event.target.value
                                        )
                                    }
                                    className="mt-2 h-10 w-full rounded-lg border border-white/8 
                                    bg-white/2.5 px-3 text-sm text-zinc-200 outline-none transition-colors 
                                    focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/10"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="email"
                                    className="text-[13px] font-medium text-zinc-400">

                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    value={personalData.email}
                                    onChange={(event) =>
                                        handlePersonalChange(
                                            "email",
                                            event.target.value
                                        )
                                    }
                                    className="mt-2 h-10 w-full rounded-lg border border-white/8 
                                    bg-white/2.5 px-3 text-sm text-zinc-200 outline-none 
                                    transition-colors focus:border-blue-500/40 focus:ring-2 
                                    focus:ring-blue-500/10" />
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="personal-department"
                                    className="text-[13px] font-medium text-zinc-400"
                                >
                                    Departamento
                                </label>

                                <input
                                    id="personal-department"
                                    value={personalData.department}
                                    onChange={(event) =>
                                        handlePersonalChange(
                                            "department",
                                            event.target.value
                                        )
                                    }
                                    placeholder="Ex.: Administrativo"
                                    className="mt-2 h-10 w-full rounded-lg border border-white/8
                                    bg-white/2.5 px-3 text-sm outline-none 
                                    transition-colors placeholder:text-zinc-700 focus:border-blue-500/40 
                                    focus:ring-2 focus:ring-blue-500/10"
                                />
                            </div>

                            <div className="flex justify-end gap-2 sm:col-span-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setEditingPersonal(false)
                                    }
                                    className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium 
                                    text-zinc-500 transition-colors hover:bg-white/4 hover:text-zinc-300"
                                >
                                    <X size={14} />
                                    Cancelar
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setEditingPersonal(false)
                                    }
                                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 
                                    text-xs font-medium text-white transition-colors hover:bg-blue-500 
                                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                                >
                                    <Check size={14} />
                                    Salvar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 divide-y divide-white/6 sm:grid-cols-2 sm:divide-y-0">
                            <div className="px-5 py-4 sm:border-r sm:border-white/6 sm:px-6">
                                <p className="text-[13px] font-medium text-zinc-500">
                                    Nome
                                </p>

                                <p className="mt-1.5 truncate text-sm font-medium text-zinc-200">
                                    {user?.name || "—"}
                                </p>
                            </div>

                            <div className="px-5 py-4 sm:px-6">
                                <p className="text-[13px] font-medium text-zinc-500">
                                    Perfil
                                </p>

                                <p className="mt-1.5 truncate text-sm font-medium text-zinc-200">
                                    {user?.role || "—"}
                                </p>
                            </div>

                            <div className="border-t border-white/6 px-5 py-4 sm:col-span-2 sm:px-6">
                                <p className="text-[13px] font-medium text-zinc-500">
                                    Email
                                </p>

                                <p className="mt-1.5 truncate text-sm text-zinc-300">
                                    {user?.email || "—"}
                                </p>
                            </div>

                            <div className="border-t border-white/6 px-5 py-4 sm:col-span-2 sm:px-6">
                                <p className="text-[13px] font-medium text-zinc-500">
                                    Departamento
                                </p>

                                <p className="mt-1.5 truncate text-sm text-zinc-300">
                                    {personalData.department || "—"}
                                </p>
                            </div>
                        </div>
                    )}
                </section>

                <section className="mt-5 overflow-hidden rounded-xl border border-white/[0.07] bg-[#151617]">
                    <div className="flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div className="flex items-start gap-3.5">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border 
                                 border-white/[0.07] bg-white/[0.035] text-zinc-500">
                                <LogOut
                                    size={17}
                                    strokeWidth={1.8}
                                />
                            </div>

                            <div>
                                <h2 className="text-[14px] font-semibold text-zinc-200">
                                    Sessão atual
                                </h2>

                                <p className="mt-1 text-[13px] leading-5 text-zinc-500">
                                    Encerre sua sessão neste dispositivo.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={logout}
                            className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border 
                            border-red-500/[0.14] bg-red-500/4 px-4 text-xs font-medium 
                            text-red-400 outline-none transition-all hover:border-red-500/25
                            hover:bg-red-500/8 hover:text-red-300 focus-visible:ring-2 
                            focus-visible:ring-red-500/30 active:scale-[0.98]"
                        >
                            Sair
                        </button>
                    </div>
                </section>
            </>
        );
    };

    return (
        <div className="mx-auto w-full max-w-6xl">
            <header className="mb-7">
                <h1 className="text-[26px] font-semibold leading-tight tracking-tight text-white">
                    Configurações da conta
                </h1>
            </header>

            <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101112] 
                shadow-[0_20px_60px_-35px_rgba(0,0,0,0.8)]">
                <div className="grid min-h-162.5 grid-cols-1 lg:grid-cols-[228px_minmax(0,1fr)]">
                    <aside className="border-b border-white/[0.07] bg-[#0d0e0f] lg:border-b-0 lg:border-r">
                        <nav
                            aria-label="Configurações da conta"
                            className="p-3 lg:sticky lg:top-4">

                            <div className="mb-3 px-3 py-2">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
                                    Conta
                                </p>
                            </div>

                            {navigationItems.map((item) => {
                                const Icon = item.icon;
                                const isActive =
                                    activeSection === item.id;

                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() =>
                                            setActiveSection(item.id)
                                        }
                                        className={[
                                            "group mt-1 flex min-h-10 w-full items-center justify-between rounded-lg px-3 text-left text-sm font-medium outline-none transition-all focus-visible:ring-2",
                                            item.destructive
                                                ? isActive
                                                    ? "bg-red-500/8 text-red-400 focus-visible:ring-red-500/30"
                                                    : "text-red-500/70 hover:bg-red-500/5 hover:text-red-400 focus-visible:ring-red-500/30"
                                                : isActive
                                                    ? "bg-blue-500/10 text-blue-400 focus-visible:ring-blue-500/30"
                                                    : "text-zinc-500 hover:bg-white/[0.035] hover:text-zinc-300 focus-visible:ring-blue-500/30",
                                        ].join(" ")}>

                                        <span className="flex items-center gap-2.5">
                                            <Icon
                                                size={16}
                                                strokeWidth={1.8} />

                                            {item.label}
                                        </span>

                                        {isActive && (
                                            <ChevronRight
                                                size={15}
                                                className={
                                                    item.destructive
                                                        ? "text-red-400/70"
                                                        : "text-blue-400/70"
                                                }
                                            />
                                        )}
                                    </button>
                                );
                            })}

                            <div className="my-5 h-px bg-white/6" />

                            <p className="px-3 text-[13px] leading-5 text-zinc-500">
                                Mantenha suas informações sempre atualizadas
                                para uma melhor experiência.
                            </p>
                        </nav>
                    </aside>

                    <main className="min-w-0 bg-[#111213]">
                        <div className="mx-auto w-full max-w-3xl px-5 py-6 sm:px-7 sm:py-8 lg:px-9 lg:py-9">
                            {renderSectionContent()}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;

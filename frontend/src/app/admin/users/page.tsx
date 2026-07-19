"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { api } from "@/services/api";
import type { User } from "@/types";
import { DataTable, Column } from "@/components/admin/DataTable";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { Shield, ShieldOff } from "lucide-react";

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  moderator: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  user: "bg-gray-500/10 text-cyber-text-muted border-gray-500/30",
};

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  moderator: "Moderador",
  user: "Usuário",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<User | null>(null);

  const fetchRoles = useCallback(async () => {
    try {
      const rolesList = await api.getRoles();
      const roleMap: Record<string, string> = {};
      for (const r of rolesList) {
        roleMap[r.id] = r.name;
      }
      setRoles(roleMap);
    } catch {
      setRoles({});
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const result = await api.listUsers(1, 100);
      setUsers(result.users);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, [fetchRoles, fetchUsers]);

  const getRoleName = useCallback(
    (user: User) => roles[user.roleId || ""] || user.roleName || "user",
    [roles],
  );

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        u.username?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.name?.toLowerCase().includes(q),
    );
  }, [searchQuery, users]);

  const handleToggleAdmin = useCallback(
    (user: User) => {
      setConfirmTarget(user);
    },
    [],
  );

  const confirmToggleAdmin = useCallback(async () => {
    if (!confirmTarget?.id) return;

    const adminRoleId = Object.keys(roles).find((k) => roles[k] === "admin");
    const userRoleId = Object.keys(roles).find((k) => roles[k] === "user");

    if (!adminRoleId || !userRoleId) {
      setError("Não foi possível determinar os papéis disponíveis");
      setConfirmTarget(null);
      return;
    }

    const currentRoleName = getRoleName(confirmTarget);
    const isCurrentlyAdmin = currentRoleName === "admin";
    const newRoleId = isCurrentlyAdmin ? userRoleId : adminRoleId;
    const action = isCurrentlyAdmin ? "remover" : "conceder";

    try {
      setUpdatingUserId(confirmTarget.id);
      setSuccessMsg(null);
      setConfirmTarget(null);
      await api.updateUserRole(confirmTarget.id, newRoleId);
      setSuccessMsg(`Acesso de admin ${action} para ${confirmTarget.username}`);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar papel");
    } finally {
      setUpdatingUserId(null);
    }
  }, [confirmTarget, roles, getRoleName, fetchUsers]);

  const adminCount = users.filter((u) => getRoleName(u) === "admin").length;
  const modCount = users.filter((u) => getRoleName(u) === "moderator").length;
  const userCount = users.filter((u) => getRoleName(u) === "user").length;

  const columns: Column<User>[] = [
    {
      key: "username",
      header: "Usuário",
      sortable: true,
      render: (user) => (
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold border border-white/[0.06]"
            style={{
              backgroundColor: `hsl(${(user.username?.charCodeAt(0) || 0) * 17 % 360}, 70%, 50%)`,
              color: "white",
            }}
          >
            {user.username?.charAt(0).toUpperCase() || "?"}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{user.username}</p>
            {user.name && (
              <p className="text-xs text-cyber-text-muted">{user.name}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      sortable: true,
      hideOn: "sm",
      render: (user) => (
        <span className="text-sm text-cyber-text-muted">{user.email}</span>
      ),
    },
    {
      key: "role",
      header: "Papel",
      sortable: false,
      hideOn: "md",
      render: (user) => {
        const roleName = getRoleName(user);
        const roleLabel = ROLE_LABELS[roleName] || roleName;
        const roleColor = ROLE_COLORS[roleName] || ROLE_COLORS.user;
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleColor}`}>
            {roleLabel}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      header: "Criado em",
      sortable: true,
      hideOn: "lg",
      render: (user) => (
        <span className="text-sm text-cyber-text-muted">
          {new Date(user.createdAt).toLocaleDateString("pt-BR")}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Ações",
      render: (user) => {
        const isSamuteg = user.username === "Samuteg";
        const isUpdating = updatingUserId === user.id;
        const roleName = getRoleName(user);

        if (isSamuteg) {
          return <span className="text-xs text-cyber-text-muted/50 italic">—</span>;
        }

        return (
          <button
            onClick={() => handleToggleAdmin(user)}
            disabled={isUpdating}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all disabled:opacity-50 ${
              roleName === "admin"
                ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                : "border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
            }`}
          >
            {isUpdating ? (
              <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
            ) : roleName === "admin" ? (
              <ShieldOff size={14} />
            ) : (
              <Shield size={14} />
            )}
            {roleName === "admin" ? "Remover Admin" : "Tornar Admin"}
          </button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Usuários</h1>
        <p className="text-cyber-text-muted mt-1">
          Gerencie o acesso de administradores da plataforma
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-lg bg-neon-green/10 border border-neon-green/30 text-neon-green text-sm">
          {successMsg}
          <button onClick={() => setSuccessMsg(null)} className="ml-2 underline">Fechar</button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">Fechar</button>
        </div>
      )}

      <div className="rounded-xl bg-cyber-dark-surface/50 border border-cyber-dark-border p-5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
            <Shield size={20} />
          </div>
          <div>
            <p className="text-sm text-cyber-text">
              <strong className="text-white">Apenas Samuteg</strong> pode gerenciar administradores.
            </p>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredUsers}
        loading={loading}
        search={{
          value: searchQuery,
          onChange: setSearchQuery,
          placeholder: "Buscar por nome, email ou usuário...",
        }}
        keyExtractor={(u) => u.id}
        emptyState={
          <div className="text-center py-16">
            <p className="text-cyber-text-muted text-lg font-medium">
              {users.length === 0 ? "Nenhum usuário encontrado" : "Nenhum resultado para sua busca"}
            </p>
          </div>
        }
      />

      {!loading && users.length > 0 && (
        <div className="text-sm text-cyber-text-muted">
          {filteredUsers.length} de {users.length} usuário(s) ·{" "}
          <span className="text-purple-400">{adminCount} admin(s)</span> ·{" "}
          <span className="text-blue-400">{modCount} moderador(es)</span> ·{" "}
          <span>{userCount} usuário(s)</span>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-cyber-text-muted hover:text-white border border-cyber-dark-border hover:border-gray-600 rounded-lg transition-all disabled:opacity-50"
        >
          <svg
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Atualizar
        </button>
      </div>

      <ConfirmModal
        open={!!confirmTarget}
        title={confirmTarget && (roles[confirmTarget.roleId || ""] || confirmTarget.roleName) === "admin" ? "Remover Admin" : "Tornar Admin"}
        message={
          confirmTarget
            ? `Tem certeza que deseja ${
                (roles[confirmTarget.roleId || ""] || confirmTarget.roleName) === "admin"
                  ? "remover"
                  : "conceder"
              } acesso de admin para "${confirmTarget.username}"?`
            : ""
        }
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        variant="default"
        onConfirm={confirmToggleAdmin}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}

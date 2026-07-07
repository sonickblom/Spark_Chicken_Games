"use client";

import React, { useState, useEffect, useCallback } from "react";
import { api } from "@/services/api";
import type { User } from "@/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Role color map (by role name)
  const ROLE_COLORS: Record<string, string> = {
    admin: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    moderator: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    user: "bg-gray-500/10 text-gray-400 border-gray-500/30",
  };

  const ROLE_LABELS: Record<string, string> = {
    admin: "Admin",
    moderator: "Moderador",
    user: "Usuário",
  };

  const fetchRoles = useCallback(async () => {
    try {
      const rolesList = await api.getRoles();
      const roleMap: Record<string, string> = {};
      for (const r of rolesList) {
        roleMap[r.id] = r.name;
      }
      setRoles(roleMap);
    } catch {
      // Fallback: keep roles empty, will use roleName from user profile
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
      setError(
        err instanceof Error ? err.message : "Erro ao carregar usuários",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, [fetchRoles, fetchUsers]);

  const handleToggleAdmin = async (user: User) => {
    if (!user.id) return;

    const adminRoleId = Object.keys(roles).find((k) => roles[k] === "admin");
    const userRoleId = Object.keys(roles).find((k) => roles[k] === "user");

    if (!adminRoleId || !userRoleId) {
      setError(
        "Não foi possível determinar os papéis disponíveis. Tente recarregar a página.",
      );
      return;
    }

    const currentRoleName = roles[user.roleId || ""] || user.roleName || "user";
    const isCurrentlyAdmin = currentRoleName === "admin";
    const newRoleId = isCurrentlyAdmin ? userRoleId : adminRoleId;
    const action = isCurrentlyAdmin ? "remover" : "conceder";

    if (
      !window.confirm(
        `Tem certeza que deseja ${action} acesso de admin para "${user.username}"?`,
      )
    ) {
      return;
    }

    try {
      setUpdatingUserId(user.id);
      setSuccessMsg(null);
      await api.updateUserRole(user.id, newRoleId);
      setSuccessMsg(
        `✅ Acesso de admin ${isCurrentlyAdmin ? "removido" : "concedido"} para ${user.username}!`,
      );
      await fetchUsers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao atualizar papel do usuário",
      );
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Filter users by search
  const filteredUsers = users.filter((u) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          👥 Usuários
        </h1>
        <p className="text-gray-400 mt-1">
          Gerencie o acesso de administradores da plataforma
        </p>
      </div>

      {/* Success message */}
      {successMsg && (
        <div className="p-4 rounded-lg bg-neon-green/10 border border-neon-green/30 text-neon-green text-sm">
          {successMsg}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 underline hover:no-underline"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Info card */}
      <div className="rounded-xl bg-gray-900/30 border border-gray-800 p-5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-300">
              <strong className="text-white">Apenas Samuteg</strong> pode
              gerenciar administradores. Clique no botão ao lado do usuário para
              conceder ou remover acesso de admin.
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Buscar por nome, email ou usuário..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent text-sm transition-all"
        />
      </div>

      {/* Users table */}
      <div className="rounded-xl bg-gray-900/30 border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Carregando usuários...</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Email
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Papel
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredUsers.map((user) => {
                  const isSamuteg = user.username === "Samuteg";
                  const roleName =
                    roles[user.roleId || ""] || user.roleName || "user";
                  const roleLabel = ROLE_LABELS[roleName] || roleName;
                  const roleColor =
                    ROLE_COLORS[roleName] ||
                    "bg-gray-500/10 text-gray-400 border-gray-500/30";
                  const isUpdating = updatingUserId === user.id;

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-800/20 transition-colors group"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center shrink-0 text-sm font-bold text-gray-500">
                            {user.username?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {user.username}
                              {isSamuteg && (
                                <span className="ml-2 text-xs text-purple-400">
                                  👑
                                </span>
                              )}
                            </p>
                            {user.name && (
                              <p className="text-xs text-gray-500">
                                {user.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <span className="text-sm text-gray-400">
                          {user.email}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleColor}`}
                        >
                          {roleLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {isSamuteg ? (
                          <span className="text-xs text-gray-600 italic">
                            —
                          </span>
                        ) : (
                          <button
                            onClick={() => handleToggleAdmin(user)}
                            disabled={isUpdating}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                              roleName === "admin"
                                ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                                : "border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {isUpdating ? (
                              <>
                                <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                                Alterando...
                              </>
                            ) : roleName === "admin" ? (
                              <>
                                <svg
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                                  />
                                </svg>
                                Remover Admin
                              </>
                            ) : (
                              <>
                                <svg
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                  />
                                </svg>
                                Tornar Admin
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Empty state */}
        {!loading && filteredUsers.length === 0 && (
          <div className="text-center py-16">
            <svg
              className="w-16 h-16 mx-auto text-gray-700 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="text-gray-400 text-lg font-medium">
              {users.length === 0
                ? "Nenhum usuário encontrado"
                : "Nenhum resultado para sua busca"}
            </p>
          </div>
        )}
      </div>

      {/* Summary */}
      {!loading && users.length > 0 && (
        <div className="text-sm text-gray-500">
          Mostrando {filteredUsers.length} de {users.length} usuário(s)
          {" · "}
          <span className="text-purple-400">
            {
              users.filter((u) => {
                const roleName = roles[u.roleId || ""] || u.roleName || "user";
                return roleName === "admin";
              }).length
            }{" "}
            admin(s)
          </span>
          {" · "}
          <span className="text-blue-400">
            {
              users.filter((u) => {
                const roleName = roles[u.roleId || ""] || u.roleName || "user";
                return roleName === "moderator";
              }).length
            }{" "}
            moderador(es)
          </span>
          {" · "}
          <span className="text-gray-400">
            {
              users.filter((u) => {
                const roleName = roles[u.roleId || ""] || u.roleName || "user";
                return roleName === "user";
              }).length
            }{" "}
            usuário(s)
          </span>
        </div>
      )}

      {/* Refresh button */}
      <div className="flex justify-center">
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600 rounded-lg transition-all disabled:opacity-50"
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
    </div>
  );
}

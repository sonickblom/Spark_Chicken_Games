"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/lib/auth-context";
import { api } from "@/services/api";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAuthenticated } = useAuthContext();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated || !user) {
      router.replace("/login?redirect=/admin");
      return;
    }

    if (user.roleName === "admin") {
      setIsAdmin(true);
      return;
    }

    if (user.roleId) {
      api.getRoles().then((roles) => {
        const role = roles.find((r) => r.id === user.roleId);
        if (role?.name === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          router.replace("/");
        }
      }).catch(() => {
        setIsAdmin(false);
        router.replace("/");
      });
    } else {
      setIsAdmin(false);
      router.replace("/");
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-neon-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-cyber-text-muted text-sm">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}

"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/lib/auth-context";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAuthenticated } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace("/login?redirect=/admin");
      return;
    }

    if (user?.username !== "Samuteg") {
      router.replace("/");
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-neon-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.username !== "Samuteg") {
    return null;
  }

  return <>{children}</>;
}

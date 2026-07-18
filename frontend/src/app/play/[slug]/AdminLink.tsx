"use client";

import Link from "next/link";
import { useAuthContext } from "@/lib/auth-context";
import { api } from "@/services/api";
import { useEffect, useState } from "react";

export default function AdminLink() {
  const { user } = useAuthContext();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (user.roleName === "admin") {
      setIsAdmin(true);
      return;
    }
    if (user.roleId) {
      api.getRoles().then((roles) => {
        const role = roles.find((r) => r.id === user.roleId);
        if (role?.name === "admin") setIsAdmin(true);
      });
    }
  }, [user]);

  if (!isAdmin) return null;

  return (
    <Link
      href="/admin"
      className="text-sm text-cyber-text-muted hover:text-neon-green transition-colors"
    >
      Admin
    </Link>
  );
}

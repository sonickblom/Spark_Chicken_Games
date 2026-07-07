"use client";

import Link from "next/link";
import { useAuthContext } from "@/lib/auth-context";

export default function AdminLink() {
  const { user } = useAuthContext();

  if (user?.username !== "Samuteg") {
    return null;
  }

  return (
    <Link
      href="/admin"
      className="text-sm text-gray-400 hover:text-neon-green transition-colors"
    >
      Admin
    </Link>
  );
}

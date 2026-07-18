import type { Metadata } from "next";
import { ProfileEditClient } from "./ProfileEditClient";

export const metadata: Metadata = {
  title: "Editar Perfil - Latency Zero",
  description: "Edite suas informações de perfil na Latency Zero.",
};

export default function ProfileEditPage() {
  return <ProfileEditClient />;
}

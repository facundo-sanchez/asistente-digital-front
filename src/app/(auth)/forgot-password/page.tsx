import type { Metadata } from "next";
import { TextLink } from "@/components/common/TextLink";
import { AuthCard } from "@/modules/auth/components/AuthCard";
import { ForgotPasswordForm } from "@/modules/auth/components/ForgotPasswordForm";

export const metadata: Metadata = { title: "Recuperar contraseña" };

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Recuperar contraseña"
      subtitle="Ingresá tu email y te enviamos un enlace para crear una contraseña nueva."
      footer={<TextLink href="/login">Volver a iniciar sesión</TextLink>}
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}

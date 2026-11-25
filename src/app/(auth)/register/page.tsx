import type { Metadata } from "next";
import { TextLink } from "@/components/common/TextLink";
import { AuthCard } from "@/modules/auth/components/AuthCard";
import { RegisterForm } from "@/modules/auth/components/RegisterForm";

export const metadata: Metadata = { title: "Crear cuenta" };

export default function RegisterPage() {
  return (
    <AuthCard
      title="Crear cuenta"
      subtitle="Te vamos a enviar un email para confirmar tu dirección."
      footer={
        <>
          ¿Ya tenés cuenta? <TextLink href="/login">Iniciá sesión</TextLink>
        </>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
}

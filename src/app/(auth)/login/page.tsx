import type { Metadata } from "next";
import { TextLink } from "@/components/common/TextLink";
import { safeNextPath } from "@/lib/config";
import { firstParam, type SearchParams } from "@/lib/search-params";
import { AuthCard } from "@/modules/auth/components/AuthCard";
import { LoginForm } from "@/modules/auth/components/LoginForm";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  return (
    <AuthCard
      title="Iniciar sesión"
      subtitle="Tus servicios, facturas y vencimientos en un solo lugar."
      footer={
        <>
          ¿No tenés cuenta? <TextLink href="/register">Registrate</TextLink>
        </>
      }
    >
      <LoginForm next={safeNextPath(firstParam(params.next))} expired={firstParam(params.expired) === "1"} />
    </AuthCard>
  );
}

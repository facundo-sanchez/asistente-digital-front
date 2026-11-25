import type { Metadata } from "next";
import { TextLink } from "@/components/common/TextLink";
import { safeNextPath } from "@/lib/config";
import { firstParam, type SearchParams } from "@/lib/search-params";
import { AuthCard } from "@/modules/auth/components/AuthCard";
import { AuthDivider } from "@/modules/auth/components/AuthDivider";
import { GoogleLoginButton } from "@/modules/auth/components/GoogleLoginButton";
import { LoginForm } from "@/modules/auth/components/LoginForm";
import { googleLoginErrorMessage } from "@/modules/auth/google-login-errors";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const next = safeNextPath(firstParam(params.next));
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
      <LoginForm
        next={next}
        expired={firstParam(params.expired) === "1"}
        initialError={googleLoginErrorMessage(firstParam(params.error))}
      />
      <AuthDivider />
      <GoogleLoginButton next={next} />
    </AuthCard>
  );
}

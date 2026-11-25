import type { Metadata } from "next";
import Alert from "@mui/material/Alert";
import { TextLink } from "@/components/common/TextLink";
import { firstParam, type SearchParams } from "@/lib/search-params";
import { AuthCard } from "@/modules/auth/components/AuthCard";
import { ResetPasswordForm } from "@/modules/auth/components/ResetPasswordForm";

export const metadata: Metadata = { title: "Nueva contraseña" };

export default async function ResetPasswordPage({ searchParams }: { searchParams: SearchParams }) {
  const token = firstParam((await searchParams).token);
  return (
    <AuthCard title="Nueva contraseña" subtitle="Elegí una contraseña nueva para tu cuenta.">
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <Alert severity="error">
          El enlace no es válido. <TextLink href="/forgot-password">Pedí uno nuevo</TextLink>.
        </Alert>
      )}
    </AuthCard>
  );
}

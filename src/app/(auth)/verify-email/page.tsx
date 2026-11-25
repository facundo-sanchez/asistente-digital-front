import type { Metadata } from "next";
import Alert from "@mui/material/Alert";
import { firstParam, type SearchParams } from "@/lib/search-params";
import { AuthCard } from "@/modules/auth/components/AuthCard";
import { VerifyEmailAction } from "@/modules/auth/components/VerifyEmailAction";

export const metadata: Metadata = { title: "Confirmar email" };

export default async function VerifyEmailPage({ searchParams }: { searchParams: SearchParams }) {
  const token = firstParam((await searchParams).token);
  return (
    <AuthCard title="Confirmar email" subtitle="Un paso más para terminar de configurar tu cuenta.">
      {token ? (
        <VerifyEmailAction token={token} />
      ) : (
        <Alert severity="error">El enlace no es válido. Podés pedir uno nuevo desde tu perfil.</Alert>
      )}
    </AuthCard>
  );
}

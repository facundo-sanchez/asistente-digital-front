import type { Metadata } from "next";
import Stack from "@mui/material/Stack";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { requireUser } from "@/lib/server/dal";
import { ChangePasswordForm } from "@/modules/user/components/ChangePasswordForm";
import { EmailVerificationBanner } from "@/modules/user/components/EmailVerificationBanner";
import { ProfileForm } from "@/modules/user/components/ProfileForm";

export const metadata: Metadata = { title: "Mi perfil" };

export default async function ProfilePage() {
  const user = await requireUser();
  return (
    <Stack spacing={4} sx={{ maxWidth: 720 }}>
      <PageHeader title="Mi perfil" description="Tus datos y cómo querés ver fechas y montos." />
      {!user.emailVerified && <EmailVerificationBanner email={user.email} />}
      <Panel title="Datos personales">
        <ProfileForm user={user} />
      </Panel>
      <Panel
        title={user.hasPassword ? "Contraseña" : "Crear contraseña"}
        description={
          user.hasPassword
            ? "Al cambiarla cerramos tus otras sesiones."
            : "Hoy ingresás con Google. Si creás una contraseña, también vas a poder entrar con tu email."
        }
      >
        <ChangePasswordForm hasPassword={user.hasPassword} />
      </Panel>
    </Stack>
  );
}

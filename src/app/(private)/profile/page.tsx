import type { Metadata } from "next";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { requireUser } from "@/lib/server/dal";
import { ChangePasswordForm } from "@/modules/user/components/ChangePasswordForm";
import { EmailVerificationBanner } from "@/modules/user/components/EmailVerificationBanner";
import { ProfileForm } from "@/modules/user/components/ProfileForm";

export const metadata: Metadata = { title: "Mi perfil" };

export default async function ProfilePage() {
  const user = await requireUser();
  return (
    <Stack spacing={3} sx={{ maxWidth: 720 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
        Mi perfil
      </Typography>
      {!user.emailVerified && <EmailVerificationBanner email={user.email} />}
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Datos personales
        </Typography>
        <ProfileForm user={user} />
      </Paper>
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" sx={{ mb: user.hasPassword ? 2 : 1 }}>
          {user.hasPassword ? "Contraseña" : "Crear contraseña"}
        </Typography>
        {!user.hasPassword && (
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Hoy ingresás con Google. Si creás una contraseña, también vas a poder entrar con tu email.
          </Typography>
        )}
        <ChangePasswordForm hasPassword={user.hasPassword} />
      </Paper>
    </Stack>
  );
}

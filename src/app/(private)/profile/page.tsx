import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import type { NotificationPreferenceResponse } from "@/types/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { requireUser } from "@/lib/server/dal";
import { serverGet } from "@/lib/server/server-get";
import { NotificationPreferencesForm } from "@/modules/notifications/components/NotificationPreferencesForm";
import { PriceIncreaseThresholdForm } from "@/modules/notifications/components/PriceIncreaseThresholdForm";
import { PushToggle } from "@/modules/notifications/components/PushToggle";
import { ChangePasswordForm } from "@/modules/user/components/ChangePasswordForm";
import { EmailVerificationBanner } from "@/modules/user/components/EmailVerificationBanner";
import { PaymentWalletForm } from "@/modules/user/components/PaymentWalletForm";
import { ProfileForm } from "@/modules/user/components/ProfileForm";

export const metadata: Metadata = { title: "Mi perfil" };

export default async function ProfilePage() {
  const user = await requireUser();
  const preferences = await serverGet<NotificationPreferenceResponse[]>("/notification-preferences");
  return (
    <Stack spacing={4} sx={{ maxWidth: 720 }}>
      <PageHeader title="Mi perfil" description="Tus datos, tus avisos y cómo querés ver fechas y montos." />
      {!user.emailVerified && <EmailVerificationBanner email={user.email} />}
      <Panel title="Datos personales">
        <ProfileForm user={user} />
      </Panel>
      <Box id="billetera">
        <Panel title="Pagos" description="Con qué billetera pagás tus facturas. El botón Pagar de cada factura copia el código y la abre.">
          <PaymentWalletForm initial={user.paymentWallet} />
        </Panel>
      </Box>
      {preferences && (
        <Panel
          title="Avisos"
          description={`Qué te avisamos y cuándo. Los avisos por email llegan juntos, en un solo email por día, a ${user.email}.`}
        >
          <Box sx={{ mb: 3 }}>
            <PushToggle />
          </Box>
          <NotificationPreferencesForm initial={preferences} />
          <Box sx={{ mt: 4 }}>
            <PriceIncreaseThresholdForm initial={user.priceIncreaseThreshold} />
          </Box>
        </Panel>
      )}
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

import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { PageHeader } from "@/components/layout/PageHeader";
import { requireUser } from "@/lib/server/dal";
import { MonthPanel } from "@/modules/dashboard/components/MonthPanel";
import { UpcomingPanel } from "@/modules/dashboard/components/UpcomingPanel";
import { EmailVerificationBanner } from "@/modules/user/components/EmailVerificationBanner";

export const metadata: Metadata = { title: "Inicio" };

/** Mes en curso en el idioma y la zona horaria del usuario, ej. "Noviembre de 2026". */
function currentMonthLabel(locale: string, timeZone: string): string {
  const label = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone }).format(new Date());
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export default async function DashboardPage() {
  const user = await requireUser();
  const monthLabel = currentMonthLabel(user.locale, user.timezone);
  return (
    <Stack spacing={4} sx={{ maxWidth: 1200 }}>
      <PageHeader title={`Hola, ${user.name}`} description={`${monthLabel} · así están tus cuentas`} />
      {!user.emailVerified && <EmailVerificationBanner email={user.email} />}
      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(0, 1fr) 340px" }, alignItems: "stretch" }}>
        <UpcomingPanel />
        <MonthPanel />
      </Box>
    </Stack>
  );
}

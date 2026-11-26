import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { PageHeader } from "@/components/layout/PageHeader";
import { requireUser } from "@/lib/server/dal";
import type { DashboardSpendingResponse, DashboardSummaryResponse, ObligationResponse, PageResponse } from "@/types/api";
import { serverGet } from "@/lib/server/server-get";
import { ExpiringDocumentsPanel } from "@/modules/dashboard/components/ExpiringDocumentsPanel";
import { KpiRow } from "@/modules/dashboard/components/KpiRow";
import { MonthPanel } from "@/modules/dashboard/components/MonthPanel";
import { ReviewPanel } from "@/modules/dashboard/components/ReviewPanel";
import { SpendingPanel } from "@/modules/dashboard/components/SpendingPanel";
import { UpcomingPanel } from "@/modules/dashboard/components/UpcomingPanel";
import { EmailVerificationBanner } from "@/modules/user/components/EmailVerificationBanner";

export const metadata: Metadata = { title: "Inicio" };

/** Mes en curso en el idioma y la zona horaria del usuario, ej. "Noviembre de 2026". */
function currentMonthLabel(locale: string, timeZone: string): string {
  const label = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone }).format(new Date());
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** Hoy + days en la zona del usuario, como yyyy-mm-dd. */
function dayFromToday(timeZone: string, days: number): string {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone }).format(new Date());
  const date = new Date(`${today}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export default async function DashboardPage() {
  const user = await requireUser();
  const monthLabel = currentMonthLabel(user.locale, user.timezone);
  const [summary, overdue, upcoming, spending] = await Promise.all([
    serverGet<DashboardSummaryResponse>("/dashboard"),
    serverGet<PageResponse<ObligationResponse>>("/obligations?status=OVERDUE&size=10"),
    serverGet<PageResponse<ObligationResponse>>(
      `/obligations?status=PENDING,PARTIALLY_PAID,DUE_SOON&to=${dayFromToday(user.timezone, 30)}&size=10`,
    ),
    serverGet<DashboardSpendingResponse>("/dashboard/spending"),
  ]);
  // Lo vencido primero; entre los dos, como mucho 10 filas
  const rows = [...(overdue?.content ?? []), ...(upcoming?.content ?? [])].slice(0, 10);
  return (
    <Stack spacing={4} sx={{ maxWidth: 1200 }}>
      <PageHeader title={`Hola, ${user.name}`} description={`${monthLabel} · así están tus cuentas`} />
      {!user.emailVerified && <EmailVerificationBanner email={user.email} />}
      {summary && <KpiRow summary={summary} />}
      <Box
        sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(0, 1fr) 340px" }, alignItems: "stretch" }}
      >
        <UpcomingPanel obligations={rows} />
        {summary && <MonthPanel summary={summary} />}
      </Box>
      {summary && (summary.toReview.length > 0 || summary.expiringDocuments.length > 0) && (
        <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(auto-fit, minmax(320px, 1fr))" } }}>
          <ReviewPanel reviews={summary.toReview} />
          <ExpiringDocumentsPanel documents={summary.expiringDocuments} />
        </Box>
      )}
      {spending && <SpendingPanel spending={spending} />}
    </Stack>
  );
}

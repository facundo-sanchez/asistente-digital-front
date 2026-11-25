import type { Metadata } from "next";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { requireUser } from "@/lib/server/dal";
import { EmailVerificationBanner } from "@/modules/user/components/EmailVerificationBanner";

export const metadata: Metadata = { title: "Inicio" };

/** Próximos módulos (docs/ROADMAP-MODULOS.md). Se reemplaza por el dashboard real en el módulo 7. */
const UPCOMING = [
  { title: "Servicios", text: "Registrá luz, gas, internet y demás servicios." },
  { title: "Obligaciones", text: "Vencimientos y pagos en un solo lugar." },
  { title: "Tarjetas", text: "Resúmenes, consumos y cuotas pendientes." },
];

export default async function DashboardPage() {
  const user = await requireUser();
  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
        Hola, {user.name}
      </Typography>
      {!user.emailVerified && <EmailVerificationBanner email={user.email} />}
      <Grid container spacing={2}>
        {UPCOMING.map((item) => (
          <Grid key={item.title} size={{ xs: 12, sm: 6, lg: 4 }}>
            <Paper variant="outlined" sx={{ p: 3, height: "100%" }}>
              <Typography variant="overline" color="text.secondary">
                Próximamente
              </Typography>
              <Typography variant="h6">{item.title}</Typography>
              <Typography color="text.secondary">{item.text}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

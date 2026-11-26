import type { Metadata } from "next";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import type { DetectedEmailResponse, IntegrationResponse, PageResponse } from "@/types/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { firstParam, type SearchParams } from "@/lib/search-params";
import { serverGet } from "@/lib/server/server-get";
import { ConnectGmail } from "@/modules/integrations/components/ConnectGmail";
import { DetectedEmails } from "@/modules/integrations/components/DetectedEmails";
import { GmailAccount } from "@/modules/integrations/components/GmailAccount";

export const metadata: Metadata = { title: "Integraciones" };

/** Resultado de la vuelta desde Google (?gmail=). */
const RESULTS: Record<string, { severity: "success" | "info" | "error"; text: string }> = {
  connected: { severity: "success", text: "¡Listo! Conectamos tu Gmail. En unos minutos vas a ver tus facturas en «Para revisar»." },
  cancelled: { severity: "info", text: "No conectamos Gmail: cancelaste o no diste el permiso." },
  failed: { severity: "error", text: "No pudimos conectar Gmail. Probá de nuevo." },
  unavailable: { severity: "error", text: "Conectar Gmail no está disponible en este momento." },
};

export default async function IntegrationsPage({ searchParams }: { searchParams: SearchParams }) {
  const result = RESULTS[firstParam((await searchParams).gmail) ?? ""];
  const integrations = (await serverGet<IntegrationResponse[]>("/integrations")) ?? [];
  const gmail = integrations.filter((i) => i.provider === "GMAIL");
  const detected = await Promise.all(
    gmail.map((i) =>
      serverGet<PageResponse<DetectedEmailResponse>>(`/integrations/${i.id}/emails?size=20`).then((page) => page?.content ?? []),
    ),
  );

  return (
    <Stack spacing={4} sx={{ maxWidth: 900 }}>
      <PageHeader title="Integraciones" description="Conectá tu correo y las facturas de tus servicios se cargan solas." />
      {result && <Alert severity={result.severity}>{result.text}</Alert>}
      <Panel title="Gmail" description="Facturas de luz, gas, internet y resúmenes de tarjeta que te llegan por email.">
        {gmail.length === 0 ? (
          <ConnectGmail />
        ) : (
          <Stack spacing={4}>
            {gmail.map((integration) => (
              <GmailAccount key={integration.id} integration={integration} />
            ))}
          </Stack>
        )}
      </Panel>
      {gmail.map((integration, index) => (
        <Panel
          key={integration.id}
          title="Detectado en tu correo"
          description={`Los últimos 20 correos de tus proveedores en ${integration.externalAccountId} y qué hicimos con cada uno.`}
        >
          <DetectedEmails emails={detected[index]} />
        </Panel>
      ))}
    </Stack>
  );
}

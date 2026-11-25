import type { Metadata } from "next";
import Stack from "@mui/material/Stack";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { ServiceForm } from "@/modules/services/components/ServiceForm";

export const metadata: Metadata = { title: "Agregar servicio" };

export default function NewServicePage() {
  return (
    <Stack spacing={4} sx={{ maxWidth: 720 }}>
      <PageHeader title="Agregar servicio" description="Registrá un servicio para seguir sus facturas y vencimientos." />
      <Panel title="Datos del servicio">
        <ServiceForm />
      </Panel>
    </Stack>
  );
}

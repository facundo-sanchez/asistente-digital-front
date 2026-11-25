import type { Metadata } from "next";
import Stack from "@mui/material/Stack";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { DocumentUploadForm } from "@/modules/documents/components/DocumentUploadForm";

export const metadata: Metadata = { title: "Subir documento" };

export default function NewDocumentPage() {
  return (
    <Stack spacing={4} sx={{ maxWidth: 720 }}>
      <PageHeader title="Subir documento" description="Facturas, comprobantes, pólizas y otros papeles importantes." />
      <Panel title="Archivo">
        <DocumentUploadForm />
      </Panel>
    </Stack>
  );
}

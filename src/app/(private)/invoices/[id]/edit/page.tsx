import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Stack from "@mui/material/Stack";
import type { InvoiceResponse, PageResponse, ServiceResponse } from "@/types/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { serverGet } from "@/lib/server/server-get";
import { isUuid } from "@/lib/uuid";
import { InvoiceForm } from "@/modules/invoices/components/InvoiceForm";

export const metadata: Metadata = { title: "Editar factura" };

export default async function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const [invoice, services] = await Promise.all([
    serverGet<InvoiceResponse>(`/invoices/${id}`),
    serverGet<PageResponse<ServiceResponse>>("/services?size=100"),
  ]);
  if (!invoice) notFound();
  if (invoice.status === "REJECTED") redirect(`/invoices/${id}`);

  return (
    <Stack spacing={4} sx={{ maxWidth: 720 }}>
      <PageHeader title="Editar factura" description="Los cambios se copian a su vencimiento." />
      <Panel title="Datos de la factura">
        <InvoiceForm invoice={invoice} services={(services?.content ?? []).map(({ id, name }) => ({ id, name }))} />
      </Panel>
    </Stack>
  );
}

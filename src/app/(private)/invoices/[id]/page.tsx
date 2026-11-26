import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import ArrowBackOutlined from "@mui/icons-material/ArrowBackOutlined";
import type { InvoiceResponse } from "@/types/api";
import { ButtonLink } from "@/components/common/ButtonLink";
import { TextLink } from "@/components/common/TextLink";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { firstParam, type SearchParams } from "@/lib/search-params";
import { serverGet } from "@/lib/server/server-get";
import { isUuid } from "@/lib/uuid";
import { InvoiceDetails } from "@/modules/invoices/components/InvoiceDetails";
import { InvoiceRejectAction } from "@/modules/invoices/components/InvoiceRejectAction";

export const metadata: Metadata = { title: "Factura" };

/** «0001-00001234 · 2026-12», o lo que haya. */
function invoiceLabel(invoice: InvoiceResponse): string {
  return [invoice.invoiceNumber, invoice.billingPeriod].filter(Boolean).join(" · ") || "Factura";
}

export default async function InvoicePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: SearchParams }) {
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const invoice = await serverGet<InvoiceResponse>(`/invoices/${id}`);
  if (!invoice) notFound();
  const updated = firstParam((await searchParams).updated) === "1";
  const rejected = invoice.status === "REJECTED";
  // Con pagos en su vencimiento no se edita ni anula (el backend también lo impide)
  const locked = invoice.obligationStatus === "PAID" || invoice.obligationStatus === "PARTIALLY_PAID";

  return (
    <Stack spacing={4} sx={{ maxWidth: 900 }}>
      <Box>
        <TextLink href="/invoices" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, mb: 2, color: "text.secondary" }}>
          <ArrowBackOutlined fontSize="small" />
          Facturas
        </TextLink>
        <PageHeader
          title={`${invoice.serviceName} · ${invoiceLabel(invoice)}`}
          description={rejected ? "Anulada" : undefined}
          action={
            !rejected &&
            !locked && (
              <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: "wrap" }}>
                <ButtonLink href={`/invoices/${invoice.id}/edit`} variant="outlined">
                  Editar
                </ButtonLink>
                <InvoiceRejectAction id={invoice.id} />
              </Stack>
            )
          }
        />
      </Box>
      {updated && <Alert severity="success">Guardamos los cambios. Su vencimiento quedó actualizado.</Alert>}
      {rejected && <Alert severity="info">Esta factura está anulada y su vencimiento, cancelado.</Alert>}
      {locked && !rejected && (
        <Alert severity="info">Su vencimiento tiene pagos: para corregir o anular la factura, primero anulá los pagos.</Alert>
      )}
      <Panel title="Datos de la factura">
        <InvoiceDetails invoice={invoice} />
      </Panel>
    </Stack>
  );
}

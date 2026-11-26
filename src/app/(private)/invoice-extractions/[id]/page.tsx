import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import ArrowBackOutlined from "@mui/icons-material/ArrowBackOutlined";
import type { InvoiceReviewResponse, PageResponse, ServiceResponse } from "@/types/api";
import { ButtonLink } from "@/components/common/ButtonLink";
import { TextLink } from "@/components/common/TextLink";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { serverGet } from "@/lib/server/server-get";
import { isUuid } from "@/lib/uuid";
import { InvoiceReviewForm } from "@/modules/invoice-extraction/components/InvoiceReviewForm";

export const metadata: Metadata = { title: "Revisar factura" };

export default async function ReviewInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const [review, services] = await Promise.all([
    serverGet<InvoiceReviewResponse>(`/invoice-extractions/${id}`),
    serverGet<PageResponse<ServiceResponse>>("/services?size=100"),
  ]);
  if (!review) notFound();

  return (
    <Stack spacing={4} sx={{ maxWidth: 720 }}>
      <Box>
        <TextLink href={`/documents/${review.documentId}`} sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, mb: 2, color: "text.secondary" }}>
          <ArrowBackOutlined fontSize="small" />
          Documento
        </TextLink>
        <PageHeader title="Revisar factura leída con IA" description="Revisá los datos: nada se guarda hasta que confirmes." />
      </Box>
      {review.status === "PENDING" ? (
        <Panel title="Datos de la factura">
          <InvoiceReviewForm review={review} services={(services?.content ?? []).map(({ id, name }) => ({ id, name }))} />
        </Panel>
      ) : (
        <Alert severity="info" action={review.invoiceId && <ButtonLink href={`/invoices/${review.invoiceId}`} size="small">Ver factura</ButtonLink>}>
          {review.status === "REJECTED" ? "Esta propuesta fue descartada." : "Esta propuesta ya se confirmó."}
        </Alert>
      )}
    </Stack>
  );
}

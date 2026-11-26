import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import ArrowBackOutlined from "@mui/icons-material/ArrowBackOutlined";
import type { CardStatementResponse, DocumentResponse, InvoiceResponse, ObligationResponse, PageResponse, ServiceResponse } from "@/types/api";
import { ButtonLink } from "@/components/common/ButtonLink";
import { TextLink } from "@/components/common/TextLink";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { firstParam, type SearchParams } from "@/lib/search-params";
import { requireUser } from "@/lib/server/dal";
import { serverGet } from "@/lib/server/server-get";
import { isUuid } from "@/lib/uuid";
import { paymentTarget } from "@/lib/wallets";
import { ServiceDocumentsPanel } from "@/modules/documents/components/ServiceDocumentsPanel";
import { ObligationCancelAction } from "@/modules/obligations/components/ObligationCancelAction";
import { RecurrencePanel } from "@/modules/obligations/components/RecurrencePanel";
import { ObligationDetails } from "@/modules/obligations/components/ObligationDetails";
import { PaymentsPanel } from "@/modules/payments/components/PaymentsPanel";
import { RegisterPaymentAction } from "@/modules/payments/components/RegisterPaymentAction";

export const metadata: Metadata = { title: "Vencimiento" };

/** Código de pago de su factura y a dónde pagarla; null si no hay factura, código o ya no se paga. */
async function invoicePayment(obligation: ObligationResponse) {
  const open = obligation.effectiveStatus !== "PAID" && obligation.effectiveStatus !== "CANCELLED";
  if (!obligation.invoiceId || !open) return null;
  const invoice = await serverGet<InvoiceResponse>(`/invoices/${obligation.invoiceId}`);
  if (!invoice?.paymentCode) return null;
  const [service, user] = await Promise.all([serverGet<ServiceResponse>(`/services/${invoice.serviceId}`), requireUser()]);
  return { code: invoice.paymentCode, target: paymentTarget(service, user.paymentWallet) };
}

export default async function ObligationPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: SearchParams }) {
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const [obligation, documents] = await Promise.all([
    serverGet<ObligationResponse>(`/obligations/${id}`),
    // shortcut: comprobantes entre los 100 documentos más nuevos; con más, buscar al tipear
    serverGet<PageResponse<DocumentResponse>>("/documents?size=100"),
  ]);
  if (!obligation) notFound();
  // Si salió de un resumen de tarjeta, enlace a él
  const statement = obligation.obligationType === "CREDIT_CARD_PAYMENT"
    ? await serverGet<CardStatementResponse>(`/card-statements?obligationId=${obligation.id}`)
    : null;
  const payment = await invoicePayment(obligation);
  const receipts =(documents?.content ?? []).map((d) => ({ id: d.id, name: d.title ?? d.originalFilename }));
  const query = await searchParams;
  const notice = firstParam(query.invoice) === "1"
    ? "Cargamos la factura y creamos su vencimiento. Cuando la pagues, registrá el pago acá."
    : firstParam(query.created) === "1"
    ? "Registramos el vencimiento."
    : firstParam(query.updated) === "1"
      ? "Guardamos los cambios."
      : null;
  const editable = obligation.status !== "PAID" && obligation.status !== "CANCELLED";

  return (
    <Stack spacing={4} sx={{ maxWidth: 900 }}>
      <Box>
        <TextLink href="/obligations" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, mb: 2, color: "text.secondary" }}>
          <ArrowBackOutlined fontSize="small" />
          Vencimientos
        </TextLink>
        <PageHeader
          title={obligation.title}
          description={obligation.serviceName ?? undefined}
          action={
            editable && (
              <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: "wrap" }}>
                <RegisterPaymentAction obligation={obligation} receipts={receipts} />
                <ButtonLink href={`/obligations/${obligation.id}/edit`} variant="outlined">
                  Editar
                </ButtonLink>
                {/* Con pagos vigentes no se cancela: primero se anulan */}
                {obligation.paidAmount === 0 && <ObligationCancelAction id={obligation.id} title={obligation.title} />}
              </Stack>
            )
          }
        />
      </Box>
      {notice && <Alert severity="success">{notice}</Alert>}
      <Panel title="Datos del vencimiento">
        <ObligationDetails obligation={obligation} statementId={statement?.id} payment={payment} />
      </Panel>
      <PaymentsPanel obligation={obligation} receipts={receipts} />
      {obligation.recurrenceId && <RecurrencePanel ruleId={obligation.recurrenceId} />}
      {/* CU-005: los documentos asociados llegan por su servicio (facturas, pólizas) */}
      {obligation.serviceId && <ServiceDocumentsPanel serviceId={obligation.serviceId} />}
    </Stack>
  );
}

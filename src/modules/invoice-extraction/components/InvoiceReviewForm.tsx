"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import * as yup from "yup";
import { FormTextField } from "@/components/forms/FormTextField";
import { ApiError } from "@/lib/api/api-error";
import { applyApiErrors } from "@/lib/api/form-errors";
import { InvoiceDuplicateWarning } from "@/modules/invoices/components/InvoiceDuplicateWarning";
import { invoiceSchema } from "@/modules/invoices/validation";
import { OBLIGATION_CURRENCIES, parseAmount } from "@/modules/obligations/validation";
import { invoiceExtractionsApi } from "../api";
import type { InvoiceReviewProps } from "./invoice-review-props";

/** La misma validación que la carga manual, con el servicio como id (select) en vez de autocompletado. */
const reviewSchema = invoiceSchema
  .omit(["service", "documentId"])
  .shape({ serviceId: yup.string().required("Elegí el servicio de la factura") });
type ReviewValues = yup.InferType<typeof reviewSchema>;

const dateSlot = { inputLabel: { shrink: true } };

/** Alta del servicio que falta; al guardar vuelve a esta revisión. */
function newServiceHref(extractionId: string, providerId: string | null, customerReference: string | null): string {
  const params = new URLSearchParams({ next: `/invoice-extractions/${extractionId}` });
  if (providerId) params.set("providerId", providerId);
  if (customerReference) params.set("customerReference", customerReference);
  return `/services/new?${params}`;
}

/** Los datos de la factura leídos por la IA, editables, para confirmarla. */
export function InvoiceReviewForm({ review, services }: InvoiceReviewProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const i = review.invoice;
  const { control, handleSubmit, setError, formState } = useForm<ReviewValues>({
    resolver: yupResolver(reviewSchema),
    defaultValues: {
      serviceId: review.suggestedServiceId ?? "",
      invoiceNumber: i.invoiceNumber ?? "",
      billingPeriod: i.billingPeriod ?? "",
      issueDate: i.issueDate ?? "",
      dueDate: i.dueDate ?? "",
      totalAmount: i.totalAmount === null ? "" : String(i.totalAmount).replace(".", ","),
      currency: i.currency === "USD" ? "USD" : "ARS",
      paymentCode: i.paymentCode ?? "",
    },
  });
  const [serviceId, number, period, amount] = useWatch({ control, name: ["serviceId", "invoiceNumber", "billingPeriod", "totalAmount"] });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const invoice = await invoiceExtractionsApi.confirm(review.extractionId, {
        serviceId: values.serviceId,
        invoiceNumber: values.invoiceNumber || null,
        billingPeriod: values.billingPeriod || null,
        issueDate: values.issueDate || null,
        dueDate: values.dueDate,
        totalAmount: parseAmount(values.totalAmount)!,
        currency: values.currency,
        paymentCode: values.paymentCode || null,
      });
      router.push(invoice.obligationId ? `/obligations/${invoice.obligationId}?invoice=1` : `/invoices/${invoice.id}`);
      router.refresh();
    } catch (e) {
      setFormError(applyApiErrors(e, setError));
    }
  });

  const reject = async () => {
    setRejecting(true);
    try {
      await invoiceExtractionsApi.reject(review.extractionId);
      router.push(`/documents/${review.documentId}`);
      router.refresh();
    } catch (e) {
      setFormError(e instanceof ApiError && e.data?.mensaje ? e.data.mensaje : "No pudimos descartarla. Probá de nuevo.");
      setRejecting(false);
    }
  };

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <Stack spacing={3}>
        {formError && <Alert severity="error">{formError}</Alert>}
        {review.warnings.map((warning) => (
          <Alert key={warning} severity="warning">
            {warning}
          </Alert>
        ))}

        <FormTextField<ReviewValues>
          name="serviceId"
          control={control}
          label="Servicio"
          select
          required
          helperText={i.provider ? `La IA leyó: ${i.provider}${i.customerReference ? ` · cliente ${i.customerReference}` : ""}` : undefined}
        >
          {services.map((service) => (
            <MenuItem key={service.id} value={service.id}>
              {service.name}
            </MenuItem>
          ))}
        </FormTextField>
        {(services.length === 0 || (!review.suggestedServiceId && review.suggestedProviderId)) && (
          <Alert severity="info">
            {services.length === 0 ? "No tenés servicios registrados. " : "¿Es un servicio nuevo? "}
            <NextLink href={newServiceHref(review.extractionId, review.suggestedProviderId, i.customerReference)}>Registralo acá</NextLink>
            {review.suggestedProviderId ? " con el proveedor y el nro. de cliente ya completos" : ""}: después volvés a esta revisión.
          </Alert>
        )}

        <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
          <FormTextField<ReviewValues> name="invoiceNumber" control={control} label="Número (opcional)" />
          <FormTextField<ReviewValues> name="billingPeriod" control={control} label="Período (opcional)" />
          <FormTextField<ReviewValues>
            name="totalAmount"
            control={control}
            label="Importe"
            required
            slotProps={{ htmlInput: { inputMode: "decimal" } }}
          />
          <FormTextField<ReviewValues> name="currency" control={control} label="Moneda" select>
            {OBLIGATION_CURRENCIES.map((currency) => (
              <MenuItem key={currency} value={currency}>
                {currency === "ARS" ? "Pesos (ARS)" : "Dólares (USD)"}
              </MenuItem>
            ))}
          </FormTextField>
          <FormTextField<ReviewValues> name="issueDate" control={control} label="Emitida (opcional)" type="date" slotProps={dateSlot} />
          <FormTextField<ReviewValues> name="dueDate" control={control} label="Vence" type="date" required slotProps={dateSlot} />
        </Box>
        <FormTextField<ReviewValues> name="paymentCode" control={control} label="Código de pago (opcional)" />

        <InvoiceDuplicateWarning
          serviceId={serviceId || undefined}
          invoiceNumber={number ?? ""}
          billingPeriod={period ?? ""}
          totalAmount={amount ?? ""}
        />

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button type="submit" variant="contained" size="large" loading={formState.isSubmitting} disabled={rejecting}>
            Confirmar factura
          </Button>
          <Button onClick={reject} size="large" color="inherit" loading={rejecting} disabled={formState.isSubmitting}>
            Descartar
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}

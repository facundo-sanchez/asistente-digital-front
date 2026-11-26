"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
import { statementSchema } from "@/modules/card-statements/validation";
import { parseAmount } from "@/modules/obligations/validation";
import { extractionsApi } from "../api";
import type { StatementReviewProps } from "./statement-review-props";

const reviewSchema = statementSchema.shape({ cardId: yup.string().required("Elegí la tarjeta del resumen") });
type ReviewValues = yup.InferType<typeof reviewSchema>;

const dateSlot = { inputLabel: { shrink: true } };
const amountSlot = { htmlInput: { inputMode: "decimal" as const, autoComplete: "off" } };
const asText = (value: number | null) => (value === null ? "" : String(value).replace(".", ","));

/**
 * Los datos que leyó la IA, editables, para confirmar el resumen. Lo que el archivo no trae
 * (ej. el vencimiento en la planilla de BBVA) se completa acá.
 */
export function StatementReviewForm({ review, cards }: StatementReviewProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const s = review.statement;
  const { control, handleSubmit, setError, formState } = useForm<ReviewValues>({
    resolver: yupResolver(reviewSchema),
    defaultValues: {
      cardId: review.suggestedCardId ?? "",
      closingDate: s.closingDate ?? "",
      dueDate: s.dueDate ?? "",
      totalAmount: asText(s.totalAmount),
      totalAmountUsd: asText(s.totalAmountUsd),
      minimumPayment: asText(s.minimumPayment),
      nextClosingDate: s.nextClosingDate ?? "",
      nextDueDate: s.nextDueDate ?? "",
      documentId: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const statement = await extractionsApi.confirm(review.extractionId, {
        cardId: values.cardId,
        closingDate: values.closingDate || null,
        dueDate: values.dueDate,
        nextClosingDate: values.nextClosingDate || null,
        nextDueDate: values.nextDueDate || null,
        totalAmount: parseAmount(values.totalAmount) ?? 0,
        totalAmountUsd: parseAmount(values.totalAmountUsd) ?? 0,
        minimumPayment: parseAmount(values.minimumPayment),
      });
      router.push(`/card-statements/${statement.id}?created=1`);
      router.refresh();
    } catch (e) {
      setFormError(applyApiErrors(e, setError));
    }
  });

  const reject = async () => {
    setRejecting(true);
    try {
      await extractionsApi.reject(review.extractionId);
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

        <FormTextField<ReviewValues> name="cardId" control={control} label="Tarjeta" select required>
          {cards.map((card) => (
            <MenuItem key={card.id} value={card.id}>
              {card.name}
            </MenuItem>
          ))}
        </FormTextField>
        {cards.length === 0 && (
          <Alert severity="info">
            No tenés tarjetas registradas. <NextLink href="/cards/new">Registrá la tarjeta</NextLink> y volvé a esta revisión desde el documento.
          </Alert>
        )}

        <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
          <FormTextField<ReviewValues> name="closingDate" control={control} label="Cierre (opcional)" type="date" slotProps={dateSlot} />
          <FormTextField<ReviewValues> name="dueDate" control={control} label="Vencimiento" type="date" required slotProps={dateSlot} />
          <FormTextField<ReviewValues> name="totalAmount" control={control} label="Total en pesos" slotProps={amountSlot} />
          <FormTextField<ReviewValues> name="totalAmountUsd" control={control} label="Total en dólares" slotProps={amountSlot} />
          <FormTextField<ReviewValues> name="minimumPayment" control={control} label="Pago mínimo (opcional)" slotProps={amountSlot} />
          <FormTextField<ReviewValues> name="nextDueDate" control={control} label="Próximo vencimiento (opcional)" type="date" slotProps={dateSlot} />
          <FormTextField<ReviewValues> name="nextClosingDate" control={control} label="Próximo cierre (opcional)" type="date" slotProps={dateSlot} />
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button type="submit" variant="contained" size="large" loading={formState.isSubmitting} disabled={rejecting}>
            Confirmar resumen
          </Button>
          <Button onClick={reject} size="large" color="inherit" loading={rejecting} disabled={formState.isSubmitting}>
            Descartar
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}

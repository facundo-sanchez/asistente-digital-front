"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { CardStatementRequest } from "@/types/api";
import { FormTextField } from "@/components/forms/FormTextField";
import { applyApiErrors } from "@/lib/api/form-errors";
import { DocumentPicker } from "@/modules/documents/components/DocumentPicker";
import { parseAmount } from "@/modules/obligations/validation";
import { cardStatementsApi } from "../api";
import { statementSchema, type StatementFormValues } from "../validation";
import type { StatementFormProps } from "./statement-form-props";

const dateSlot = { inputLabel: { shrink: true } };
const amountSlot = { htmlInput: { inputMode: "decimal" as const, autoComplete: "off" } };
const asText = (value: number | null) => (value === null ? "" : String(value).replace(".", ","));

/** Del formulario al contrato del backend: importes vacíos valen 0, fechas vacías viajan como null. */
function toRequest(cardId: string, values: StatementFormValues): CardStatementRequest {
  return {
    cardId,
    closingDate: values.closingDate || null,
    dueDate: values.dueDate,
    totalAmount: parseAmount(values.totalAmount) ?? 0,
    totalAmountUsd: parseAmount(values.totalAmountUsd) ?? 0,
    minimumPayment: parseAmount(values.minimumPayment),
    nextClosingDate: values.nextClosingDate || null,
    nextDueDate: values.nextDueDate || null,
    documentId: values.documentId || null,
  };
}

/**
 * Cargar o corregir un resumen con las fechas y totales que informa el banco. Al guardar queda
 * confirmado y genera un vencimiento por moneda con saldo.
 */
export function StatementForm({ card, statement, documents }: StatementFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const { control, handleSubmit, setError, formState } = useForm<StatementFormValues>({
    resolver: yupResolver(statementSchema),
    defaultValues: {
      closingDate: statement?.closingDate ?? "",
      dueDate: statement?.dueDate ?? "",
      totalAmount: statement ? asText(statement.totalAmount) : "",
      totalAmountUsd: statement ? asText(statement.totalAmountUsd) : "",
      minimumPayment: statement ? asText(statement.minimumPayment) : "",
      nextClosingDate: statement?.nextClosingDate ?? "",
      nextDueDate: statement?.nextDueDate ?? "",
      documentId: statement?.documentId ?? "",
    },
  });
  const cancelHref = statement ? `/card-statements/${statement.id}` : `/cards/${card.id}`;

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const saved = statement
        ? await cardStatementsApi.update(statement.id, toRequest(card.id, values))
        : await cardStatementsApi.create(toRequest(card.id, values));
      router.push(`/card-statements/${saved.id}?${statement ? "updated" : "created"}=1`);
      router.refresh();
    } catch (e) {
      setFormError(applyApiErrors(e, setError));
    }
  });

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <Stack spacing={3}>
        {formError && <Alert severity="error">{formError}</Alert>}

        <Typography variant="body2" color="text.secondary">
          Copiá las fechas y los totales tal como figuran en el resumen del banco.
        </Typography>

        <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
          <FormTextField<StatementFormValues> name="closingDate" control={control} label="Cierre (opcional)" type="date" slotProps={dateSlot} />
          <FormTextField<StatementFormValues> name="dueDate" control={control} label="Vencimiento" type="date" required slotProps={dateSlot} />
          <FormTextField<StatementFormValues> name="totalAmount" control={control} label="Total en pesos" slotProps={amountSlot} />
          <FormTextField<StatementFormValues> name="totalAmountUsd" control={control} label="Total en dólares" slotProps={amountSlot} helperText="Dejalo vacío si no tenés consumos en dólares." />
          <FormTextField<StatementFormValues> name="minimumPayment" control={control} label="Pago mínimo (opcional)" slotProps={amountSlot} />
        </Box>

        <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
          <FormTextField<StatementFormValues> name="nextClosingDate" control={control} label="Próximo cierre (opcional)" type="date" slotProps={dateSlot} />
          <FormTextField<StatementFormValues> name="nextDueDate" control={control} label="Próximo vencimiento (opcional)" type="date" slotProps={dateSlot} />
        </Box>

        <Controller
          name="documentId"
          control={control}
          render={({ field }) => (
            <DocumentPicker
              label="PDF del resumen (opcional)"
              value={field.value ?? ""}
              onChange={field.onChange}
              documents={documents}
              uploadType="CARD_STATEMENT"
              serviceId={card.serviceId}
            />
          )}
        />

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button type="submit" variant="contained" size="large" loading={formState.isSubmitting}>
            {statement ? "Guardar cambios" : "Guardar resumen"}
          </Button>
          <Button component={NextLink} href={cancelHref} size="large" color="inherit">
            Cancelar
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}

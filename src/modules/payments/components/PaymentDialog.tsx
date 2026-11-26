"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import { PAYMENT_METHODS, type PaymentMethod } from "@/types/api";
import { FormTextField } from "@/components/forms/FormTextField";
import { applyApiErrors } from "@/lib/api/form-errors";
import { formatMoney } from "@/lib/money";
import { PAYMENT_METHOD_LABELS } from "@/lib/payment-methods";
import { DocumentPicker } from "@/modules/documents/components/DocumentPicker";
import { OBLIGATION_CURRENCIES, parseAmount } from "@/modules/obligations/validation";
import { paymentSchema, today, type PaymentFormValues } from "../validation";
import type { PaymentDialogProps } from "./payment-dialog-props";

/**
 * Formulario de un pago (registrar o corregir). Al guardar cierra y refresca el detalle.
 * Quien lo usa lo monta solo mientras está abierto: así cada vez arranca con initialValues.
 */
export function PaymentDialog({
  open,
  onClose,
  title,
  submitLabel,
  obligation,
  receipts,
  initialValues,
  showBalance,
  onSave,
}: PaymentDialogProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const { control, handleSubmit, setError, formState } = useForm<PaymentFormValues>({
    resolver: yupResolver(paymentSchema),
    defaultValues: initialValues,
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await onSave({
        obligationId: obligation.id,
        amount: parseAmount(values.amount)!,
        currency: values.currency,
        paymentDate: values.paymentDate,
        paymentMethod: values.paymentMethod as PaymentMethod,
        receiptDocumentId: values.receiptDocumentId || null,
        notes: values.notes || null,
      });
      onClose();
      router.refresh();
    } catch (e) {
      setFormError(applyApiErrors(e, setError));
    }
  });

  const balance = showBalance ? formatMoney(obligation.balance, obligation.currency) : null;

  return (
    <Dialog open={open} onClose={() => !formState.isSubmitting && onClose()} aria-labelledby="payment-title" fullWidth maxWidth="sm">
      <Box component="form" onSubmit={onSubmit} noValidate>
        <DialogTitle id="payment-title">{title}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            {formError && <Alert severity="error">{formError}</Alert>}
            <Box
              sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              }}
            >
              <FormTextField<PaymentFormValues>
                name="amount"
                control={control}
                label="Importe pagado"
                required
                helperText={balance ? `Saldo: ${balance}. Si pagás menos queda como pago parcial.` : undefined}
                slotProps={{
                  htmlInput: { inputMode: "decimal", autoComplete: "off" },
                }}
              />
              {/* Con importe en la obligación, la moneda es la suya */}
              <FormTextField<PaymentFormValues>
                name="currency"
                control={control}
                label="Moneda"
                select
                disabled={obligation.currency !== null}
              >
                {OBLIGATION_CURRENCIES.map((currency) => (
                  <MenuItem key={currency} value={currency}>
                    {currency === "ARS" ? "Pesos (ARS)" : "Dólares (USD)"}
                  </MenuItem>
                ))}
              </FormTextField>
              <FormTextField<PaymentFormValues>
                name="paymentDate"
                control={control}
                label="Fecha de pago"
                type="date"
                required
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: { max: today() },
                }}
              />
              <FormTextField<PaymentFormValues> name="paymentMethod" control={control} label="Medio de pago" select required>
                {PAYMENT_METHODS.map((method) => (
                  <MenuItem key={method} value={method}>
                    {PAYMENT_METHOD_LABELS[method]}
                  </MenuItem>
                ))}
              </FormTextField>
            </Box>
            <Controller
              name="receiptDocumentId"
              control={control}
              render={({ field }) => (
                <DocumentPicker
                  label="Comprobante (opcional)"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  documents={receipts}
                  uploadType="PAYMENT_RECEIPT"
                  serviceId={obligation.serviceId ?? undefined}
                />
              )}
            />
            <FormTextField<PaymentFormValues> name="notes" control={control} label="Notas (opcional)" multiline minRows={2} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={formState.isSubmitting} color="inherit">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" loading={formState.isSubmitting}>
            {submitLabel}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

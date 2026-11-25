"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
import { OBLIGATION_CURRENCIES, parseAmount } from "@/modules/obligations/validation";
import { paymentsApi } from "../api";
import { paymentSchema, today, type PaymentFormValues } from "../validation";
import type { RegisterPaymentProps } from "./register-payment-props";

/**
 * Registrar un pago (CU-006). Sugiere el saldo como importe; uno menor queda como pago parcial.
 * Al guardar refresca el detalle con el estado nuevo.
 */
export function RegisterPaymentAction({ obligation, receipts }: RegisterPaymentProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const defaults = (): PaymentFormValues => ({
    amount: obligation.balance === null ? "" : String(obligation.balance).replace(".", ","),
    currency: (obligation.currency as PaymentFormValues["currency"]) ?? "ARS",
    paymentDate: today(),
    paymentMethod: "BANK_TRANSFER",
    receiptDocumentId: "",
    notes: "",
  });
  const { control, handleSubmit, setError, reset, formState } = useForm<PaymentFormValues>({
    resolver: yupResolver(paymentSchema),
    defaultValues: defaults(),
  });

  const openDialog = () => {
    // Cada vez arranca con el saldo actual y la fecha de hoy
    reset(defaults());
    setFormError(null);
    setOpen(true);
  };

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await paymentsApi.create({
        obligationId: obligation.id,
        amount: parseAmount(values.amount)!,
        currency: values.currency,
        paymentDate: values.paymentDate,
        paymentMethod: values.paymentMethod as PaymentMethod,
        receiptDocumentId: values.receiptDocumentId || null,
        notes: values.notes || null,
      });
      setOpen(false);
      router.refresh();
    } catch (e) {
      setFormError(applyApiErrors(e, setError));
    }
  });

  const balance = formatMoney(obligation.balance, obligation.currency);

  return (
    <>
      <Button variant="contained" onClick={openDialog}>
        Registrar pago
      </Button>
      <Dialog open={open} onClose={() => !formState.isSubmitting && setOpen(false)} aria-labelledby="payment-title" fullWidth maxWidth="sm">
        <Box component="form" onSubmit={onSubmit} noValidate>
          <DialogTitle id="payment-title">Registrar pago de «{obligation.title}»</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ pt: 1 }}>
              {formError && <Alert severity="error">{formError}</Alert>}
              <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
                <FormTextField<PaymentFormValues>
                  name="amount"
                  control={control}
                  label="Importe pagado"
                  required
                  helperText={balance ? `Saldo: ${balance}. Si pagás menos queda como pago parcial.` : undefined}
                  slotProps={{ htmlInput: { inputMode: "decimal", autoComplete: "off" } }}
                />
                {/* Con importe en la obligación, la moneda es la suya */}
                <FormTextField<PaymentFormValues> name="currency" control={control} label="Moneda" select disabled={obligation.currency !== null}>
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
                  slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: today() } }}
                />
                <FormTextField<PaymentFormValues> name="paymentMethod" control={control} label="Medio de pago" select required>
                  {PAYMENT_METHODS.map((method) => (
                    <MenuItem key={method} value={method}>
                      {PAYMENT_METHOD_LABELS[method]}
                    </MenuItem>
                  ))}
                </FormTextField>
              </Box>
              <FormTextField<PaymentFormValues>
                name="receiptDocumentId"
                control={control}
                label="Comprobante (opcional)"
                select
                helperText={receipts.length === 0 ? "Subí el comprobante en Documentos para poder adjuntarlo." : undefined}
              >
                <MenuItem value="">Sin comprobante</MenuItem>
                {receipts.map((receipt) => (
                  <MenuItem key={receipt.id} value={receipt.id}>
                    {receipt.name}
                  </MenuItem>
                ))}
              </FormTextField>
              <FormTextField<PaymentFormValues> name="notes" control={control} label="Notas (opcional)" multiline minRows={2} />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} disabled={formState.isSubmitting} color="inherit">
              Cancelar
            </Button>
            <Button type="submit" variant="contained" loading={formState.isSubmitting}>
              Guardar pago
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}

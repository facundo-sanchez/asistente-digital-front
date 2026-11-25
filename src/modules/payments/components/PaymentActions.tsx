"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { ApiError } from "@/lib/api/api-error";
import { formatMoney } from "@/lib/money";
import { paymentsApi } from "../api";
import type { PaymentFormValues } from "../validation";
import { PaymentDialog } from "./PaymentDialog";
import type { PaymentActionsProps } from "./payment-actions-props";

/**
 * Corregir (anula el pago y crea el reemplazo) o anular un pago con motivo.
 * Los pagos no se borran: los anulados quedan en el historial (RN-008).
 */
export function PaymentActions({ payment, obligation, receipts }: PaymentActionsProps) {
  const router = useRouter();
  const [correcting, setCorrecting] = useState(false);
  const [voiding, setVoiding] = useState(false);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialValues: PaymentFormValues = {
    amount: String(payment.amount).replace(".", ","),
    currency: payment.currency as PaymentFormValues["currency"],
    paymentDate: payment.paymentDate,
    paymentMethod: payment.paymentMethod,
    receiptDocumentId: payment.receiptDocumentId ?? "",
    notes: payment.notes ?? "",
  };

  const openVoid = () => {
    setReason("");
    setError(null);
    setVoiding(true);
  };

  const voidPayment = async () => {
    if (!reason.trim()) {
      setError("Contá por qué lo anulás (ej. «cargado por error»).");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await paymentsApi.void(payment.id, { reason: reason.trim() });
      setVoiding(false);
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError && e.data?.mensaje ? e.data.mensaje : "No pudimos anularlo. Probá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Stack direction="row" spacing={0.5} sx={{ justifyContent: "flex-end" }}>
        <Button size="small" color="inherit" onClick={() => setCorrecting(true)}>
          Corregir
        </Button>
        <Button size="small" color="error" onClick={openVoid}>
          Anular
        </Button>
      </Stack>

      {correcting && (
        <PaymentDialog
          open
          onClose={() => setCorrecting(false)}
          title="Corregir pago"
          submitLabel="Guardar corrección"
          obligation={obligation}
          receipts={receipts}
          initialValues={initialValues}
          showBalance={false}
          onSave={(request) => paymentsApi.correct(payment.id, request)}
        />
      )}

      <Dialog open={voiding} onClose={() => !saving && setVoiding(false)} aria-labelledby={`void-${payment.id}`} fullWidth maxWidth="xs">
        <DialogTitle id={`void-${payment.id}`}>¿Anular el pago de {formatMoney(payment.amount, payment.currency)}?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>Deja de contar para el saldo, pero queda en el historial con el motivo.</DialogContentText>
          <TextField
            label="Motivo"
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            fullWidth
            autoFocus
            slotProps={{ htmlInput: { maxLength: 500 } }}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVoiding(false)} disabled={saving} color="inherit">
            Volver
          </Button>
          <Button onClick={voidPayment} loading={saving} variant="contained" color="error">
            Anular pago
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

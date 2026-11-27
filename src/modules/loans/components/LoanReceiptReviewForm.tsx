"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import type { LoanReceiptReviewResponse, LoanResponse } from "@/types/api";
import { ButtonLink } from "@/components/common/ButtonLink";
import { ApiError } from "@/lib/api/api-error";
import { loansApi } from "../api";

const text = (value: number | null) => (value == null ? "" : String(value).replace(".", ","));
const number = (value: string) => (value.trim() ? Number(value.trim().replace(/\./g, "").replace(",", ".")) : null);

/** Revisar el comprobante de pago de una cuota: préstamo, número de cuota, importe, fecha y saldo; confirmar o descartar. */
export function LoanReceiptReviewForm({ review, loans }: { review: LoanReceiptReviewResponse; loans: LoanResponse[] }) {
  const router = useRouter();
  const r = review.receipt;
  const [loanId, setLoanId] = useState(review.suggestedLoanId ?? "");
  const [installment, setInstallment] = useState(r.installmentNumber ? String(r.installmentNumber) : "");
  const [amount, setAmount] = useState(text(r.totalAmount));
  const [paymentDate, setPaymentDate] = useState(r.paymentDate ?? r.dueDate ?? "");
  const [newBalance, setNewBalance] = useState(text(r.newBalance));
  const [saving, setSaving] = useState<"confirm" | "reject" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const confirm = async () => {
    const value = number(amount);
    if (!loanId || !Number(installment) || !value || !paymentDate) {
      setError("Completá el préstamo, la cuota, el importe y la fecha de pago.");
      return;
    }
    setSaving("confirm");
    setError(null);
    try {
      const loan = await loansApi.confirmReceipt(review.extractionId, {
        loanId,
        installmentNumber: Number(installment),
        amount: value,
        paymentDate,
        newBalance: number(newBalance),
      });
      router.push(`/loans/${loan.id}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "No pudimos registrarlo. Probá de nuevo.");
    } finally {
      setSaving(null);
    }
  };

  const reject = async () => {
    setSaving("reject");
    try {
      await loansApi.reject(review.extractionId);
      router.push("/loans");
      router.refresh();
    } catch {
      setError("No pudimos descartarlo. Probá de nuevo.");
      setSaving(null);
    }
  };

  const active = loans.filter((l) => l.status === "ACTIVE" || l.id === loanId);
  const grid = { display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } } as const;
  return (
    <Stack spacing={3}>
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={grid}>
        <TextField select label="Préstamo" value={loanId} onChange={(e) => setLoanId(e.target.value)} sx={{ gridColumn: { sm: "1 / -1" } }}>
          {active.length === 0 && <MenuItem value="" disabled>No tenés préstamos cargados</MenuItem>}
          {active.map((l) => (
            <MenuItem key={l.id} value={l.id}>
              {l.name} · {l.lender}
              {l.loanNumber ? ` · ${l.loanNumber}` : ""}
            </MenuItem>
          ))}
        </TextField>
        <TextField label="Cuota" value={installment} onChange={(e) => setInstallment(e.target.value)} slotProps={{ htmlInput: { inputMode: "numeric" } }} />
        <TextField label="Importe pagado" value={amount} onChange={(e) => setAmount(e.target.value)} slotProps={{ htmlInput: { inputMode: "decimal" } }} />
        <TextField label="Fecha de pago" type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
        <TextField
          label="Nuevo saldo de capital (opcional)"
          value={newBalance}
          onChange={(e) => setNewBalance(e.target.value)}
          helperText="Lo que informa el banco después de este pago."
          slotProps={{ htmlInput: { inputMode: "decimal" } }}
        />
      </Box>
      <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
        <Button variant="contained" size="large" onClick={confirm} loading={saving === "confirm"} disabled={saving != null || !loanId}>
          Registrar el pago
        </Button>
        {!review.suggestedLoanId && (
          <ButtonLink href={`/loans/new?receipt=${review.extractionId}`} variant="outlined" size="large">
            Cargar el préstamo con estos datos
          </ButtonLink>
        )}
        <Button color="inherit" size="large" onClick={reject} loading={saving === "reject"} disabled={saving != null}>
          Descartar
        </Button>
      </Box>
    </Stack>
  );
}

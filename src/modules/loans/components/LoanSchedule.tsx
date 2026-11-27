"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { LoanResponse, ObligationResponse } from "@/types/api";
import { TextLink } from "@/components/common/TextLink";
import { desktopOnly, ledgerCell, ledgerHeadCell, ledgerTable } from "@/components/ledger/ledger-styles";
import { ApiError } from "@/lib/api/api-error";
import { formatDate } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { ObligationStatus } from "@/modules/obligations/components/ObligationStatus";
import { loansApi } from "../api";

/** Cronograma: cada cuota con su vencimiento (donde se paga) y, en las pendientes sin pagos, cambiar el importe. */
export function LoanSchedule({ loan }: { loan: LoanResponse }) {
  const router = useRouter();
  const [editing, setEditing] = useState<ObligationResponse | null>(null);
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editable = (i: ObligationResponse) => loan.status === "ACTIVE" && i.status === "PENDING" && Number(i.paidAmount) === 0;

  const save = async () => {
    if (!editing?.installmentNumber) return;
    const value = Number(amount.replace(/\./g, "").replace(",", "."));
    if (!(value > 0)) {
      setError("Poné un importe mayor a cero, ej. 584292,14");
      return;
    }
    setSaving(true);
    try {
      await loansApi.changeInstallment(loan.id, editing.installmentNumber, value);
      setEditing(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "No pudimos guardarlo. Probá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Box sx={{ overflowX: "auto" }}>
        <Box component="table" sx={ledgerTable}>
          <Box component="thead">
            <Box component="tr">
              <Box component="th" scope="col" sx={ledgerHeadCell}>Cuota</Box>
              <Box component="th" scope="col" sx={ledgerHeadCell}>Vence</Box>
              <Box component="th" scope="col" sx={{ ...ledgerHeadCell, textAlign: "right" }}>Importe</Box>
              <Box component="th" scope="col" sx={{ ...ledgerHeadCell, ...desktopOnly }}>Estado</Box>
              <Box component="th" scope="col" sx={ledgerHeadCell}><Box component="span" sx={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden" }}>Acciones</Box></Box>
            </Box>
          </Box>
          <Box component="tbody">
            {loan.installments.map((i) => (
              <Box component="tr" key={i.id}>
                <Box component="td" sx={ledgerCell} className="tabular-nums">
                  <TextLink href={`/obligations/${i.id}`} sx={{ color: "text.primary", fontWeight: 600 }}>
                    {i.installmentNumber}/{loan.installmentsCount}
                  </TextLink>
                </Box>
                <Box component="td" sx={ledgerCell} className="tabular-nums">{formatDate(i.dueDate)}</Box>
                <Box component="td" sx={{ ...ledgerCell, textAlign: "right" }} className="tabular-nums">
                  {formatMoney(i.amount, i.currency)}
                  {i.estimated && i.status === "PENDING" && (
                    <Typography component="span" variant="caption" color="text.secondary" sx={{ display: "block" }}>
                      estimado
                    </Typography>
                  )}
                </Box>
                <Box component="td" sx={{ ...ledgerCell, ...desktopOnly }}>
                  <ObligationStatus status={i.effectiveStatus} />
                </Box>
                <Box component="td" sx={{ ...ledgerCell, textAlign: "right" }}>
                  {editable(i) && (
                    <Button
                      size="small"
                      onClick={() => {
                        setEditing(i);
                        setAmount(String(i.amount ?? "").replace(".", ","));
                        setError(null);
                      }}
                    >
                      Cambiar importe
                    </Button>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Dialog open={editing != null} onClose={() => !saving && setEditing(null)} fullWidth maxWidth="xs">
        <DialogTitle>Importe de la cuota {editing?.installmentNumber}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            El que te avisó el banco. Deja de ser estimado.
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            autoFocus
            fullWidth
            label="Importe"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            slotProps={{ htmlInput: { inputMode: "decimal" } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" onClick={() => setEditing(null)} disabled={saving}>Cancelar</Button>
          <Button variant="contained" onClick={save} loading={saving}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

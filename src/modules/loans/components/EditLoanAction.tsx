"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import type { LoanResponse } from "@/types/api";
import { ApiError } from "@/lib/api/api-error";
import { loansApi } from "../api";

/** Editar los datos que no cambian el cronograma; entre ellos, la referencia de los avisos del banco (13.5). */
export function EditLoanAction({ loan }: { loan: LoanResponse }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({
    lender: loan.lender,
    name: loan.name,
    loanNumber: loan.loanNumber ?? "",
    shortReference: loan.shortReference ?? "",
    notes: loan.notes ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await loansApi.update(loan.id, {
        lender: values.lender,
        name: values.name,
        loanNumber: values.loanNumber || null,
        shortReference: values.shortReference || null,
        notes: values.notes || null,
        principal: loan.principal,
        rateType: loan.rateType,
        annualRate: loan.annualRate,
        disbursementDate: loan.disbursementDate,
        contractDocumentId: loan.contractDocumentId,
      });
      setOpen(false);
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "No pudimos guardarlo. Probá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Button color="inherit" onClick={() => setOpen(true)}>
        Editar
      </Button>
      <Dialog open={open} onClose={() => !saving && setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Editar préstamo</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField label="Entidad" value={values.lender} onChange={set("lender")} required />
            <TextField label="Nombre" value={values.name} onChange={set("name")} required />
            <TextField label="Número de préstamo" value={values.loanNumber} onChange={set("loanNumber")} />
            <TextField
              label="Referencia en los avisos del banco"
              value={values.shortReference}
              onChange={set("shortReference")}
              placeholder="203/2"
              helperText="Como aparece en el email del banco (ej. «su préstamo personal 203/2»). Con un solo préstamo del banco se completa sola."
            />
            <TextField label="Notas" value={values.notes} onChange={set("notes")} multiline minRows={2} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" onClick={() => setOpen(false)} disabled={saving}>Cancelar</Button>
          <Button variant="contained" onClick={save} loading={saving}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

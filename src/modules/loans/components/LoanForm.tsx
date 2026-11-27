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
import Typography from "@mui/material/Typography";
import type { CurrencyCode, LoanRateType } from "@/types/api";
import { FormTextField } from "@/components/forms/FormTextField";
import { applyApiErrors } from "@/lib/api/form-errors";
import { formatDate } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { parseAmount } from "@/modules/obligations/validation";
import { loansApi } from "../api";
import { schedulePreview } from "../schedule";
import { loanSchema, type LoanFormValues } from "../validation";

const EMPTY: LoanFormValues = {
  lender: "",
  name: "Préstamo personal",
  loanNumber: "",
  currency: "ARS",
  principal: "",
  rateType: "",
  annualRate: "",
  installmentsCount: 12,
  installmentAmount: "",
  firstDueDate: "",
  paidInstallments: 0,
  notes: "",
};

/** Alta de un préstamo: los datos del préstamo y del cronograma, con la vista previa de las cuotas antes de guardar. */
export function LoanForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const { control, handleSubmit, setError, formState } = useForm<LoanFormValues>({ resolver: yupResolver(loanSchema), defaultValues: EMPTY });
  const [count, amount, first, paid, currency] = useWatch({
    control,
    name: ["installmentsCount", "installmentAmount", "firstDueDate", "paidInstallments", "currency"],
  });
  const preview = schedulePreview(first ?? "", Number(count), parseAmount(amount ?? ""), Number(paid));

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const loan = await loansApi.create({
        lender: values.lender,
        name: values.name,
        loanNumber: values.loanNumber || null,
        currency: values.currency as CurrencyCode,
        principal: parseAmount(values.principal),
        rateType: (values.rateType || null) as LoanRateType | null,
        annualRate: parseAmount(values.annualRate),
        installmentsCount: values.installmentsCount,
        installmentAmount: parseAmount(values.installmentAmount) ?? 0,
        firstDueDate: values.firstDueDate,
        paidInstallments: values.paidInstallments,
        notes: values.notes || null,
      });
      router.push(`/loans/${loan.id}?created=1`);
      router.refresh();
    } catch (e) {
      setFormError(applyApiErrors(e, setError));
    }
  });

  const grid = { display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } } as const;
  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <Stack spacing={3}>
        {formError && <Alert severity="error">{formError}</Alert>}
        <Box sx={grid}>
          <FormTextField<LoanFormValues> name="lender" control={control} label="Entidad" placeholder="BBVA" required />
          <FormTextField<LoanFormValues> name="name" control={control} label="Nombre" required />
          <FormTextField<LoanFormValues>
            name="loanNumber"
            control={control}
            label="Número de préstamo (opcional)"
            helperText="Figura en el comprobante del banco. Sirve para reconocer sus comprobantes de pago."
          />
          <FormTextField<LoanFormValues> name="currency" control={control} label="Moneda" select required>
            <MenuItem value="ARS">Pesos (ARS)</MenuItem>
            <MenuItem value="USD">Dólares (USD)</MenuItem>
          </FormTextField>
          <FormTextField<LoanFormValues> name="principal" control={control} label="Monto pedido (opcional)" slotProps={{ htmlInput: { inputMode: "decimal" } }} />
          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "1fr 1fr" }}>
            <FormTextField<LoanFormValues> name="rateType" control={control} label="Tasa" select>
              <MenuItem value="">Sin dato</MenuItem>
              <MenuItem value="FIXED">Fija</MenuItem>
              <MenuItem value="VARIABLE">Variable</MenuItem>
            </FormTextField>
            <FormTextField<LoanFormValues> name="annualRate" control={control} label="TNA %" slotProps={{ htmlInput: { inputMode: "decimal" } }} />
          </Box>
        </Box>

        <Typography variant="h3" sx={{ fontSize: "1rem", fontWeight: 700, pt: 1 }}>
          Cuotas
        </Typography>
        <Box sx={grid}>
          <FormTextField<LoanFormValues> name="installmentsCount" control={control} label="Cantidad de cuotas" type="number" required />
          <FormTextField<LoanFormValues>
            name="installmentAmount"
            control={control}
            label="Importe de la cuota"
            required
            helperText="El de una cuota reciente. Cada comprobante o aviso del banco lo reemplaza por el real."
            slotProps={{ htmlInput: { inputMode: "decimal" } }}
          />
          <FormTextField<LoanFormValues>
            name="firstDueDate"
            control={control}
            label="Vencimiento de la primera cuota"
            type="date"
            required
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <FormTextField<LoanFormValues>
            name="paidInstallments"
            control={control}
            label="Cuotas que ya pagaste"
            type="number"
            helperText="Si el préstamo ya está en curso: quedan registradas como pagadas."
          />
        </Box>

        {preview && (
          <Alert severity="info" icon={false} className="tabular-nums">
            Primera cuota el {formatDate(preview.first)}, última el {formatDate(preview.last)}. Total estimado:{" "}
            <strong>{formatMoney(preview.total, currency ?? "ARS")}</strong> en {count} cuotas
            {Number(paid) > 0 ? `, ${preview.pending} pendientes` : ""}.
          </Alert>
        )}

        <FormTextField<LoanFormValues> name="notes" control={control} label="Notas (opcional)" multiline minRows={2} />

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button type="submit" variant="contained" size="large" loading={formState.isSubmitting}>
            Guardar préstamo
          </Button>
          <Button component={NextLink} href="/loans" size="large" color="inherit">
            Cancelar
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}

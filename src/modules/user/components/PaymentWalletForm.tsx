"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { PAYMENT_WALLETS, type PaymentWallet } from "@/types/api";
import { WALLETS } from "@/lib/wallets";
import { userApi } from "@/modules/auth/api";

/** Billetera con la que se pagan las facturas (botón Pagar de la factura). */
export function PaymentWalletForm({ initial }: { initial: PaymentWallet | null }) {
  const [wallet, setWallet] = useState<PaymentWallet | "">(initial ?? "");
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<"saved" | "error" | null>(null);

  const save = async () => {
    setSaving(true);
    try {
      await userApi.setPaymentWallet({ paymentWallet: wallet || null });
      setResult("saved");
    } catch {
      setResult("error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack spacing={2.5}>
      <TextField
        select
        label="Billetera para pagar facturas"
        value={wallet}
        onChange={(e) => {
          setWallet(e.target.value as PaymentWallet | "");
          setResult(null);
        }}
      >
        <MenuItem value="">Ninguna</MenuItem>
        {PAYMENT_WALLETS.map((w) => (
          <MenuItem key={w} value={w}>
            {WALLETS[w].name}
          </MenuItem>
        ))}
      </TextField>
      {result === "saved" && (
        <Alert severity="success">{wallet ? `Listo, vas a pagar con ${WALLETS[wallet].name}.` : "Listo, sin billetera."}</Alert>
      )}
      {result === "error" && <Alert severity="error">No pudimos guardarla. Probá de nuevo.</Alert>}
      <Box>
        <Button variant="contained" onClick={save} loading={saving}>
          Guardar
        </Button>
      </Box>
    </Stack>
  );
}

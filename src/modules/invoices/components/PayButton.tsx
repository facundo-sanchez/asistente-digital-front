"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import OpenInNewOutlined from "@mui/icons-material/OpenInNewOutlined";
import type { PaymentTarget } from "@/lib/wallets";

/** RP-6: copia el código de pago y abre donde se paga, en otra pestaña. */
export function PayButton({ code, target }: { code: string; target: PaymentTarget }) {
  const [message, setMessage] = useState<string | null>(null);

  const pay = async () => {
    // La pestaña se abre primero: después de un await el navegador puede bloquearla
    window.open(target.url, "_blank", "noopener,noreferrer");
    try {
      await navigator.clipboard.writeText(code);
      setMessage(`Código copiado. Pegalo en ${target.name} y, cuando pagues, registrá el pago.`);
    } catch {
      setMessage(`No pudimos copiar el código: copialo a mano y pegalo en ${target.name}.`);
    }
  };

  return (
    <>
      <Button size="small" variant="contained" endIcon={<OpenInNewOutlined fontSize="small" />} onClick={pay}>
        {target.label}
      </Button>
      {message && (
        <Typography component="span" variant="body2" color="text.secondary" role="status" sx={{ flexBasis: "100%" }}>
          {message}
        </Typography>
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";

/** Copia un texto al portapapeles (ej. el código de pago) y confirma con "Copiado". */
export function CopyButton({ text, label = "Copiar" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Sin permiso de portapapeles: el texto sigue visible para copiarlo a mano
    }
  };

  return (
    <Button size="small" startIcon={<ContentCopyOutlined fontSize="small" />} onClick={copy} aria-live="polite">
      {copied ? "Copiado" : label}
    </Button>
  );
}

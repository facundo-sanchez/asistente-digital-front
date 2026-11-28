"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";

/** Copia con un textarea oculto y execCommand (obsoleto, pero el único camino fuera de https). */
function copyWithSelection(text: string): boolean {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  const ok = document.execCommand("copy");
  area.remove();
  return ok;
}

/** Copia un texto al portapapeles (ej. el código de pago) y confirma con "Copiado". */
export function CopyButton({ text, label = "Copiar" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      // navigator.clipboard solo existe en https o localhost; por http (ej. la IP de la red) se copia a la vieja usanza
      if (navigator.clipboard) await navigator.clipboard.writeText(text);
      else if (!copyWithSelection(text)) return;
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

"use client";

import Button from "@mui/material/Button";
import PrintOutlined from "@mui/icons-material/PrintOutlined";

/** Abre el diálogo de impresión del navegador, donde se puede elegir "Guardar como PDF". */
export function PrintButton({ label = "Imprimir o guardar PDF" }: { label?: string }) {
  return (
    <Button variant="contained" startIcon={<PrintOutlined />} onClick={() => window.print()} data-noprint>
      {label}
    </Button>
  );
}

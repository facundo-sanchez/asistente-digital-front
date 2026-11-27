"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import type { ProviderResponse } from "@/types/api";
import { Panel } from "@/components/layout/Panel";
import { CreateProviderDialog } from "./CreateProviderDialog";

/** En el servicio de un proveedor propio: desde dónde llegan sus facturas y cómo cambiarlo. */
export function OwnProviderPanel({ provider }: { provider: ProviderResponse }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <Panel
      title={`Proveedor: ${provider.name}`}
      description="Lo agregaste vos: solo lo ves vos."
      action={
        <Button variant="outlined" onClick={() => setOpen(true)}>
          Editar proveedor
        </Button>
      }
    >
      {provider.invoiceSender ? (
        <Typography>
          Sus facturas llegan desde <strong>{provider.invoiceSender}</strong>: con Gmail conectado, las detectamos solas.
        </Typography>
      ) : (
        <Typography color="text.secondary">
          Cargá desde qué dirección te llegan sus facturas por mail para que Gmail las detecte solas.
        </Typography>
      )}
      <CreateProviderDialog
        open={open}
        initialName={provider.name}
        provider={provider}
        onClose={() => setOpen(false)}
        onCreated={() => {
          setOpen(false);
          router.refresh();
        }}
      />
    </Panel>
  );
}

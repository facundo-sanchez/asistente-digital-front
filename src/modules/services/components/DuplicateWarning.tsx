"use client";

import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import { TextLink } from "@/components/common/TextLink";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { servicesApi } from "../api";
import type { DuplicateSearchResult } from "./duplicate-search-result";
import type { DuplicateWarningProps } from "./duplicate-warning-props";

/**
 * Aviso no bloqueante: ya hay un servicio con el mismo proveedor y nro. de socio
 * (CU-001, flujo alternativo). Consulta cuando el usuario deja de escribir; si la
 * consulta falla no muestra nada (el aviso es una ayuda, no una validación).
 */
export function DuplicateWarning({ providerId, customerReference, excludeId }: DuplicateWarningProps) {
  const reference = useDebouncedValue(customerReference.trim(), 400);
  const [found, setFound] = useState<DuplicateSearchResult | null>(null);
  const key = `${providerId}|${reference}`;

  useEffect(() => {
    if (!providerId || !reference) return;
    let stale = false;
    servicesApi
      .duplicates(providerId, reference, excludeId)
      .then((services) => {
        if (!stale) setFound({ key: `${providerId}|${reference}`, services });
      })
      .catch(() => undefined);
    return () => {
      stale = true;
    };
  }, [providerId, reference, excludeId]);

  // Solo vale el resultado de la combinación que está escrita ahora
  const duplicates = providerId && reference && found?.key === key ? found.services : [];
  if (duplicates.length === 0) return null;

  return (
    <Alert severity="warning">
      {duplicates.length === 1 ? "Ya tenés un servicio" : "Ya tenés servicios"} de {duplicates[0].providerName} con el nro. de socio{" "}
      <strong className="tabular-nums">{reference}</strong>:{" "}
      {duplicates.map((service, i) => (
        <span key={service.id}>
          {i > 0 && ", "}
          <TextLink href={`/services/${service.id}`} sx={{ fontWeight: 600, color: "inherit" }}>
            {service.name}
          </TextLink>
        </span>
      ))}
      . Podés guardarlo igual si es otro.
    </Alert>
  );
}

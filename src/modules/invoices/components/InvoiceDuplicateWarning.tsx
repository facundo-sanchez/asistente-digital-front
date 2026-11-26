"use client";

import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import { TextLink } from "@/components/common/TextLink";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { formatDate } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { parseAmount } from "@/modules/obligations/validation";
import { invoicesApi } from "../api";
import type { InvoiceDuplicateProps } from "./invoice-duplicate-props";
import type { InvoiceDuplicateResult } from "./invoice-duplicate-result";

const AMOUNT = /^\d{1,15}([.,]\d{1,2})?$/;

/**
 * Aviso (RN-005): el servicio ya tiene una factura con ese número, o del mismo período e
 * importe. Consulta cuando el usuario deja de escribir; si falla no muestra nada. El número
 * repetido igual lo rechaza el backend al guardar.
 */
export function InvoiceDuplicateWarning({ serviceId, invoiceNumber, billingPeriod, totalAmount, excludeId }: InvoiceDuplicateProps) {
  const number = useDebouncedValue(invoiceNumber.trim(), 400);
  const period = useDebouncedValue(billingPeriod.trim(), 400);
  const amountText = useDebouncedValue(totalAmount.trim(), 400);
  const amount = AMOUNT.test(amountText) ? parseAmount(amountText) : null;
  const [found, setFound] = useState<InvoiceDuplicateResult | null>(null);
  const key = `${serviceId}|${number}|${period}|${amount}`;
  const searchable = !!serviceId && (!!number || (!!period && amount !== null));

  useEffect(() => {
    if (!serviceId || !searchable) return;
    let stale = false;
    invoicesApi
      .duplicates({ serviceId, invoiceNumber: number || undefined, billingPeriod: period || undefined, totalAmount: amount ?? undefined, excludeId })
      .then((invoices) => {
        if (!stale) setFound({ key, invoices });
      })
      .catch(() => undefined);
    return () => {
      stale = true;
    };
  }, [serviceId, number, period, amount, excludeId, searchable, key]);

  // Solo vale el resultado de la combinación que está escrita ahora
  const duplicates = searchable && found?.key === key ? found.invoices : [];
  if (duplicates.length === 0) return null;

  return (
    <Alert severity="warning">
      Puede que ya la hayas cargado:{" "}
      {duplicates.map((invoice, i) => (
        <span key={invoice.id}>
          {i > 0 && ", "}
          <TextLink href={`/invoices/${invoice.id}`} sx={{ fontWeight: 600, color: "inherit" }}>
            {invoice.invoiceNumber ?? invoice.billingPeriod ?? "factura"}
          </TextLink>{" "}
          ({formatMoney(invoice.totalAmount, invoice.currency)}, vence {formatDate(invoice.dueDate)})
        </span>
      ))}
      .{number && duplicates.some((d) => d.invoiceNumber === number) ? " Con el mismo número no se puede guardar." : " Podés guardarla igual si es otra."}
    </Alert>
  );
}

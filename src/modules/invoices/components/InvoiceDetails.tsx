import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { InvoiceResponse } from "@/types/api";
import { CopyButton } from "@/components/common/CopyButton";
import type { PaymentTarget } from "@/lib/wallets";
import { TextLink } from "@/components/common/TextLink";
import { DetailList } from "@/components/layout/DetailList";
import { formatDate } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { ObligationStatus } from "@/modules/obligations/components/ObligationStatus";
import { PayButton } from "./PayButton";

const EMPTY = (
  <Typography component="span" color="text.secondary">
    —
  </Typography>
);

/** Datos de la factura, el código de pago para copiar y el estado de su vencimiento. */
export function InvoiceDetails({ invoice, payment }: { invoice: InvoiceResponse; payment: PaymentTarget | null }) {
  // RP-5: solo si hay código y el vencimiento sigue sin pagar
  const payable = invoice.obligationStatus !== "PAID" && invoice.status !== "REJECTED";
  const rows: [string, ReactNode][] = [
    ["Servicio", invoice.serviceName],
    ["Número", invoice.invoiceNumber ? <span className="tabular-nums">{invoice.invoiceNumber}</span> : EMPTY],
    ["Período", invoice.billingPeriod ?? EMPTY],
    ["Importe", <span key="amount" className="tabular-nums">{formatMoney(invoice.totalAmount, invoice.currency)}</span>],
    ["Emitida", formatDate(invoice.issueDate) ?? EMPTY],
    ["Vence", <span key="due" className="tabular-nums">{formatDate(invoice.dueDate)}</span>],
    [
      "Código de pago",
      invoice.paymentCode ? (
        <Box key="code" component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <Box component="span" className="tabular-nums" sx={{ overflowWrap: "anywhere" }}>
            {invoice.paymentCode}
          </Box>
          <CopyButton text={invoice.paymentCode} />
          {payable && payment && <PayButton code={invoice.paymentCode} target={payment} />}
          {payable && !payment && (
            <TextLink href="/profile#billetera" sx={{ flexBasis: "100%", typography: "body2" }}>
              Elegí tu billetera en el perfil para pagar desde acá
            </TextLink>
          )}
        </Box>
      ) : (
        EMPTY
      ),
    ],
    [
      "Vencimiento",
      invoice.obligationId && invoice.obligationStatus ? (
        <Box key="obligation" component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
          <ObligationStatus status={invoice.obligationStatus} />
          <TextLink href={`/obligations/${invoice.obligationId}`}>Ver vencimiento y pagos</TextLink>
        </Box>
      ) : (
        EMPTY
      ),
    ],
  ];
  return <DetailList rows={rows} />;
}

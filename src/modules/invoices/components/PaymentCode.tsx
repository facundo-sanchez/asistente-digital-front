import Box from "@mui/material/Box";
import { CopyButton } from "@/components/common/CopyButton";
import { TextLink } from "@/components/common/TextLink";
import type { PaymentTarget } from "@/lib/wallets";
import { PayButton } from "./PayButton";

/**
 * Código de pago para copiar y, si sigue sin pagar, el botón Pagar (o cómo habilitarlo).
 * Se usa en la factura y en su vencimiento.
 */
export function PaymentCode({ code, payable, target }: { code: string; payable: boolean; target: PaymentTarget | null }) {
  return (
    <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
      <Box component="span" className="tabular-nums" sx={{ overflowWrap: "anywhere" }}>
        {code}
      </Box>
      <CopyButton text={code} />
      {payable && target && <PayButton code={code} target={target} />}
      {payable && !target && (
        <TextLink href="/profile#billetera" sx={{ flexBasis: "100%", typography: "body2" }}>
          Elegí tu billetera en el perfil para pagar desde acá
        </TextLink>
      )}
    </Box>
  );
}

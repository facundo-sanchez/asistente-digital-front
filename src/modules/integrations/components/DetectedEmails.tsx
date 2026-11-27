import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { DetectedEmailResponse, ProcessedItemResult } from "@/types/api";
import { TextLink } from "@/components/common/TextLink";
import { desktopOnly, ledgerCell, ledgerHeadCell, ledgerTable } from "@/components/ledger/ledger-styles";
import { formatDay } from "@/lib/dates";

const RESULTS: Record<ProcessedItemResult, { label: string; color: string }> = {
  IMPORTED: { label: "Importado", color: "success.main" },
  DUPLICATE: { label: "Ya estaba", color: "text.secondary" },
  DISCARDED: { label: "No es factura", color: "text.disabled" },
  FAILED: { label: "Falló, se reintenta", color: "error.main" },
};

/** Motivos que conviene explicar (el resto se ve como el resultado). */
const REASONS: Record<string, string> = {
  LOAN_NOT_FOUND: "Aviso de cuota: no encontramos el préstamo. Cargalo en Préstamos.",
  LOAN_AMBIGUOUS: "Aviso de cuota: tenés más de un préstamo de ese banco. Cargá la referencia del aviso en el préstamo (Editar).",
  LOAN_INSTALLMENT_PAID: "Aviso de cuota: esa cuota ya estaba pagada.",
  LOAN_NOTICE_UNREADABLE: "Aviso de cuota: no pudimos leer el texto del banco.",
};

/** "Detectado en tu correo": los emails de proveedores que revisamos y qué pasó con cada uno. */
export function DetectedEmails({ emails }: { emails: DetectedEmailResponse[] }) {
  if (emails.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Todavía no encontramos correos de tus proveedores.
      </Typography>
    );
  }
  return (
    <Box sx={{ overflowX: "auto" }}>
      <Box component="table" sx={ledgerTable}>
        <Box component="thead">
          <Box component="tr">
            <Box component="th" scope="col" sx={ledgerHeadCell}>
              Email
            </Box>
            <Box component="th" scope="col" sx={{ ...ledgerHeadCell, ...desktopOnly }}>
              Llegó
            </Box>
            <Box component="th" scope="col" sx={ledgerHeadCell}>
              Resultado
            </Box>
          </Box>
        </Box>
        <Box component="tbody">
          {emails.map((email) => {
            const result = RESULTS[email.result];
            return (
              <Box component="tr" key={email.id}>
                <Box component="td" sx={{ ...ledgerCell, maxWidth: 420 }}>
                  {email.documentId ? (
                    <TextLink href={`/documents/${email.documentId}`} sx={{ fontWeight: 600, color: "text.primary" }}>
                      {email.subject || "(sin asunto)"}
                    </TextLink>
                  ) : (
                    <Typography sx={{ fontWeight: 600 }}>{email.subject || "(sin asunto)"}</Typography>
                  )}
                  <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: "anywhere" }}>
                    {email.sender}
                  </Typography>
                </Box>
                <Box component="td" sx={{ ...ledgerCell, ...desktopOnly, whiteSpace: "nowrap" }} className="tabular-nums">
                  {email.receivedAt ? formatDay(email.receivedAt) : "—"}
                </Box>
                <Box component="td" sx={{ ...ledgerCell, whiteSpace: "nowrap" }}>
                  <Box
                    component="span"
                    aria-hidden
                    sx={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", bgcolor: result.color, mr: 1 }}
                  />
                  {email.discardReason?.startsWith("LOAN_") || (email.result === "IMPORTED" && !email.documentId) ? (email.result === "IMPORTED" ? "Cuota actualizada" : "No aplicado") : result.label}
                  {email.discardReason && REASONS[email.discardReason] && (
                    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "normal", maxWidth: 280 }}>
                      {REASONS[email.discardReason]}
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

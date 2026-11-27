import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { PendingReviewResponse } from "@/types/api";
import { TextLink } from "@/components/common/TextLink";
import { Panel } from "@/components/layout/Panel";
import { ledgerCell, ledgerTable } from "@/components/ledger/ledger-styles";
import { extractionHref, extractionLabel } from "@/lib/extraction-href";

function isInvoice(review: PendingReviewResponse): boolean {
  return review.schemaVersion.startsWith("invoice/");
}

/** Lo que leyó la IA y falta confirmar: cada fila lleva a su revisión. No se muestra si no hay nada. */
export function ReviewPanel({ reviews }: { reviews: PendingReviewResponse[] }) {
  if (reviews.length === 0) return null;
  return (
    <Panel title="Para revisar" description="Lo que leyó la IA: confirmalo para que quede registrado">
      <Box component="table" sx={ledgerTable}>
        <Box component="tbody">
          {reviews.map((r) => (
            <Box component="tr" key={r.id}>
              <Box component="td" sx={ledgerCell}>
                <Typography sx={{ fontWeight: 600 }}>{r.documentTitle ?? "Documento"}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {extractionLabel(r.schemaVersion)}
                </Typography>
              </Box>
              <Box component="td" sx={{ ...ledgerCell, textAlign: "right" }}>
                <TextLink href={extractionHref(r)}>Revisar</TextLink>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Panel>
  );
}

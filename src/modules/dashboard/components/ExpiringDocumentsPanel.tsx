import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ExpiringDocumentResponse } from "@/types/api";
import { TextLink } from "@/components/common/TextLink";
import { Panel } from "@/components/layout/Panel";
import { ledgerCell, ledgerTable } from "@/components/ledger/ledger-styles";
import { formatDate } from "@/lib/dates";
import { DOCUMENT_TYPE_LABELS } from "@/lib/document-types";

/** Pólizas, garantías y demás documentos que vencen en los próximos 30 días. No se muestra si no hay. */
export function ExpiringDocumentsPanel({ documents }: { documents: ExpiringDocumentResponse[] }) {
  if (documents.length === 0) return null;
  return (
    <Panel title="Documentos por vencer" description="Vencen en los próximos 30 días">
      <Box component="table" sx={ledgerTable}>
        <Box component="tbody">
          {documents.map((d) => (
            <Box component="tr" key={d.id}>
              <Box component="td" sx={ledgerCell}>
                <TextLink href={`/documents/${d.id}`} sx={{ fontWeight: 600, color: "text.primary" }}>
                  {d.title}
                </TextLink>
                <Typography variant="body2" color="text.secondary">
                  {DOCUMENT_TYPE_LABELS[d.documentType]}
                </Typography>
              </Box>
              <Box component="td" sx={{ ...ledgerCell, textAlign: "right", whiteSpace: "nowrap" }} className="tabular-nums">
                {formatDate(d.expiresOn)}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Panel>
  );
}

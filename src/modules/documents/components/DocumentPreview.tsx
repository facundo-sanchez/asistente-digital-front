import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import DownloadOutlined from "@mui/icons-material/DownloadOutlined";
import type { DocumentResponse } from "@/types/api";
import { documentFileUrl } from "../file-url";
import { isSpreadsheet } from "../upload-rules";

/** PDF embebido o imagen. Excel no tiene vista previa en el navegador: se ofrece descargarlo. */
export function DocumentPreview({ document }: { document: DocumentResponse }) {
  const src = documentFileUrl(document.id, true);
  const name = document.title ?? document.originalFilename;

  if (isSpreadsheet(document.mimeType)) {
    return (
      <Stack spacing={1.5} sx={{ alignItems: "flex-start" }}>
        <Typography color="text.secondary">Es una planilla de Excel: descargala para verla.</Typography>
        <Button href={documentFileUrl(document.id)} variant="outlined" startIcon={<DownloadOutlined />}>
          Descargar {document.originalFilename}
        </Button>
      </Stack>
    );
  }
  if (document.mimeType === "application/pdf") {
    return (
      <Box
        component="iframe"
        src={src}
        title={`Vista previa de ${name}`}
        sx={{ display: "block", width: "100%", height: { xs: 480, md: 720 }, border: 1, borderColor: "divider", borderRadius: 1 }}
      />
    );
  }
  return (
    <Box
      component="img"
      src={src}
      alt={name}
      sx={{ display: "block", maxWidth: "100%", maxHeight: 720, mx: "auto", borderRadius: 1 }}
    />
  );
}

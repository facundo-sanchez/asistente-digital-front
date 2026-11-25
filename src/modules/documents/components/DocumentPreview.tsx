import Box from "@mui/material/Box";
import type { DocumentResponse } from "@/types/api";
import { documentFileUrl } from "../file-url";

/** PDF embebido o imagen. Los tipos se validan al subir: solo PDF, JPG, PNG o WEBP. */
export function DocumentPreview({ document }: { document: DocumentResponse }) {
  const src = documentFileUrl(document.id, true);
  const name = document.title ?? document.originalFilename;

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

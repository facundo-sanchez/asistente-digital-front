import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

/** Mientras el servidor trae los documentos: la forma de la página, sin saltos al cargar. */
export default function DocumentsLoading() {
  return (
    <Stack spacing={4} sx={{ maxWidth: 1200 }} aria-busy aria-label="Cargando documentos">
      <Skeleton variant="text" width={220} height={48} />
      <Skeleton variant="rounded" height={56} />
      <Skeleton variant="rounded" height={320} />
    </Stack>
  );
}

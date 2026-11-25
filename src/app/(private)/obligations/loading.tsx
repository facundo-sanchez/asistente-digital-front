import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

/** Mientras el servidor trae los vencimientos: la forma de la página, sin saltos al cargar. */
export default function ObligationsLoading() {
  return (
    <Stack spacing={4} sx={{ maxWidth: 1200 }} aria-busy aria-label="Cargando vencimientos">
      <Skeleton variant="text" width={220} height={48} />
      <Skeleton variant="rounded" height={120} />
      <Skeleton variant="rounded" height={320} />
    </Stack>
  );
}

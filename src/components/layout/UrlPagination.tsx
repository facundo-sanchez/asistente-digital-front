"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";

/** Paginación que guarda la página en la URL (?page=, empieza en 1). No se muestra con una sola página. */
export function UrlPagination({ page, totalPages }: { page: number; totalPages: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goTo = (target: number) => {
    const next = new URLSearchParams(searchParams.toString());
    if (target > 1) next.set("page", String(target));
    else next.delete("page");
    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <Box component="nav" aria-label="Páginas" sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
      <Pagination count={totalPages} page={page} onChange={(_, target) => goTo(target)} shape="rounded" />
    </Box>
  );
}

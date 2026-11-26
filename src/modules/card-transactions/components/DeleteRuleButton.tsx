"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import { cardTransactionsApi } from "../api";

/** Borra una regla por comercio; los consumos ya clasificados no cambian. */
export function DeleteRuleButton({ id, merchant }: { id: string; merchant: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const remove = async () => {
    setDeleting(true);
    try {
      await cardTransactionsApi.deleteRule(id);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Button size="small" color="inherit" onClick={remove} loading={deleting} aria-label={`Borrar la regla de ${merchant}`}>
      Borrar
    </Button>
  );
}

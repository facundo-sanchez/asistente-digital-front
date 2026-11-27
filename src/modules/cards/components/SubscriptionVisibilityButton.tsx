"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ApiError } from "@/lib/api/api-error";
import { cardsApi } from "../api";

/** "No es una suscripción" (la oculta) o "Mostrar" (la vuelve a la lista). */
export function SubscriptionVisibilityButton({
  merchant,
  hidden,
}: {
  merchant: string;
  hidden: boolean;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const change = async () => {
    setSaving(true);
    setError(null);
    try {
      await (hidden
        ? cardsApi.restoreSubscription(merchant)
        : cardsApi.dismissSubscription(merchant));
      router.refresh();
    } catch (e) {
      setError(
        e instanceof ApiError && e.data?.mensaje
          ? e.data.mensaje
          : "No pudimos guardar el cambio. Probá de nuevo.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Button
        size="small"
        color="inherit"
        onClick={change}
        loading={saving}
        sx={{ color: "text.secondary", whiteSpace: "nowrap" }}
      >
        {hidden ? "Mostrar" : "No es una suscripción"}
      </Button>
      {error && (
        <Typography variant="body2" color="error" role="alert">
          {error}
        </Typography>
      )}
    </>
  );
}

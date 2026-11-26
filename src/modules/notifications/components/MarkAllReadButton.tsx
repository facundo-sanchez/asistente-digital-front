"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import { notificationsApi } from "../api";

export function MarkAllReadButton() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const markAll = async () => {
    setSaving(true);
    await notificationsApi.markAllRead().catch(() => undefined);
    setSaving(false);
    router.refresh();
  };

  return (
    <Button variant="outlined" onClick={markAll} loading={saving}>
      Marcar todo como leído
    </Button>
  );
}

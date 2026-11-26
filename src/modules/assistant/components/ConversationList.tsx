"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import AddOutlined from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import type { ConversationResponse } from "@/types/api";
import { assistantApi } from "../api";

/** Conversaciones: la abierta queda marcada; cada una se borra con su botón. */
export function ConversationList({ conversations, selectedId }: { conversations: ConversationResponse[]; selectedId: string | null }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const remove = async (id: string) => {
    setDeleting(id);
    try {
      await assistantApi.remove(id);
      if (id === selectedId) router.replace("/assistant");
      router.refresh();
    } finally {
      setDeleting(null);
    }
  };

  return (
    <Box>
      <Button component={NextLink} href="/assistant" variant="outlined" fullWidth startIcon={<AddOutlined />} sx={{ mb: 1.5 }}>
        Nueva consulta
      </Button>
      {conversations.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
          Tus consultas van a quedar acá.
        </Typography>
      ) : (
        <List dense disablePadding>
          {conversations.map((c) => (
            <Box key={c.id} sx={{ display: "flex", alignItems: "center", "&:hover .delete, &:focus-within .delete": { opacity: 1 } }}>
              <ListItemButton
                component={NextLink}
                href={`/assistant?c=${c.id}`}
                selected={c.id === selectedId}
                sx={{ borderRadius: 1.5, minWidth: 0 }}
              >
                <ListItemText primary={c.title ?? "Consulta sin título"} slotProps={{ primary: { noWrap: true } }} />
              </ListItemButton>
              <IconButton
                className="delete"
                size="small"
                aria-label={`Borrar «${c.title ?? "consulta"}»`}
                onClick={() => remove(c.id)}
                disabled={deleting === c.id}
                sx={{ opacity: { xs: 1, md: c.id === selectedId ? 1 : 0 }, transition: "opacity 150ms" }}
              >
                <DeleteOutlineOutlined fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </List>
      )}
    </Box>
  );
}

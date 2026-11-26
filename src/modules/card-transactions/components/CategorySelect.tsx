"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { SPENDING_CATEGORIES, type CardTransactionResponse, type SpendingCategory } from "@/types/api";
import { SPENDING_CATEGORY_LABELS } from "@/lib/spending-categories";
import { cardTransactionsApi } from "../api";

/** El rubro de un consumo; al cambiarlo pregunta si se aplica siempre a ese comercio (RN-019). */
export function CategorySelect({ transaction }: { transaction: CardTransactionResponse }) {
  const router = useRouter();
  const [value, setValue] = useState<SpendingCategory>(transaction.category);
  const [pending, setPending] = useState<SpendingCategory | null>(null);
  const [saving, setSaving] = useState(false);

  const save = async (category: SpendingCategory, always: boolean) => {
    setSaving(true);
    try {
      await cardTransactionsApi.recategorize(transaction.id, category, always);
      setValue(category);
      setPending(null);
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const choose = (category: SpendingCategory) => {
    if (category === value) return;
    // Sin comercio no hay regla que recordar
    if (transaction.merchantName) setPending(category);
    else void save(category, false);
  };

  return (
    <>
      <TextField
        select
        size="small"
        value={value}
        onChange={(e) => choose(e.target.value as SpendingCategory)}
        disabled={saving}
        slotProps={{ htmlInput: { "aria-label": `Rubro de ${transaction.merchantName ?? transaction.description}` } }}
        sx={{ minWidth: 170 }}
      >
        {SPENDING_CATEGORIES.map((c) => (
          <MenuItem key={c} value={c}>
            {SPENDING_CATEGORY_LABELS[c]}
          </MenuItem>
        ))}
      </TextField>
      <Dialog open={pending !== null} onClose={() => !saving && setPending(null)} aria-labelledby={`rubro-${transaction.id}`}>
        <DialogTitle id={`rubro-${transaction.id}`}>¿Siempre {pending ? SPENDING_CATEGORY_LABELS[pending] : ""}?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Querés que los consumos en {transaction.merchantName} queden siempre como {pending ? SPENDING_CATEGORY_LABELS[pending] : ""}?
            Se aplica a los que ya tenés y a los próximos resúmenes.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" disabled={saving} onClick={() => pending && save(pending, false)}>
            Solo este
          </Button>
          <Button variant="contained" loading={saving} onClick={() => pending && save(pending, true)}>
            Siempre
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import type { ReportFiltersProps } from "./report-filters-props";

/** Filtros por GET: funcionan sin JavaScript y quedan en la URL. */
export function ReportFilters({ query, from, to, cards, action }: ReportFiltersProps) {
  return (
    <Box component="form" method="get" action={action} sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
      <TextField
        type="month"
        name="from"
        label="Desde"
        size="small"
        defaultValue={query.from ?? from}
        slotProps={{ inputLabel: { shrink: true } }}
      />
      <TextField
        type="month"
        name="to"
        label="Hasta"
        size="small"
        defaultValue={query.to ?? to}
        slotProps={{ inputLabel: { shrink: true } }}
      />
      <TextField select name="cardId" label="Tarjeta" size="small" defaultValue={query.cardId ?? ""} sx={{ minWidth: 200 }}>
        <MenuItem value="">Todas</MenuItem>
        {cards.map((c) => (
          <MenuItem key={c.id} value={c.id}>
            {c.name}
          </MenuItem>
        ))}
      </TextField>
      {query.category && <input type="hidden" name="category" value={query.category} />}
      {query.merchant && <input type="hidden" name="merchant" value={query.merchant} />}
      <Button type="submit" variant="outlined">
        Ver
      </Button>
    </Box>
  );
}

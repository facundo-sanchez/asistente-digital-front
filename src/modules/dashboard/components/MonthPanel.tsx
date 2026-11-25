import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { GuillocheRosette } from "@/components/brand/GuillocheRosette";
import { Panel } from "@/components/layout/Panel";

/**
 * "Este mes": cuánto de lo que vence en el mes ya está pagado, en la roseta.
 * Hasta que exista el módulo de obligaciones no hay montos: se muestra el estado vacío.
 */
export function MonthPanel() {
  return (
    <Panel title="Este mes" description="Cuánto del mes ya pagaste">
      <Box sx={{ display: "grid", justifyItems: "center", gap: 2, py: 1, textAlign: "center" }}>
        <GuillocheRosette value={null} size={200} label="Todavía no hay vencimientos este mes" />
        <Box>
          <Typography sx={{ fontWeight: 600 }}>Sin vencimientos cargados</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: "32ch", mx: "auto" }}>
            Cuando registres tus servicios, la roseta se va a completar a medida que pagues.
          </Typography>
        </Box>
      </Box>
    </Panel>
  );
}

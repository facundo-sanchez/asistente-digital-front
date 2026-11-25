import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Panel } from "@/components/layout/Panel";
import { ServiceTintLegend } from "./ServiceTintLegend";

const COLUMNS = ["Servicio", "Vence", "Monto", "Estado"] as const;

const headCell = {
  fontFamily: "var(--font-archivo-narrow)",
  fontWeight: 600,
  fontSize: "0.78rem",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "text.secondary",
  textAlign: "left",
  py: 1,
  px: 1.5,
  borderBottom: 1,
  borderColor: "divider",
} as const;

const ghostCell = { py: 2, px: 1.5, color: "text.secondary", borderBottom: 1, borderColor: "divider" } as const;

/** En mobile solo entran la franja y el servicio: el detalle de la fila se oculta. */
const desktopOnly = { display: { xs: "none", sm: "table-cell" } } as const;

/**
 * Próximos vencimientos, como un libro de cuentas: franja del tinte del servicio,
 * servicio, vencimiento, monto y estado. Hasta el módulo de obligaciones no hay
 * filas: se muestra la estructura con una fila vacía, sin valores inventados.
 */
export function UpcomingPanel() {
  return (
    <Panel title="Próximos vencimientos" description="Lo que vence en los próximos 30 días">
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, height: "100%" }}>
        <Box sx={{ overflowX: "auto" }}>
          <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", minWidth: { sm: 420 } }}>
            <Box component="thead">
              <Box component="tr">
                <Box component="th" scope="col" sx={{ ...headCell, width: 6, p: 0 }}>
                  <Box component="span" sx={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
                    Color del servicio
                  </Box>
                </Box>
                {COLUMNS.map((column) => (
                  <Box
                    key={column}
                    component="th"
                    scope="col"
                    sx={{ ...headCell, ...(column === "Servicio" ? {} : desktopOnly), textAlign: column === "Monto" ? "right" : "left" }}
                  >
                    {column}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box component="tbody">
              <Box component="tr">
                <Box component="td" sx={{ ...ghostCell, p: 0, py: 1 }}>
                  <Box sx={{ width: 6, height: 36, borderRadius: 0.5, bgcolor: "divider" }} />
                </Box>
                <Box component="td" sx={{ ...ghostCell, color: "text.primary", fontWeight: 600 }}>
                  Todavía no hay vencimientos
                </Box>
                <Box component="td" sx={{ ...ghostCell, ...desktopOnly }} aria-hidden>
                  —
                </Box>
                <Box component="td" sx={{ ...ghostCell, ...desktopOnly, textAlign: "right" }} className="tabular-nums" aria-hidden>
                  $ —
                </Box>
                <Box component="td" sx={{ ...ghostCell, ...desktopOnly }} aria-hidden>
                  —
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: "60ch" }}>
          Cuando registres tus servicios, cada factura va a aparecer acá con su fecha, su monto y si ya la pagaste.
        </Typography>
        <ServiceTintLegend />
      </Box>
    </Panel>
  );
}

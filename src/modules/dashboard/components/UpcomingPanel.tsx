import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Panel } from "@/components/layout/Panel";
import { TintStrip } from "@/components/ledger/TintStrip";
import { desktopOnly, ledgerCell, ledgerHeadCell, ledgerStripCell, ledgerTable, visuallyHidden } from "@/components/ledger/ledger-styles";
import { ServiceTintLegend } from "./ServiceTintLegend";

const COLUMNS = ["Servicio", "Vence", "Monto", "Estado"] as const;

const ghostCell = { ...ledgerCell, color: "text.secondary" } as const;

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
          <Box component="table" sx={{ ...ledgerTable, minWidth: { sm: 420 } }}>
            <Box component="thead">
              <Box component="tr">
                <Box component="th" scope="col" sx={{ ...ledgerHeadCell, width: 6, p: 0 }}>
                  <Box component="span" sx={visuallyHidden}>
                    Color del servicio
                  </Box>
                </Box>
                {COLUMNS.map((column) => (
                  <Box
                    key={column}
                    component="th"
                    scope="col"
                    sx={{ ...ledgerHeadCell, ...(column === "Servicio" ? {} : desktopOnly), textAlign: column === "Monto" ? "right" : "left" }}
                  >
                    {column}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box component="tbody">
              <Box component="tr">
                <Box component="td" sx={ledgerStripCell}>
                  <TintStrip color="var(--mui-palette-divider)" />
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

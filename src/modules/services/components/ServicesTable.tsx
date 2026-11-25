import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ServiceResponse } from "@/types/api";
import { TextLink } from "@/components/common/TextLink";
import { TintStrip } from "@/components/ledger/TintStrip";
import { desktopOnly, ledgerCell, ledgerHeadCell, ledgerStripCell, ledgerTable, visuallyHidden } from "@/components/ledger/ledger-styles";
import { BILLING_FREQUENCY_LABELS } from "@/lib/billing-frequencies";
import { CATEGORY_LABELS, categoryTint } from "@/lib/service-categories";
import { ServiceStatus } from "./ServiceStatus";

/**
 * Servicios como libro de cuentas: franja del tinte, servicio (con su proveedor y
 * categoría), nro. de socio, periodicidad y estado. En mobile: franja, servicio y estado.
 */
export function ServicesTable({ services }: { services: ServiceResponse[] }) {
  return (
    <Box sx={{ overflowX: "auto" }}>
      <Box component="table" sx={ledgerTable}>
        <Box component="thead">
          <Box component="tr">
            <Box component="th" scope="col" sx={{ ...ledgerHeadCell, width: 6, p: 0 }}>
              <Box component="span" sx={visuallyHidden}>
                Color de la categoría
              </Box>
            </Box>
            <Box component="th" scope="col" sx={ledgerHeadCell}>
              Servicio
            </Box>
            <Box component="th" scope="col" sx={{ ...ledgerHeadCell, ...desktopOnly }}>
              Nro. de socio
            </Box>
            <Box component="th" scope="col" sx={{ ...ledgerHeadCell, ...desktopOnly }}>
              Periodicidad
            </Box>
            <Box component="th" scope="col" sx={ledgerHeadCell}>
              Estado
            </Box>
          </Box>
        </Box>
        <Box component="tbody">
          {services.map((service) => (
            <Box component="tr" key={service.id} sx={{ opacity: service.active ? 1 : 0.7 }}>
              <Box component="td" sx={ledgerStripCell}>
                <TintStrip color={categoryTint(service.category)} height={40} />
              </Box>
              <Box component="td" sx={ledgerCell}>
                <TextLink href={`/services/${service.id}`} sx={{ fontWeight: 600, color: "text.primary" }}>
                  {service.name}
                </TextLink>
                <Typography variant="body2" color="text.secondary">
                  {service.providerName} · {CATEGORY_LABELS[service.category]}
                </Typography>
              </Box>
              <Box component="td" sx={{ ...ledgerCell, ...desktopOnly }} className="tabular-nums">
                {service.customerReference ?? <Typography component="span" color="text.secondary">—</Typography>}
              </Box>
              <Box component="td" sx={{ ...ledgerCell, ...desktopOnly }}>
                {BILLING_FREQUENCY_LABELS[service.billingFrequency]}
              </Box>
              <Box component="td" sx={ledgerCell}>
                <ServiceStatus active={service.active} />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

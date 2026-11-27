/** Qué mostrar mientras el asistente consulta cada herramienta del backend. */
const STATUS: Record<string, string> = {
  upcomingObligations: "Buscando tus vencimientos…",
  overdueObligations: "Buscando lo vencido…",
  unpaidInvoices: "Buscando tus facturas sin pagar…",
  monthSummary: "Sumando el mes…",
  activeServices: "Mirando tus servicios…",
  servicePayments: "Sumando tus pagos…",
  cardSpending: "Revisando los consumos de tus tarjetas…",
  pendingInstallments: "Revisando tus cuotas…",
  expiringDocuments: "Buscando documentos por vencer…",
  searchDocuments: "Buscando en tus documentos…",
  loans: "Revisando tus préstamos…",
};

export function toolStatus(name: string | null): string {
  return (name && STATUS[name]) ?? "Consultando tus datos…";
}

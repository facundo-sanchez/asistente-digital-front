"use client";

import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";
import type { SpendingTotalResponse } from "@/types/api";
import { formatMoney } from "@/lib/money";
import { SERVICE_TINTS } from "@/theme/service-tints";
import { monthLabel } from "./month-label";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

// Gris medio: se lee igual en modo claro y oscuro (el canvas no entiende variables CSS)
const MUTED = "#8a908e";
const GRID = "rgba(138, 144, 142, 0.25)";

/** Barras de lo pagado por mes en una moneda. La tabla oculta de SpendingPanel es la alternativa accesible. */
export function MonthChart({ months }: { months: SpendingTotalResponse[] }) {
  const currency = months[0]?.currency ?? "ARS";
  return (
    <div aria-hidden style={{ position: "relative", height: 220, width: "100%", minWidth: 0 }}>
      <Bar
        data={{
          labels: months.map((m) => monthLabel(m.key)),
          datasets: [{ data: months.map((m) => m.total), backgroundColor: SERVICE_TINTS.card, borderRadius: 4, maxBarThickness: 40 }],
        }}
        options={{
          maintainAspectRatio: false,
          plugins: { tooltip: { callbacks: { label: (c) => formatMoney(c.parsed.y ?? 0, currency) ?? "" } } },
          scales: {
            x: { grid: { display: false }, ticks: { color: MUTED } },
            y: { beginAtZero: true, grid: { color: GRID }, border: { display: false }, ticks: { color: MUTED, maxTicksLimit: 5 } },
          },
        }}
      />
    </div>
  );
}

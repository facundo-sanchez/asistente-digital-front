import type { Metadata } from "next";
import Stack from "@mui/material/Stack";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { LoanForm } from "@/modules/loans/components/LoanForm";

export const metadata: Metadata = { title: "Cargar préstamo" };

export default function NewLoanPage() {
  return (
    <Stack spacing={4} sx={{ maxWidth: 760 }}>
      <PageHeader title="Cargar préstamo" description="Con los datos del comprobante del banco y de una cuota reciente." />
      <Panel title="Datos del préstamo">
        <LoanForm />
      </Panel>
    </Stack>
  );
}

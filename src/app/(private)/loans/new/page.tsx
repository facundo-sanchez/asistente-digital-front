import type { Metadata } from "next";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import type { LoanContractReviewResponse, LoanReceiptReviewResponse } from "@/types/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { firstParam, type SearchParams } from "@/lib/search-params";
import { serverGet } from "@/lib/server/server-get";
import { isUuid } from "@/lib/uuid";
import { LoanForm } from "@/modules/loans/components/LoanForm";
import { fromContract, fromReceipt } from "@/modules/loans/prefill";

export const metadata: Metadata = { title: "Cargar préstamo" };

/** ?extraction= (comprobante de alta leído) o ?receipt= (comprobante de pago leído) completan el formulario. */
export default async function NewLoanPage({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams;
  const extraction = firstParam(query.extraction);
  const receipt = firstParam(query.receipt);
  const contract = extraction && isUuid(extraction) ? await serverGet<LoanContractReviewResponse>(`/loan-extractions/contract/${extraction}`) : null;
  const payment = receipt && isUuid(receipt) ? await serverGet<LoanReceiptReviewResponse>(`/loan-extractions/receipt/${receipt}`) : null;
  const initial = contract ? fromContract(contract) : payment ? fromReceipt(payment) : undefined;
  const warnings = contract?.warnings ?? [];

  return (
    <Stack spacing={4} sx={{ maxWidth: 760 }}>
      <PageHeader
        title="Cargar préstamo"
        description={initial ? "Con lo que leímos del comprobante: revisalo y completá lo que falta." : "Con los datos del comprobante del banco y de una cuota reciente."}
      />
      {contract?.status && contract.status !== "PENDING" && <Alert severity="info">Este comprobante ya se usó para cargar un préstamo.</Alert>}
      {warnings.map((w) => (
        <Alert key={w} severity="warning">{w}</Alert>
      ))}
      {payment && <Alert severity="info">Después de guardar volvés al comprobante de pago para registrar la cuota {payment.receipt.installmentNumber}.</Alert>}
      <Panel title="Datos del préstamo">
        <LoanForm
          initial={initial}
          extractionId={contract?.status === "PENDING" ? contract.extractionId : undefined}
          next={payment ? `/loan-extractions/${payment.extractionId}` : undefined}
        />
      </Panel>
    </Stack>
  );
}

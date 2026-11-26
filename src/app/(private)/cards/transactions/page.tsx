import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { CardResponse, CardTransactionResponse, PageResponse } from "@/types/api";
import { TextLink } from "@/components/common/TextLink";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { UrlPagination } from "@/components/layout/UrlPagination";
import type { SearchParams } from "@/lib/search-params";
import { serverGet } from "@/lib/server/server-get";
import { SPENDING_CATEGORY_LABELS } from "@/lib/spending-categories";
import { ReportFilters } from "@/modules/card-transactions/components/ReportFilters";
import { TransactionsTable } from "@/modules/card-transactions/components/TransactionsTable";
import { backendParams, readReportQuery } from "@/modules/card-transactions/report-query";

export const metadata: Metadata = { title: "Consumos" };

const SIZE = 30;

/** El detalle del informe: los consumos de un rubro, de un comercio o todos los del período. */
export default async function CardTransactionsPage({ searchParams }: { searchParams: SearchParams }) {
  const query = readReportQuery(await searchParams);
  const params = backendParams(query);
  params.set("page", String(query.page - 1));
  params.set("size", String(SIZE));
  const [result, cards] = await Promise.all([
    serverGet<PageResponse<CardTransactionResponse>>(`/card-transactions?${params}`),
    serverGet<CardResponse[]>("/cards"),
  ]);
  const what = query.category ? SPENDING_CATEGORY_LABELS[query.category] : (query.merchant ?? "Todos los consumos");
  const transactions = result?.content ?? [];
  const reportParams = new URLSearchParams();
  if (query.from) reportParams.set("from", query.from);
  if (query.to) reportParams.set("to", query.to);
  if (query.cardId) reportParams.set("cardId", query.cardId);

  return (
    <Stack spacing={4} sx={{ maxWidth: 1000 }}>
      <Box>
        <TextLink href={`/cards/report?${reportParams}`} sx={{ color: "text.secondary" }}>
          Informe de consumos
        </TextLink>
        <PageHeader title={what} description="Consumos de resúmenes confirmados, los más nuevos primero." />
      </Box>
      <ReportFilters query={query} from={query.from ?? ""} to={query.to ?? ""} cards={cards ?? []} action="" />
      <Panel title={`${result?.totalElements ?? 0} consumos`}>
        {transactions.length === 0 ? (
          <Typography color="text.secondary">No hay consumos con esos filtros.</Typography>
        ) : (
          <TransactionsTable transactions={transactions} />
        )}
        <Box sx={{ mt: 2 }}>
          <UrlPagination page={query.page} totalPages={result?.totalPages ?? 0} />
        </Box>
      </Panel>
    </Stack>
  );
}

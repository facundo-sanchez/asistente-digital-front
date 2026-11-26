import { firstParam, type SearchParams } from "@/lib/search-params";
import { isUuid } from "@/lib/uuid";
import { SPENDING_CATEGORIES, type SpendingCategory } from "@/types/api";

/** Filtros del informe y de su detalle, leídos de la URL (?from=2026-06&to=2026-11&cardId=&category=&merchant=). */
export interface ReportQuery {
  /** Meses "yyyy-MM". */
  from: string | null;
  to: string | null;
  cardId: string | null;
  category: SpendingCategory | null;
  merchant: string | null;
  page: number;
}

const MONTH = /^\d{4}-\d{2}$/;

export function readReportQuery(params: Awaited<SearchParams>): ReportQuery {
  const from = firstParam(params.from);
  const to = firstParam(params.to);
  const cardId = firstParam(params.cardId);
  const category = firstParam(params.category);
  return {
    from: from && MONTH.test(from) ? from : null,
    to: to && MONTH.test(to) ? to : null,
    cardId: cardId && isUuid(cardId) ? cardId : null,
    category: category && (SPENDING_CATEGORIES as readonly string[]).includes(category) ? (category as SpendingCategory) : null,
    merchant: firstParam(params.merchant)?.trim() || null,
    page: Math.max(1, Number(firstParam(params.page)) || 1),
  };
}

/** Para el backend: los meses como primer día (yyyy-MM-01). */
export function backendParams(query: ReportQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.from) params.set("from", `${query.from}-01`);
  if (query.to) params.set("to", `${query.to}-01`);
  if (query.cardId) params.set("cardId", query.cardId);
  if (query.category) params.set("category", query.category);
  if (query.merchant) params.set("merchant", query.merchant);
  return params;
}

/** Enlace al detalle con los mismos filtros más lo elegido (un rubro o un comercio). */
export function detailHref(query: ReportQuery, extra: { category?: SpendingCategory; merchant?: string }): string {
  const params = new URLSearchParams();
  if (query.from) params.set("from", query.from);
  if (query.to) params.set("to", query.to);
  if (query.cardId) params.set("cardId", query.cardId);
  if (extra.category) params.set("category", extra.category);
  if (extra.merchant) params.set("merchant", extra.merchant);
  return `/cards/transactions?${params}`;
}

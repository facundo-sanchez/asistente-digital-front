import type { AssistantReference, JsonObject, ReferenceType } from "@/types/api";

const HREFS: Record<ReferenceType, string> = {
  OBLIGATION: "/obligations",
  INVOICE: "/invoices",
  SERVICE: "/services",
  DOCUMENT: "/documents",
};

export function referenceHref(reference: AssistantReference): string {
  return `${HREFS[reference.type]}/${reference.id}`;
}

/** Las referencias del mensaje; descarta lo que no tenga la forma esperada. */
export function readReferences(metadata: JsonObject | null | undefined): AssistantReference[] {
  const raw = metadata?.references;
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (r): r is AssistantReference =>
      typeof r === "object" && r !== null && "type" in r && "id" in r && typeof r.id === "string" && (r.type as string) in HREFS,
  );
}

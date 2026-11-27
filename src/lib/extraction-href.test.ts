import { describe, expect, it } from "vitest";
import { extractionHref } from "./extraction-href";

describe("revisión de cada propuesta", () => {
  it("lleva a su pantalla según el esquema", () => {
    expect(extractionHref({ id: "a", schemaVersion: "invoice/1" })).toBe("/invoice-extractions/a");
    expect(extractionHref({ id: "a", schemaVersion: "loan_contract/1" })).toBe("/loans/new?extraction=a");
    expect(extractionHref({ id: "a", schemaVersion: "loan_receipt/1" })).toBe("/loan-extractions/a");
    expect(extractionHref({ id: "a", schemaVersion: "card_statement/1" })).toBe("/extractions/a");
  });
});

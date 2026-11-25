import { describe, expect, it } from "vitest";
import { SERVICE_CATEGORIES } from "@/types/api";
import { SERVICE_TINTS } from "@/theme/service-tints";
import { CATEGORY_LABELS, categoryKind, categoryTint } from "./service-categories";

describe("categorías de servicio", () => {
  it("todas las categorías del backend tienen nombre y tinte", () => {
    for (const category of SERVICE_CATEGORIES) {
      expect(CATEGORY_LABELS[category]).toBeTruthy();
      expect(Object.values(SERVICE_TINTS)).toContain(categoryTint(category));
    }
  });

  it("agrupa las categorías en los tintes del diseño", () => {
    expect(categoryKind("ELECTRICITY")).toBe("electricity");
    expect(categoryKind("PHONE")).toBe("internet");
    expect(categoryKind("CREDIT_CARD")).toBe("card");
    expect(categoryKind("RENT")).toBe("other");
  });
});

import { describe, expect, it } from "vitest";
import { installmentDate, schedulePreview } from "./schedule";

describe("cronograma del préstamo", () => {
  it("cae el mismo día y, si el mes no lo tiene, el último", () => {
    expect([0, 1, 2, 12].map((i) => installmentDate("2027-01-31", i))).toEqual(["2027-01-31", "2027-02-28", "2027-03-31", "2028-01-31"]);
  });

  it("calcula la última cuota, el total y las pendientes", () => {
    expect(schedulePreview("2026-02-07", 30, 584292.14, 9)).toEqual({ first: "2026-02-07", last: "2028-07-07", total: 17528764.2, pending: 21 });
    expect(schedulePreview("", 30, 100, 0)).toBeNull();
  });
});

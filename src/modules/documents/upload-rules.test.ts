import { describe, expect, it } from "vitest";
import { MAX_FILE_SIZE, formatFileSize, validateFile } from "./upload-rules";

const file = (size: number, type: string) => new File([new Uint8Array(size)], "archivo", { type });

describe("reglas de archivo", () => {
  it("acepta PDF e imágenes dentro del tamaño", () => {
    expect(validateFile(file(100, "application/pdf"))).toBeNull();
    expect(validateFile(file(100, "image/webp"))).toBeNull();
  });

  it("rechaza vacíos, grandes y tipos no admitidos", () => {
    expect(validateFile(file(0, "application/pdf"))).toMatch(/vacío/);
    expect(validateFile(file(MAX_FILE_SIZE + 1, "application/pdf"))).toMatch(/10 MB/);
    expect(validateFile(file(100, "application/zip"))).toMatch(/PDF, JPG/);
  });

  it("muestra el tamaño legible", () => {
    expect(formatFileSize(512)).toBe("512 B");
    expect(formatFileSize(1536)).toBe("1,5 KB");
    expect(formatFileSize(5 * 1024 * 1024)).toBe("5 MB");
  });
});

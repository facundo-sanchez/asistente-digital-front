/** Un bloque de la respuesta: un párrafo o una lista. */
export type AnswerBlock = { kind: "text"; text: string } | { kind: "list"; items: string[] };

/**
 * Lo mínimo del markdown que usa el modelo: párrafos y listas con "*" o "-".
 * El texto se muestra siempre como texto (nunca como HTML).
 */
export function answerBlocks(content: string): AnswerBlock[] {
  const blocks: AnswerBlock[] = [];
  for (const raw of content.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const item = /^[*-]\s+(.*)$/.exec(line);
    const last = blocks.at(-1);
    if (item && last?.kind === "list") last.items.push(item[1]);
    else if (item) blocks.push({ kind: "list", items: [item[1]] });
    else blocks.push({ kind: "text", text: line.replace(/^#+\s*/, "") });
  }
  return blocks;
}

/** Separa el texto en partes normales y en negrita (**así**). */
export function boldParts(text: string): { text: string; bold: boolean }[] {
  return text.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map((part) =>
    part.startsWith("**") && part.endsWith("**") ? { text: part.slice(2, -2), bold: true } : { text: part, bold: false },
  );
}

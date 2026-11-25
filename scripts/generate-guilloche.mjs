/**
 * Genera public/brand/guilloche.svg: la roseta guilloché de la marca, como el grabado
 * de seguridad de un billete. Dos bandas de hipotrocoides entrelazadas más filetes.
 * El SVG se usa como máscara (mask-image), así que solo importa la forma: el color
 * lo pone el componente según el tema.
 *
 * Uso: node scripts/generate-guilloche.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";

const CENTER = 100;

/** Hipotrocoide escalada para que ocupe la banda [inner, outer]. turns = r (vueltas hasta cerrar). */
function hypotrochoid({ R, r, inner, outer, step = 0.05 }) {
  const middle = (inner + outer) / 2;
  const scale = middle / (R - r);
  const d = (outer - middle) / scale;
  const k = (R - r) / r;
  const points = [];
  for (let t = 0; t <= 2 * Math.PI * r + step; t += step) {
    const x = (R - r) * Math.cos(t) + d * Math.cos(k * t);
    const y = (R - r) * Math.sin(t) - d * Math.sin(k * t);
    points.push(`${(CENTER + x * scale).toFixed(1)} ${(CENTER + y * scale).toFixed(1)}`);
  }
  return `M${points.join("L")}Z`;
}

const outerBand = hypotrochoid({ R: 41, r: 18, inner: 56, outer: 88 });
const innerBand = hypotrochoid({ R: 29, r: 12, inner: 24, outer: 52 });

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><g fill="none" stroke="#000" stroke-linejoin="round"><path d="${outerBand}" stroke-width="0.55"/><path d="${innerBand}" stroke-width="0.55"/><circle cx="100" cy="100" r="97" stroke-width="0.8"/><circle cx="100" cy="100" r="87" stroke-width="0.6"/><circle cx="100" cy="100" r="20" stroke-width="0.8"/><circle cx="100" cy="100" r="17" stroke-width="0.5"/></g></svg>\n`;

mkdirSync("public/brand", { recursive: true });
writeFileSync("public/brand/guilloche.svg", svg);
console.log(`public/brand/guilloche.svg (${(svg.length / 1024).toFixed(1)} KB)`);

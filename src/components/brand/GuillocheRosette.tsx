import { withBasePath } from "@/lib/config";
import type { GuillocheRosetteProps } from "./guilloche-rosette-props";

const CENTER = 100;
const RING = 92;
const CIRCUMFERENCE = 2 * Math.PI * RING;
/** Grabado guilloché (generado por scripts/generate-guilloche.mjs). Se usa como máscara. */
const PATTERN_URL = `url("${withBasePath("/brand/guilloche.svg")}")`;

/**
 * Roseta guilloché: el sello visual de la app. El grabado es una máscara pintada con
 * el color del tema; encima, con un valor, el anillo se completa según lo pagado del
 * mes (se dibuja al aparecer; sin animación si el usuario pidió movimiento reducido).
 * No necesita JavaScript.
 */
export function GuillocheRosette({
  value,
  size = 200,
  label,
  lineColor = "var(--mui-palette-text-secondary)",
  arcColor = "var(--mui-palette-primary-main)",
}: GuillocheRosetteProps) {
  const progress = value == null ? null : Math.min(Math.max(value, 0), 1);
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{ position: "relative", display: "inline-block", width: size, height: size, flexShrink: 0 }}
    >
      <span
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: lineColor,
          maskImage: PATTERN_URL,
          maskSize: "100% 100%",
          WebkitMaskImage: PATTERN_URL,
          WebkitMaskSize: "100% 100%",
        }}
      />
      {progress != null && progress > 0 && (
        <svg viewBox="0 0 200 200" width={size} height={size} style={{ position: "absolute", inset: 0 }}>
          <circle cx={CENTER} cy={CENTER} r={RING} fill="none" stroke={lineColor} strokeOpacity={0.2} strokeWidth={6} />
          <circle
            className="guilloche-rosette__arc"
            cx={CENTER}
            cy={CENTER}
            r={RING}
            fill="none"
            stroke={arcColor}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
            transform={`rotate(-90 ${CENTER} ${CENTER})`}
            style={{ ["--rosette-circumference" as string]: CIRCUMFERENCE }}
          />
        </svg>
      )}
    </span>
  );
}

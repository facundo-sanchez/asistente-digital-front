import Box from "@mui/material/Box";

/** Tres puntos que laten mientras el asistente responde. Quietos con "reducir movimiento". */
export function ThinkingDots() {
  return (
    <Box role="status" aria-label="El asistente está respondiendo" sx={{ display: "inline-flex", gap: 0.75, py: 1.5 }}>
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          className="thinking-dot"
          sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "text.secondary", animationDelay: `${i * 160}ms` }}
        />
      ))}
    </Box>
  );
}

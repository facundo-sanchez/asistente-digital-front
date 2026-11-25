"use client";

/** Error fatal (falla el layout raíz). No usa MUI porque puede fallar el propio árbol de providers. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="es">
      <body style={{ fontFamily: "Helvetica, Arial, sans-serif", display: "grid", placeItems: "center", minHeight: "100vh" }}>
        <div style={{ textAlign: "center" }}>
          <h1>Algo salió mal</h1>
          <p>Ocurrió un error inesperado.</p>
          <button onClick={() => reset()}>Reintentar</button>
        </div>
      </body>
    </html>
  );
}

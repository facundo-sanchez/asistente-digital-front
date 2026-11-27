/* Service worker de la app instalable (módulo 15): notificaciones push y pantalla sin conexión. */
const BASE = new URL(self.registration.scope).pathname.replace(/\/$/, "");

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

// Push: { title, body, url } (url dentro de la app, sin el basePath)
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "Asistente de Vida Digital", body: event.data ? event.data.text() : "" };
  }
  event.waitUntil(
    self.registration.showNotification(data.title || "Asistente de Vida Digital", {
      body: data.body || "",
      icon: BASE + "/pwa-icon/192",
      badge: BASE + "/pwa-icon/192",
      data: { url: BASE + (data.url || "/notifications") },
      lang: "es-AR",
    }),
  );
});

// Al tocarla: si la app ya está abierta, la lleva ahí; si no, la abre
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL(event.notification.data.url, self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
      const open = windows.find((w) => w.url.startsWith(self.location.origin + BASE));
      return open ? open.navigate(url).then((w) => w && w.focus()) : self.clients.openWindow(url);
    }),
  );
});

// Sin conexión: las páginas no se guardan (son datos de cuentas); se avisa en lugar del error del navegador
self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return;
  event.respondWith(
    fetch(event.request).catch(
      () =>
        new Response(
          '<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
            "<title>Sin conexión</title><body style=\"margin:0;min-height:100vh;display:grid;place-content:center;gap:12px;padding:24px;" +
            'background:#0F2328;color:#E3ECE7;font-family:system-ui,sans-serif;text-align:center">' +
            '<h1 style="margin:0;font-size:1.5rem">Sin conexión</h1>' +
            '<p style="margin:0;color:#9DB8AE">Cuando vuelva internet, la app se actualiza sola.</p>' +
            '<button onclick="location.reload()" style="justify-self:center;padding:12px 20px;border:0;border-radius:10px;background:#8CC5B6;color:#0F2328;font-weight:600">Reintentar</button>',
          { headers: { "Content-Type": "text/html; charset=utf-8" } },
        ),
    ),
  );
});

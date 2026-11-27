"use client";

import { useEffect } from "react";
import { withBasePath } from "@/lib/config";

/** Registra el service worker (app instalable y push). Solo en producción: en desarrollo cachearía mal los cambios. */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register(withBasePath("/sw.js"), { scope: withBasePath("/") }).catch(() => {
      // Sin service worker la app funciona igual, solo sin instalar ni push
    });
  }, []);
  return null;
}

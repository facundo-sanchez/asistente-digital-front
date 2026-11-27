/** Notificaciones push en el navegador (módulo 15). */
import { api } from "@/lib/api/client";

/** La clave VAPID viene en base64url; el navegador la quiere en bytes. */
export function urlBase64ToBytes(base64: string): Uint8Array<ArrayBuffer> {
  const padded = (base64 + "=".repeat((4 - (base64.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(padded);
  const bytes = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

export function pushSupported(): boolean {
  return typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

/** En iPhone y iPad push solo funciona con la app agregada a la pantalla de inicio. */
export function iosNeedsInstall(): boolean {
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone === true;
  return ios && !standalone;
}

export async function currentSubscription(): Promise<PushSubscription | null> {
  const registration = await navigator.serviceWorker.getRegistration();
  return registration ? registration.pushManager.getSubscription() : null;
}

export async function enablePush(): Promise<"enabled" | "denied"> {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return "denied";
  const { publicKey } = await api.get<{ publicKey: string }>("push-subscriptions/public-key");
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToBytes(publicKey) });
  await api.post<void>("push-subscriptions", { ...subscription.toJSON(), userAgent: navigator.userAgent.slice(0, 300) });
  return "enabled";
}

export async function disablePush(): Promise<void> {
  const subscription = await currentSubscription();
  if (!subscription) return;
  await api.post<void>("push-subscriptions/remove", { endpoint: subscription.endpoint });
  await subscription.unsubscribe();
}

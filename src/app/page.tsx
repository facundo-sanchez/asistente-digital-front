import { redirect } from "next/navigation";
import { HOME_PATH } from "@/lib/config";

/** La raíz lleva al inicio de la app (el proxy manda al login si no hay sesión). */
export default function RootPage() {
  redirect(HOME_PATH);
}

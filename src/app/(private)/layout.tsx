import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { requireUser } from "@/lib/server/dal";

/**
 * Layout del área privada. El proxy ya filtró a quien no tiene sesión; acá se
 * confirma con el backend (/users/me) y se obtiene el usuario.
 */
export default async function PrivateLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();
  return <AppShell user={{ name: user.name, email: user.email }}>{children}</AppShell>;
}

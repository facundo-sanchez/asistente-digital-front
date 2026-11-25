import type { ProviderResponse } from "@/types/api";

export interface CreateProviderDialogProps {
  open: boolean;
  /** Nombre que el usuario ya escribió en la búsqueda. */
  initialName: string;
  onClose: () => void;
  onCreated: (provider: ProviderResponse) => void;
}

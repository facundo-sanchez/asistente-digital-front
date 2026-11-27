import type { ProviderResponse } from "@/types/api";

export interface CreateProviderDialogProps {
  open: boolean;
  /** Nombre que el usuario ya escribió en la búsqueda. */
  initialName: string;
  onClose: () => void;
  /** Se llama con el proveedor creado o editado. */
  onCreated: (provider: ProviderResponse) => void;
  /** Con un proveedor propio, el diálogo lo edita en lugar de crear uno. */
  provider?: ProviderResponse;
}

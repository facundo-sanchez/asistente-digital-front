import type { ProviderResponse } from "@/types/api";

export interface ProviderAutocompleteProps {
  value: ProviderResponse | null;
  onChange: (provider: ProviderResponse | null) => void;
  onBlur?: () => void;
  label?: string;
  /** Error de validación del formulario (tiene prioridad sobre helperText). */
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
}

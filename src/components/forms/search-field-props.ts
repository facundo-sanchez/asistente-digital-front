export interface SearchFieldProps {
  /** Texto con el que arranca (ej. el de la URL). */
  initialValue: string;
  placeholder?: string;
  /** Se llama cuando el usuario deja de escribir, con el texto sin espacios de más. */
  onSearch: (text: string) => void;
}

"use client";

import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import TextField, { type TextFieldProps } from "@mui/material/TextField";

export type FormTextFieldProps<T extends FieldValues> = Omit<
  TextFieldProps,
  "name" | "value" | "onChange" | "onBlur" | "error"
> & {
  name: Path<T>;
  control: Control<T>;
};

/** TextField de MUI conectado a react-hook-form. Muestra el error del campo debajo. */
export function FormTextField<T extends FieldValues>({
  name,
  control,
  helperText,
  ...props
}: FormTextFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...props}
          name={field.name}
          value={field.value ?? ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
          inputRef={field.ref}
          error={!!fieldState.error}
          helperText={fieldState.error?.message ?? helperText}
        />
      )}
    />
  );
}

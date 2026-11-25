"use client";

import { useState } from "react";
import type { FieldValues } from "react-hook-form";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { FormTextField, type FormTextFieldProps } from "./FormTextField";

/** Campo de contraseña con botón para mostrar u ocultar. */
export function FormPasswordField<T extends FieldValues>(props: FormTextFieldProps<T>) {
  const [visible, setVisible] = useState(false);
  return (
    <FormTextField
      {...props}
      type={visible ? "text" : "password"}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
                onClick={() => setVisible((v) => !v)}
                edge="end"
              >
                {visible ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}

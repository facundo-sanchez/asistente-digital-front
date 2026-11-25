"use client";

import NextLink from "next/link";
import Button, { type ButtonProps } from "@mui/material/Button";

/**
 * Botón de MUI que navega con Next (respeta basePath y prefetch). Existe para usarlo
 * desde Server Components: ahí no se puede pasar NextLink como prop component.
 */
export function ButtonLink({ href, ...props }: ButtonProps & { href: string }) {
  return <Button component={NextLink} href={href} {...props} />;
}

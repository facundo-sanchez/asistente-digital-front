"use client";

import NextLink from "next/link";
import MuiLink, { type LinkProps } from "@mui/material/Link";

/** Link de MUI con navegación de Next (respeta basePath y prefetch). */
export function TextLink({ href, ...props }: LinkProps & { href: string }) {
  return <MuiLink component={NextLink} href={href} underline="hover" {...props} />;
}

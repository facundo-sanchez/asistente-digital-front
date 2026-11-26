import type { PaymentWallet } from "@/types/api";

/** Billeteras para pagar facturas. Los links son la entrada de cada una: si cambian, se actualizan acá. */
export const WALLETS: Record<PaymentWallet, { name: string; url: string }> = {
  MERCADO_PAGO: { name: "Mercado Pago", url: "https://www.mercadopago.com.ar" },
  MODO: { name: "MODO", url: "https://www.modo.com.ar" },
  CUENTA_DNI: { name: "Cuenta DNI", url: "https://www.bancoprovincia.com.ar/cuentadni" },
};

export interface PaymentTarget {
  /** A dónde se paga, para el botón: «Camuzzi», «Mercado Pago». */
  name: string;
  url: string;
  /** «Pagar en Camuzzi», «Pagar con Mercado Pago». */
  label: string;
}

/** RP-4: primero la página de pago del servicio, después la billetera del usuario. */
export function paymentTarget(
  service: { providerName: string; paymentUrl: string | null } | null,
  wallet: PaymentWallet | null,
): PaymentTarget | null {
  if (service?.paymentUrl) return { name: service.providerName, url: service.paymentUrl, label: "Pagar en " + service.providerName };
  return wallet ? { ...WALLETS[wallet], label: "Pagar con " + WALLETS[wallet].name } : null;
}

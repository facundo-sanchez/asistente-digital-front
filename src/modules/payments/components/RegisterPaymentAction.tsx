"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import { paymentsApi } from "../api";
import { today, type PaymentFormValues } from "../validation";
import { PaymentDialog } from "./PaymentDialog";
import type { RegisterPaymentProps } from "./register-payment-props";

/** Registrar un pago (CU-006). Sugiere el saldo como importe; uno menor queda como pago parcial. */
export function RegisterPaymentAction({ obligation, receipts }: RegisterPaymentProps) {
  const [open, setOpen] = useState(false);
  const initialValues: PaymentFormValues = {
    amount: obligation.balance === null ? "" : String(obligation.balance).replace(".", ","),
    currency: (obligation.currency as PaymentFormValues["currency"]) ?? "ARS",
    paymentDate: today(),
    paymentMethod: "BANK_TRANSFER",
    receiptDocumentId: "",
    notes: "",
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Registrar pago
      </Button>
      {open && (
        <PaymentDialog
          open
          onClose={() => setOpen(false)}
          title={`Registrar pago de «${obligation.title}»`}
          submitLabel="Guardar pago"
          obligation={obligation}
          receipts={receipts}
          initialValues={initialValues}
          showBalance
          onSave={paymentsApi.create}
        />
      )}
    </>
  );
}

/** Validación del alta de un préstamo. Replica la del backend (LoanRequest): el backend vuelve a validar. */
import * as yup from "yup";

const amount = (message: string) =>
  yup
    .string()
    .trim()
    .default("")
    .test("amount", message, (value) => !value || /^\d{1,15}([.,]\d{1,2})?$/.test(value));

export const loanSchema = yup.object({
  lender: yup.string().trim().required("Poné la entidad (banco, financiera o persona)").max(150),
  name: yup.string().trim().required("Poné un nombre para reconocerlo").max(150),
  loanNumber: yup.string().trim().max(60).default(""),
  currency: yup.string().oneOf(["ARS", "USD"]).required(),
  principal: amount("Ingresá un importe válido, ej. 7000000"),
  rateType: yup.string().oneOf(["", "FIXED", "VARIABLE"]).default(""),
  annualRate: amount("Ingresá la TNA, ej. 71"),
  installmentsCount: yup.number().typeError("Poné la cantidad de cuotas").integer().min(1, "Al menos 1").max(360, "Hasta 360").required(),
  installmentAmount: amount("Ingresá un importe válido, ej. 584292,14").test("required", "Poné el importe de la cuota", function (v) {
    // Con tasa fija, capital y TNA se calcula sola (sistema francés)
    const p = this.parent as { rateType: string; principal: string; annualRate: string };
    return !!v || (p.rateType === "FIXED" && !!p.principal && !!p.annualRate);
  }),
  firstDueDate: yup.string().required("Poné cuándo vence la primera cuota"),
  paidInstallments: yup
    .number()
    .typeError("Poné un número")
    .integer()
    .min(0)
    .default(0)
    .test("less", "Tienen que ser menos que el total de cuotas", function (paid) {
      return (paid ?? 0) < (this.parent as { installmentsCount: number }).installmentsCount;
    }),
  notes: yup.string().trim().max(2000).default(""),
});

export type LoanFormValues = yup.InferType<typeof loanSchema>;

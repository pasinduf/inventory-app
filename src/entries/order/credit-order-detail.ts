import { CreditOrderPayment } from "../payment/payment";
import { CreditOrder } from "./order";

export class CreditOrderDetail extends CreditOrder {
  payments: CreditOrderPayment[];
  createdAt:string;
}

export interface UpdateCreditOrderInputs {
  downPayment: number;
  period: number;
  installmentAmount: number;
}

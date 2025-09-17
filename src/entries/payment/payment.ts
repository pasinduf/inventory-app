export class CreditOrderPayment {
  id: string;
  date: string;
  amount: number;
  type: string;
}


export interface PaymentInputs {
  date: string;
  amount: number;
}
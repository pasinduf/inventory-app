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

export class PaymentReceipt {
  date: string;
  orderNumber: string
  customer: string;
  fullAmount: number;
  downPayment: number;
  outstandingAmount: number;
  paidAmount: number;
  balanceAmount: number;
}
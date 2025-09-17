
export class Order {
  id: number;
  date: string;
  orderNumber: string;
  amount: string;
  discount: string;
  isCreditOrder: boolean;
}


export class CreditOrder {
  id: number;
  orderId: number;
  date: string;
  orderNumber: string;
  customer: string;
  startDate: string;
  endDate: string;
  period: number;
  amount: string;
  downPayment: string;
  installmentAmount: string;
  remaining: string;
  isCompleted:boolean;
}


export interface OrderInputs {
  date: string;
  name: string;
  amount?: number;
  description?: string;
}


export class PaymentListResponse {
  count: number;
  pageIndex: number;
  pageSize: number;
  items: Payment[];
  totalAmount:number;
}

export class Payment {
  id: number;
  date: string;
  customer: string;
  amount: number;
  balance: number;
  receiptNo: string;
}


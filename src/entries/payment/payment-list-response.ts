
export class PaymentListResponse {
  count: number;
  pageIndex: number;
  pageSize: number;
  items: PaymentSummaryDto[];
  totalAmount: number;
  totalBalance:number;
  isRange: boolean;
}

export class PaymentSummaryDto {
  date: string;
  customer: string;
  amount: number;
  balance: number;
  receiptNo: string;
  payments: PaymentDto[];
  orderId?: number;
  orderNumber?: string;
  creditOrderId?: number;
  isExpand: boolean;
}


export class PaymentDto {
  customer: string;
  receiptNo: string;
  amount: number;
  balance: number;
  orderId: number;
  orderNumber: string;
  creditOrderId:number;
}

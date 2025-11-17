
export class OrderSummaryListResponse {
  pageSize: number;
  pageIndex: number;
  items: OrderDaySummaryDto[];
  count: number;
  totalAmount: number;
  totalProfit: number;
  isRange:boolean;
}

export class OrderDaySummaryDto {
  date: string;
  orderNumber: string;
  amount: number;
  profit: number;
  orders: OrderSummaryDto[];
  isExpand: boolean;
  isCreditOrder?: boolean;
}


export class OrderSummaryDto {
  orderNumber: string;
  isCreditOrder:boolean;
  amount: number;
  profit: number;
}

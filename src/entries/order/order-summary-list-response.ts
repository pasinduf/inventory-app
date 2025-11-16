
export class OrderSummaryListResponse {
  pageSize: number;
  pageIndex: number;
  items: OrderDaySummaryDto[];
  count: number;
  totalAmount: number;
  totalProfit: number;
}

export class OrderDaySummaryDto {
  date: string;
  orderNumber: string;
  amount: number;
  profit: number;
  orders: OrderSummaryDto[];
  isExpand:boolean;
}


export class OrderSummaryDto {
  orderNumber: string;
  amount: number;
  profit: number;
}

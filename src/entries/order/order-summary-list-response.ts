
export class OrderSummaryListResponse {
  pageSize: number;
  pageIndex: number;
  items: OrderSummaryDto[];
  count: number;
  totalAmount: number;
  totalProfit: number;
}

export class OrderSummaryDto {
  date: string;
  orderNumber: string;
  amount: number;
  profit: number;
}


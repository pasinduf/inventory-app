import { CreditOrder, Order } from "./order";

export class OrderListResponse {
  count: number;
  pageIndex: number;
  pageSize: number;
  items: Order[]
}



export class CreditOrderListResponse {
  count: number;
  pageIndex: number;
  pageSize: number;
  items: CreditOrder[];
}


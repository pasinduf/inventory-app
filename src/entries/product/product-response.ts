import { Product } from "./product";

export class ProductResponse {
  count: number;
  pageIndex: number;
  pageSize: number;
  items: Product[]
}


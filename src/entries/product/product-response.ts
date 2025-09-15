export class ProductResponse {
  count: number;
  pageIndex: number;
  pageSize: number;
  items: Product[]
}

export class Product {
  id: number;
  name: string;
  serialNumber: string;
  unit: string;
  category: string;
  quantity: string;
  status: string;
}

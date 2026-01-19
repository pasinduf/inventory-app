export class Summary {
  totalCategories: number;
  totalProducts: number;
  totalProductsValue: number;
  totalCreditOrdersValue: number;
  outOfStock: LowStockItem[];
}

export class LowStockItem {
  name: string;
  sku: string;
}  
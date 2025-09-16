export class Product {
  id: number;
  name: string;
  serialNumber: string;
  unit: string;
  categoryId:string;
  category: string;
  quantity: string;
  status: string;
}


export interface ProductInputs {
  name: string;
  categoryId: number;
  unit: string;
  supplierId?: number;
  quantity?: number;
  buyingPrice?: number;
  sellingPrice?: number;
}

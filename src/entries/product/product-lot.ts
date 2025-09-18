export class ProductLot {
  id: number;
  date: string;
  quantity: number;
  buyingPrice: number;
  sellingPrice: number;
  supplier:Supplier;
}

export class Supplier {
  id: number;
  name: string;
  address: string;
  contactNumber: string;
}


export interface ProductLotInputs {
  productId: number;
  supplierId: string;
  quantity: number;
  buyingPrice: number;
  sellingPrice: number;
}


export class ProductDetail {
  id: number;
  name: string;
  unit: string;
  productLots: ProductLot[];
}

export class ProductLot {
  id: number;
  date: string;
  quantity: string;
  buyingPrice: string;
  sellingPrice: string;
  supplier: LotSupplier;
  wastages: Wastage[];
}

export class LotSupplier {
  id: number;
  name: string;
  address: string;
  contactNumber:string;
}

export class Wastage {
  id: number;
  date: string;
  quantity: string;
  reason: string;
}



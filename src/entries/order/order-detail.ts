export class OrderDetail {
  id: number;
  date: string;
  orderNumber: string;
  createdAt: string;
  grossAmount: string;
  discount: string;
  netAmount: string;
  isCreditOrder:boolean;
  orderItems: OrderItem[];
}


export class OrderItem {
  serialNumber: string;
  productName: string;
  price: string;
  quantity: string;
  discount: string;
  amount:string
  unit:string;
}
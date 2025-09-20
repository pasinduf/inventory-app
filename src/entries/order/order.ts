
export class Order {
  id: number;
  date: string;
  orderNumber: string;
  amount: string;
  discount: string;
  isCreditOrder: boolean;
}


export class CreditOrder {
  id: number;
  orderId: number;
  date: string;
  orderNumber: string;
  customer: string;
  startDate: string;
  endDate: string;
  period: number;
  amount: string;
  downPayment: string;
  installmentAmount: string;
  remaining: string;
  isCompleted:boolean;
}


export class OrderInputs {
  date: string;
  isCreditOrder: boolean;
  orderDiscount: number;
  items: OrderItem[];
  customerId?:number;
  credit?: Credit;
}

export class OrderItem {
  productId: number;
  productLotId: number;
  quantity: number;
  discount: number;
} 

export class Credit {
  startDate: string;
  downPayment: number;
  period: number;
  installmentAmount: number;
} 

export class CreateOrderResponse {
  status: boolean;
  message: string;
  order: OrderResponse;
}

export class OrderResponse {
  id: number;
  orderNumber: string;
  createdAt: string;
  orderItems: OrderItemResponse[];
  grossAmount: number;
  discount: number;
  netAmount: number;
}

export class OrderItemResponse {
  serialNumber: string;
  name: string;
  price: number;
  quantity: number;
  discount: number;
  amount: number;
}
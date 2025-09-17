
export class Customer {
  id: number;
  customerNumber:string;
  firstName: string;
  lastName: string;
  nic: string;
  contactNumber: string;
  address: string;
  isCreditCustomer: boolean;
}

export interface CustomerInputs {
  firstName: string;
  lastName: string;
  nic: string;
  contactNumber: string;
  address: string;
  isCreditCustomer:boolean;
}

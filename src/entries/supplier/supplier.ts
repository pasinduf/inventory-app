
export class Supplier {
  id: number;
  name: string;
  contactNumber?: string;
  address?: string;
}

export interface SupplierInputs {
  name: string;
  ContactNumber?: string;
  address?: string;
}

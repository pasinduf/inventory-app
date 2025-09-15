
export class Supplier {
  id: number;
  name: string;
  contactNumber?: string;
  address?: string;
}

export enum SupplierField {
  Name = "name",
  ContactNumber = "contactNumber",
  Address = "address",
}

export interface CategoryInputs {
  [SupplierField.Name]: string;
  [SupplierField.ContactNumber]?: string;
  [SupplierField.Address]?: string;
}


export class Category {
  id: number;
  name: string;
  description?: string;
  productCount?:number;
}

export interface CategoryInputs {
  name: string;
  description?: string;
}

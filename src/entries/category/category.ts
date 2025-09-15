
export class Category {
  id: number;
  name: string;
  description?: string;
  productCount?:number;
}

export enum CategoryField {
  Name = "name",
  Description = "description",
}

export interface CategoryInputs {
  [CategoryField.Name]: string;
  [CategoryField.Description]?: string;
}

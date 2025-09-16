
export class Expense {
  id: number;
  date: string;
  name: string;
  amount: number;
  description?: string;
}

export interface ExpenseInputs {
  date: string;
  name: string;
  amount?: number;
  description?: string;
}

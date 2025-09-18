
export class Wastage {
  id: number;
  date: string;
  reason: string;
  quantity: number;
}

export interface WastageInputs {
  lotId: number;
  date: string;
  reason: string;
  quantity: number;
}

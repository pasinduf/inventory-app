
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";
import { ExpenseInputs } from "@/entries/expense/expense";

export const addExpense = async (payload: ExpenseInputs): Promise<any> => {
  const response = await apiClient.post(`${ENDPOINTS.EXPENSE}`, payload);
  return response.data;
};

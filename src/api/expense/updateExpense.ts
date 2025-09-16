
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";
import { ExpenseInputs } from "@/entries/expense/expense";

export const updateExpense = async (id, payload: ExpenseInputs): Promise<any> => {
  const response = await apiClient.put(`${ENDPOINTS.EXPENSE}/${id}`, payload);
  return response.data;
};

import { Expense } from "@/entries/expense/expense";
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";

export const getExpenses = async (params:any): Promise<Expense[]> => {
  const response = await apiClient.get(ENDPOINTS.EXPENSE, { params });
  return response.data;
};

import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";

export const deleteExpense = async (id: number): Promise<any> => {
  const response = await apiClient.delete(`${ENDPOINTS.EXPENSE}/${id}`);
  return response.data;
};

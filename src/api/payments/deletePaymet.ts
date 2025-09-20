
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";

export const deletePayment = async (id:number): Promise<any> => {
  const response = await apiClient.delete(`${ENDPOINTS.ORDERS}/installment/${id}`);
  return response.data;
};

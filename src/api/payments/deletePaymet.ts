
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";

export const deletePayment = async (id:number): Promise<any> => {
  const response = await apiClient.delete(`${ENDPOINTS.PAYMENT}/${id}`);
  return response.data;
};

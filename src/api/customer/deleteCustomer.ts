import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";

export const deleteCustomer = async (id: number): Promise<any> => {
  const response = await apiClient.delete(`${ENDPOINTS.CUSTOMER}/${id}`);
  return response.data;
};

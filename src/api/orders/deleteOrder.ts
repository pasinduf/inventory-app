import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";

export const deleteOrder = async (id: number): Promise<any> => {
  const response = await apiClient.delete(`${ENDPOINTS.ORDERS}/${id}`);
  return response.data;
};

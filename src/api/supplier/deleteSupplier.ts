import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";

export const deleteSupplier = async (id: number): Promise<any> => {
  const response = await apiClient.delete(`${ENDPOINTS.SUPPLIER}/${id}`);
  return response.data;
};

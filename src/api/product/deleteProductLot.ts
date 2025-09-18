
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";

export const deleteProductLot = async (id: number): Promise<any> => {
  const response = await apiClient.delete(`${ENDPOINTS.PRODUCT}/lot/${id}`,);
  return response.data;
};

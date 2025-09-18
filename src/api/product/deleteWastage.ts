
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";

export const deleteWastage = async (id: number): Promise<any> => {
  const response = await apiClient.delete(`${ENDPOINTS.PRODUCT}/wastage/${id}`);
  return response.data;
};

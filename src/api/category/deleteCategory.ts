import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";


export const deleteCategory = async (id: number): Promise<any> => {
  const response = await apiClient.delete(`${ENDPOINTS.CATEGORY}/${id}`);
  return response.data;
};

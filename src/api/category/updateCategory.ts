import { CategoryInputs } from "@/entries/category/category";
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";


export const updateCategory = async (id: number, payload: CategoryInputs): Promise<any> => {
  const response = await apiClient.put(`${ENDPOINTS.CATEGORY}/${id}`, payload);
  return response.data;
};

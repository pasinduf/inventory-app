import { CategoryInputs } from "@/entries/category/category";
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";

export const addCategory = async (payload: CategoryInputs): Promise<any> => {
  const response = await apiClient.post(`${ENDPOINTS.CATEGORY}`, payload);
  return response.data;
};

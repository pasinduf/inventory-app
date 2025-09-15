import { Category } from "@/entries/category/category";
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";

export const getCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get(ENDPOINTS.CATEGORY);
  return response.data;
};
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";
import { CategoryProduct } from "@/entries/category/category-product";

export const getCategoryProducts = async (categoryId: number): Promise<CategoryProduct[]> => {
  const response = await apiClient.get(`${ENDPOINTS.CATEGORY}/${categoryId}/products`);
  return response.data;
};
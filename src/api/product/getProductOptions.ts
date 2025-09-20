import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";
import { ProductOption } from "@/entries/product/option";

export const getProductOptions = async (param: string): Promise<ProductOption[]> => {
  const response = await apiClient.get(`${ENDPOINTS.PRODUCT}/options?search=${param}`);
  return response.data;
};

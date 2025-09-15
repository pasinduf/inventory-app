import { ProductResponse } from "@/entries/product/product-response";
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";

export const getProducts = async (): Promise<ProductResponse> => {
  const response = await apiClient.get(ENDPOINTS.PRODUCT);
  return response.data;
};

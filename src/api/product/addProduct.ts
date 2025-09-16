
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";
import { ProductInputs } from "@/entries/product/product";

export const addProduct = async (payload: ProductInputs): Promise<any> => {
  const response = await apiClient.post(`${ENDPOINTS.PRODUCT}`, payload);
  return response.data;
};

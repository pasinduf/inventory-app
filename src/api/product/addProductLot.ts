
import { ProductLotInputs } from "@/entries/product/product-lot";
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";

export const addProductLot = async (payload: ProductLotInputs): Promise<any> => {
  const response = await apiClient.post(`${ENDPOINTS.PRODUCT}/lot`, payload);
  return response.data;
};

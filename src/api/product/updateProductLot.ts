
import { ProductLotInputs } from "@/entries/product/product-lot";
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";

export const updateProductLot = async (id:number,payload: ProductLotInputs): Promise<any> => {
  const response = await apiClient.put(`${ENDPOINTS.PRODUCT}/lot/${id}`, payload);
  return response.data;
};

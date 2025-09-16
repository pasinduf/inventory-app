
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";
import { ProductInputs } from "@/entries/product/product";

export const updateProduct = async (id:number, payload: ProductInputs): Promise<any> => {
  const response = await apiClient.put(`${ENDPOINTS.PRODUCT}/${id}`, payload);
  return response.data;
};

import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";
import { ProductLot } from "@/entries/product/product-lot";

export const getProductLots = async (id: number): Promise<ProductLot[]> => {
  const response = await apiClient.get(`${ENDPOINTS.PRODUCT}/${id}/lots`);
  return response.data;
};

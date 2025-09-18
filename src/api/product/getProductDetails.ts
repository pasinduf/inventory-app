import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";
import { ProductDetail } from "@/entries/product/product-detail";

export const getProductDetails = async (id:number): Promise<ProductDetail> => {
  const response = await apiClient.get(`${ENDPOINTS.PRODUCT}/${id}`);
  return response.data;
};

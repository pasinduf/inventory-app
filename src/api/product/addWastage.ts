
import { WastageInputs } from "@/entries/product/wastage";
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";

export const addWastage = async (payload: WastageInputs): Promise<any> => {
  const response = await apiClient.post(`${ENDPOINTS.PRODUCT}/wastage`, payload);
  return response.data;
};

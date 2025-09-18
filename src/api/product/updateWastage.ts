
import { WastageInputs } from "@/entries/product/wastage";
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";

export const updateWastage = async (id: number, payload: WastageInputs): Promise<any> => {
  const response = await apiClient.put(`${ENDPOINTS.PRODUCT}/wastage/${id}`, payload);
  return response.data;
};

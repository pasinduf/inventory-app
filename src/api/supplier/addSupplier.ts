
import { SupplierInputs } from "@/entries/supplier/supplier";
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";

export const addSupplier = async (payload: SupplierInputs): Promise<any> => {
  const response = await apiClient.post(`${ENDPOINTS.SUPPLIER}`, payload);
  return response.data;
};

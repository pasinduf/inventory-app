
import { SupplierInputs } from "@/entries/supplier/supplier";
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";

export const updateSupplier = async (id,payload: SupplierInputs): Promise<any> => {
  const response = await apiClient.put(`${ENDPOINTS.SUPPLIER}/${id}`, payload);
  return response.data;
};

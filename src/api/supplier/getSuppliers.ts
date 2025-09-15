import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";
import { Supplier } from "@/entries/supplier/supplier";

export const getSuppliers = async (): Promise<Supplier[]> => {
  const response = await apiClient.get(ENDPOINTS.SUPPLIER);
  return response.data;
};

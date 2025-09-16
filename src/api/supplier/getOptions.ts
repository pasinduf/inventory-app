import { Option } from "@/entries/common/option";
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";

export const getSupplierOptions = async (): Promise<Option[]> => {
  const response = await apiClient.get(`${ENDPOINTS.SUPPLIER}/options`);
  return response.data;
};
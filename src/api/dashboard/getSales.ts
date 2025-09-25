import { Sale } from "@/entries/dashboard/sales";
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";

export const getSales = async (params: any): Promise<Sale[]> => {
  const response = await apiClient.get(`${ENDPOINTS.DASHBOARD}/sales`, { params });
  return response.data;
};

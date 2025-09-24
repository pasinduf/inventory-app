import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";
import { Summary } from "@/entries/dashboard/summary";

export const getSummary = async (): Promise<Summary> => {
  const response = await apiClient.get(`${ENDPOINTS.DASHBOARD}/summary`);
  return response.data;
};

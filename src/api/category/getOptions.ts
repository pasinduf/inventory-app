import { Option } from "@/entries/common/option";
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";

export const getCategoryOptions = async (): Promise<Option[]> => {
  const response = await apiClient.get(`${ENDPOINTS.CATEGORY}/options`);
  return response.data;
};
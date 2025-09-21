
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";

export const login = async (payload: any): Promise<any> => {
  const response = await apiClient.post(`${ENDPOINTS.AUTH}/login`, payload);
  return response.data;
};

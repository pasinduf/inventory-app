
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";

export const updatePassword = async (payload: any): Promise<any> => {
  const response = await apiClient.put(`${ENDPOINTS.AUTH}/update-password`, payload);
  return response.data;
};

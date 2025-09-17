
import { CustomerInputs } from "@/entries/customer/customer";
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";

export const addCustomer = async (payload: CustomerInputs): Promise<any> => {
  const response = await apiClient.post(`${ENDPOINTS.CUSTOMER}`, payload);
  return response.data;
};

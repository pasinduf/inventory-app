import { CustomerOption } from "@/entries/customer/option";
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";

export const getCustomerOptions = async (param: string): Promise<CustomerOption[]> => {
  const response = await apiClient.get(`${ENDPOINTS.CUSTOMER}/options?search=${param}`);
  return response.data;
};

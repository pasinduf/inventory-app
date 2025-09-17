import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";
import { Customer } from "@/entries/customer/customer";

export const getCustomers = async (): Promise<Customer[]> => {
  const response = await apiClient.get(ENDPOINTS.CUSTOMER);
  return response.data;
};

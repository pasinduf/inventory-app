
import { CustomerInputs } from "@/entries/customer/customer";
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";

export const updateCustomer = async (id, payload: CustomerInputs): Promise<any> => {
  const response = await apiClient.put(`${ENDPOINTS.CUSTOMER}/${id}`, payload);
  return response.data;
};

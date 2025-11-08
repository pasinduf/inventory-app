import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";
import { UpdateCreditOrderInputs } from "@/entries/order/credit-order-detail";

export const updateCreditOrder = async (id:number,payload: UpdateCreditOrderInputs): Promise<any> => {
  const response = await apiClient.put(`${ENDPOINTS.ORDERS}/credit/${id}`, payload);
  return response.data;
};

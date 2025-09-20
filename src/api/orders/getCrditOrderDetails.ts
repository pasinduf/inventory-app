import { CreditOrderDetail } from "@/entries/order/credit-order-detail";
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";

export const getCrditOrderDetails = async (id: number): Promise<CreditOrderDetail> => {
  const response = await apiClient.get(`${ENDPOINTS.ORDERS}/credit/${id}`);
  return response.data;
};

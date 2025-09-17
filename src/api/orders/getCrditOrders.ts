import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";
import { CreditOrderListResponse } from "@/entries/order/order-list-response";

export const getCrditOrders = async (params: any): Promise<CreditOrderListResponse> => {
  const response = await apiClient.get(`${ENDPOINTS.ORDERS}/credit`, { params });
  return response.data;
};

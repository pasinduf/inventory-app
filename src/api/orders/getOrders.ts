import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";
import { OrderListResponse } from "@/entries/order/order-list-response";

export const getOrders = async (params: any): Promise<OrderListResponse> => {
  const response = await apiClient.get(ENDPOINTS.ORDERS, { params });
  return response.data;
};

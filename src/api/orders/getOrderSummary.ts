import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";
import { OrderSummaryListResponse } from "@/entries/order/order-summary-list-response";

export const getOrderSummary = async (params: any): Promise<OrderSummaryListResponse> => {
  const response = await apiClient.get(`${ENDPOINTS.ORDERS}/summary`, { params });
  return response.data;
};

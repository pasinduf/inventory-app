import { CreateOrderResponse } from "@/entries/order/order";
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";

export const printOrder = async (orderId: number): Promise<CreateOrderResponse> => {
  const response = await apiClient.get(`${ENDPOINTS.ORDERS}/print/${orderId}`);
  return response.data;
};
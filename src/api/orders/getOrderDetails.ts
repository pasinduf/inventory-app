import { OrderDetail } from "@/entries/order/order-detail";
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";

export const getOrderDetails = async (orderId: number): Promise<OrderDetail> => {
  const response = await apiClient.get(`${ENDPOINTS.ORDERS}/${orderId}`);
  return response.data;
};
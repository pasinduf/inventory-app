import { CreateOrderResponse, OrderInputs } from "@/entries/order/order";
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";

export const createOrder = async (payload: OrderInputs): Promise<CreateOrderResponse> => {
  const response = await apiClient.post(`${ENDPOINTS.ORDERS}`, payload);
  return response.data;
};

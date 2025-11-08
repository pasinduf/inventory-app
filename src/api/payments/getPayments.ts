import { PaymentListResponse } from "@/entries/payment/payment-list-response";
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";

export const getPayments = async (params: any): Promise<PaymentListResponse> => {
  const response = await apiClient.get(ENDPOINTS.PAYMENT, { params });
  return response.data;
};

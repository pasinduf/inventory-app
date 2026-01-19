
import { PaymentInputs } from "@/entries/payment/payment";
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";

export const addPayment = async (payload: PaymentInputs): Promise<any> => {
  const response = await apiClient.post(`${ENDPOINTS.PAYMENT}`, payload);
  return response.data;
};

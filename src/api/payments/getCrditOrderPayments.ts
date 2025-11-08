import { CreditOrderPayment } from "@/entries/payment/payment";
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";

export const getCrditOrderPayments = async (id: number): Promise<CreditOrderPayment[]> => {
  const response = await apiClient.get(`${ENDPOINTS.PAYMENT}/order/${id}`);
  return response.data;
};


import { PaymentInputs } from "@/entries/payment/payment";
import { apiClient } from "..";
import { ENDPOINTS } from "../endpoints";

export const updatePayment = async (id:number,payload: PaymentInputs): Promise<any> => {
  const response = await apiClient.put(`${ENDPOINTS.ORDERS}/installment/${id}`, payload);
  return response.data;
};

import React from "react";
import { getDate, getTime } from "@/lib/dateFormatter";
import { SHOP_ADDRESS, SHOP_NAME, SHOP_PHONE } from "@/api/const";
import { PaymentReceipt } from "@/entries/payment/payment";

const PaymentReceiptPrint: React.FC<{
  payment: PaymentReceipt;
}> = ({ payment }) => {
  return (
    <div id="payment_receipt" className="text-sm font-mono w-full max-w-sm mx-auto">
      <div style={{ textAlign: "center", paddingBottom: "0px" }}>
        <h2 className="text-2xl font-extrabold leading-tight">{SHOP_NAME}</h2>
        <p className="text-xs">{SHOP_ADDRESS}</p>
        <p className="text-xs">TEL:{SHOP_PHONE}</p>
      </div>
      <div className="mb-4">
        <p>
          <strong>Date:</strong> {getDate(payment.date)} {getTime(payment.date)}
        </p>
        <p>
          <strong>Order.No:</strong> {payment.orderNumber}
        </p>
        <p>
          <strong>Receipt No:</strong> {payment.receiptNo}
        </p>
        <p>
          <strong>Customer:</strong> {payment?.customer}
        </p>
      </div>

      <div style={{ textAlign: "right", marginLeft: "30px" }}>
        <p>
          <strong>Full Amount:</strong> {payment.fullAmount.toFixed(2)}
        </p>
        <p>
          <strong>Down Payment:</strong> {payment.downPayment.toFixed(2)}
        </p>
        <p>
          <strong>Outstanding:</strong> {payment.outstandingAmount.toFixed(2)}
        </p>
        <p>
          <strong>Payment:</strong> {payment.paidAmount.toFixed(2)}
        </p>
        <p className="font-bold text-lg">
          <strong>Balance: {payment.balanceAmount.toFixed(2)} </strong>
        </p>
      </div>

      <p className="text-center mt-2 mb-4" style={{ textAlign: "center" }}>
        Thank you for your purchase!
      </p>
      {/* <p className="text-center mt-4">Powered by {SHOP_NAME}</p> */}
    </div>
  );
};

export default PaymentReceiptPrint;

import React from "react";
import { CreateOrderResponse } from "@/entries/order/order";
import { getDate, getTime } from "@/lib/dateFormatter";
import { SHOP_ADDRESS, SHOP_NAME, SHOP_PHONE } from "@/api/const";

const OrderReceipt: React.FC<{ 
  orderResponse: CreateOrderResponse
 }> = ({ orderResponse }) => {

  const { order, isCreditOrder, credit } = orderResponse;

  return (
    <div id="order_receipt" className="text-sm font-mono w-full max-w-sm mx-auto">
      <div style={{ textAlign: "center", paddingBottom: "0px" }}>
        <h2 className="text-2xl font-extrabold leading-tight">{SHOP_NAME}</h2>
        <p className="text-xs">{SHOP_ADDRESS}</p>
        <p className="text-xs">TEL:{SHOP_PHONE}</p>
      </div>
      <div className="mb-4">
        <p>
          <strong>Date:</strong> {getDate(order.createdAt)} {getTime(order?.createdAt)}
        </p>
        <p>
          <strong>Order.No:</strong> {order.orderNumber}
        </p>
        {isCreditOrder && (
          <p>
            <strong>Customer:</strong> {credit?.customerName}
          </p>
        )}
      </div>

      {isCreditOrder ? (
        <div>
          <table className="w-full">
            <thead>
              <tr style={{ borderTop: "1px dashed", borderBottom: "1px dashed" }}>
                <th className="p-1 text-left"></th>
                <th className="p-1 text-left">Product</th>
                <th className="p-1 text-right">Price</th>
                <th className="p-1 text-right">Qty</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="p-1">{item.serialNumber}</td>
                  <td className="p-1">{item.name}</td>
                  <td className="p-1 text-right">{item.price.toFixed(2)}</td>
                  <td className="p-1 text-right">{item.quantity.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ textAlign: "right", marginLeft: "30px" }}>
            <p>
              Discounts: -{order.discount.toFixed(2)}
            </p>
            <p className="font-bold text-lg">
              <strong>Net Total: {credit.amount.toFixed(2)} </strong>
            </p>
            <p>
              Down Payment: {credit.downPayment.toFixed(2)}
            </p>
            <p>
              Period: {credit.period} days
            </p>
            <p>
              Installment: {credit.installmentAmount.toFixed(2)}
            </p>
            <p className="font-bold text-lg">
              <strong>Balance: {credit.balance.toFixed(2)} </strong>
            </p>
          </div>
        </div>
      ) : (
        <div>
          <table className="w-full">
            <thead>
              <tr style={{ borderTop: "1px dashed", borderBottom: "1px dashed" }}>
                <th className="p-1 text-left"></th>
                <th className="p-1 text-left">Product</th>
                <th className="p-1 text-right">Price</th>
                <th className="p-1 text-right">Qty</th>
                <th className="p-1 text-right">Disc.</th>
                <th className="p-1 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="p-1">{item.serialNumber}</td>
                  <td className="p-1">{item.name}</td>
                  <td className="p-1 text-right">{item.price.toFixed(2)}</td>
                  <td className="p-1 text-right">{item.quantity.toFixed(2)}</td>
                  <td className="p-1 text-right">{item.discount.toFixed(2)}</td>
                  <td className="p-1 text-right">{item.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ textAlign: "right", marginLeft: "30px" }}>
            <p>
              Gross Total: {order.grossAmount.toFixed(2)}
            </p>
            <p>
              Discounts: -{order.discount.toFixed(2)}
            </p>
            <p className="font-bold text-lg">
              <strong>Net Total: {order.netAmount.toFixed(2)} </strong>
            </p>
          </div>
        </div>
      )}

      <p className="text-center mt-2 mb-4" style={{ textAlign: "center" }}>
        Thank you for your purchase!
      </p>
      {/* <p className="text-center mt-4">Powered by {SHOP_NAME}</p> */}
    </div>
  );
};

export default OrderReceipt;

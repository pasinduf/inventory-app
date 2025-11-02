import React from "react";
import { OrderResponse } from "@/entries/order/order";
import { getDate, getTime } from "@/lib/dateFormatter";
import { SHOP_NAME } from "@/api/const";

const Receipt: React.FC<{ order: OrderResponse }> = ({ order }) => {
  return (
    <div id="order_receipt" className="p-4 text-sm font-mono">
      <h2 className="text-center text-lg font-bold mb-2">{SHOP_NAME}</h2>
      <div className="mb-4">
        <p>
          <strong>Date:</strong> {getDate(order.createdAt)} {getTime(order?.createdAt)}
        </p>
        <p>
          <strong>Order:</strong> {order.orderNumber}
        </p>
      </div>

      <table className="w-full border-collapse border border-gray-300 mb-4">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="p-1 text-left"></th>
            <th className="p-1 text-left">Product</th>
            <th className="p-1 text-right">Qty</th>
            <th className="p-1 text-right">Price</th>
            <th className="p-1 text-right">Discount</th>
            <th className="p-1 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.orderItems.map((item, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="p-1">{item.serialNumber}</td>
              <td className="p-1">{item.name}</td>
              <td className="p-1 text-right">{item.quantity.toFixed(2)}</td>
              <td className="p-1 text-right">{item.price.toFixed(2)}</td>
              <td className="p-1 text-right">{item.discount.toFixed(2)}</td>
              <td className="p-1 text-right">{item.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right space-y-1">
        <p>
          <strong>Gross Total:</strong> {order.grossAmount.toFixed(2)}
        </p>
        <p>
          <strong>Discounts:</strong> -{order.discount.toFixed(2)}
        </p>
        <p className="font-bold text-lg">
          <strong>Net Total: {order.netAmount.toFixed(2)} </strong>
        </p>
      </div>

      <p className="text-center mb-4">Thank you for your purchase!</p>
      {/* <p className="text-center mt-4">Powered by {SHOP_NAME}</p> */}
    </div>
  );
};

export default Receipt;

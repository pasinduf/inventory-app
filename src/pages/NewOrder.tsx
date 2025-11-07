import React, { useState } from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchableDropdown } from "@/components/ui/searchable-dropdown"; // your custom dropdown
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { getProductOptions } from "@/api/product/getProductOptions";
import { ProductOption } from "@/entries/product/option";
import { getProductLots } from "@/api/product/getProductLots";
import { ProductLot } from "@/entries/product/product-lot";
import { Plus, PrinterIcon, RefreshCw, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { yyyyMMDD } from "@/lib/dateFormatter";
import OrderConfirmDialog from "./components/order/OrderConfirmDialog";
import { CreateOrderResponse, OrderResponse } from "@/entries/order/order";
import OrderReceipt from "./components/order/OrderReceipt";
import AsyncSelect from "react-select/async";

interface OrderItem {
  product: ProductOption;
  lot: ProductLot;
  quantity: number;
  discount: number;
}

const NewOrder = ()=> {

  const today = new Date();
  const [date, setDate] = useState<any>(yyyyMMDD(today));

  const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(null);
  const [lots, setLots] = useState<ProductLot[]>([]);
  const [selectedLot, setSelectedLot] = useState<ProductLot | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [productDiscount, setProductDiscount] = useState<number>(0);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderDiscount, setOrderDiscount] = useState<number>(0);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [orderResponse, setOrderResponse] = useState<CreateOrderResponse | null>(null);


  const fetchProducts = async (search: string) => {
    const products = await getProductOptions(search);
    return products || [];
  };

  const loadOptions = (inputValue: string) =>
    new Promise<ProductOption[]>((resolve) => {
      if (inputValue.length < 3) {
        resolve([]);
        return;
      }

      //Only call api for multiples of 3 characters
      // if (inputValue.length % 3 !== 0) {
      //   resolve([]);
      //   return;
      // }

      fetchProducts(inputValue).then((results) => {
        resolve(results);
      });
  });

  const onSelectProduct = async (product:ProductOption) => {
    setSelectedProduct(product);
    if(!product) {
       setLots([]);
       setSelectedLot(null);
       setQuantity(0);
       setProductDiscount(0);
       return;
    };
  
    const lots = await getProductLots(+product.value);
    setLots(lots || [])
  }

  const onAddToOrder = () => {
    if (!selectedProduct || !selectedLot || quantity <= 0) return;
    
     setOrderItems((prev) => {
       const existingIndex = prev.findIndex((item) => +item.product.value === +selectedProduct.value && item.lot.id === selectedLot.id);

       if (existingIndex !== -1) {
         // If same product & lot exists, update that item
         const updatedItems = [...prev];
         updatedItems[existingIndex] = {
           ...updatedItems[existingIndex],
           quantity: updatedItems[existingIndex].quantity + quantity,
         };
         return updatedItems;
       }

       // Otherwise add new item
       return [
         ...prev,
         {
           product: selectedProduct,
           lot: selectedLot,
           quantity,
           discount: productDiscount,
         },
       ];
     });

    // reset
    setSelectedProduct(null);
    setLots([]);
    setSelectedLot(null);
    setQuantity(0);
    setProductDiscount(0);
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const onOpenChange = (open, data?: CreateOrderResponse) => {
    setOpenConfirm(open);
    if (data) {
      setOrderResponse(data);
       setTimeout(() => {
         handlePrint();
       }, 1000);
    }
  };


  const handlePrint = () => {
    const printContent = document.getElementById("order_receipt")?.innerHTML;
    const printWindow = window.open("", "", "width=600,height=800");
    if (printWindow && printContent) {
      printWindow.document.write(`
      <html>
        <head>
          <style>
            body { font-family: monospace; padding: 10px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border-bottom: 1px solid #ddd; padding: 4px; }
            th { text-align: left; }
            .text-right { text-align: right; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
      printWindow.document.close();
      printWindow.print();
    }
  };


  const clearPage =()=>{
    setDate(yyyyMMDD(today));
    setSelectedProduct(null);
    setSelectedLot(null);
    setLots([]);
    setQuantity(0);
    setProductDiscount(0);
    setOrderDiscount(0)
    setOrderItems([]);
    setOrderResponse(null);
  }


  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: "#020817",
      borderColor: "#fff",
      color: "#fff",
      "&:hover": {
        borderColor: "#fff",
      },
    }),
    input: (provided: any) => ({
      ...provided,
      color: "#fff",
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "#1f1f1f",
      color: "#fff",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#333" : "#1f1f1f",
      color: "#fff",
      cursor: "pointer",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "#fff",
    }),
  };

  const grossTotal = orderItems.reduce((sum, item) => sum + item.quantity * item.lot.sellingPrice, 0);
  const totalProductDiscount = orderItems.reduce((sum, item) => sum + item.quantity*item.discount, 0);
  const netTotal = grossTotal - totalProductDiscount - orderDiscount;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-4">
        <Card className="self-start">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Create Order</h2>
              <Button variant="outline" onClick={clearPage}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" placeholder="Select date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium">Select Product</label>
              {/* <SearchableDropdown placeholder="Search product..." displayKey="name" fetchItems={fetchProducts} onSelect={(item) => onSelectProduct(item)} /> */}
              <AsyncSelect
                loadOptions={loadOptions}
                isClearable
                value={selectedProduct}
                onChange={(product) => onSelectProduct(product)}
                styles={customStyles}
                placeholder="Search product..."
              />
            </div>

            {selectedProduct && lots.length > 0 && (
              <div>
                <h3 className="font-sm pt-2 mb-2">Available Lots</h3>
                <div className="space-y-2">
                  {lots.map((lot) => (
                    <div
                      key={lot.id}
                      className={`p-2 border rounded-md cursor-pointer ${selectedLot?.id === lot.id ? "border-blue-500 bg-slate-600" : ""}`}
                      onClick={() => setSelectedLot(lot)}
                    >
                      <div className="flex justify-between text-sm">
                        <span>Date: {lot.date}</span>
                        <span>Price: {lot.sellingPrice}</span>
                        <span>Qty: {lot.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enter amount + discount */}
            {selectedProduct && selectedLot && (
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={quantity || ""}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val > Number(selectedLot.quantity)) {
                      setQuantity(Number(selectedLot.quantity));
                    } else if (val < 0) {
                      setQuantity(0);
                    } else {
                      setQuantity(val);
                    }
                  }}
                />
                <Input
                  type="number"
                  placeholder="Discount"
                  value={productDiscount || ""}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setProductDiscount(Number(e.target.value))}
                />
                <div className="flex justify-end py-2">
                  <Button onClick={onAddToOrder}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* <div className="flex justify-end">
              {orderResponse && (
                <Button variant="outline" className="bg-gradient-primary" onClick={handlePrint}>
                  <PrinterIcon className="h-4 w-4" /> Print
                </Button>
              )}
            </div> */}
          </CardContent>
        </Card>

        {/* RIGHT SIDE - Order Summary */}
        <div>
          <Card className="self-start">
            <CardHeader>
              <h2 className="text-xl font-semibold">Order Summary</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderItems.length === 0 ? (
                <p className="text-gray-500">No products added</p>
              ) : (
                <div className="space-y-2">
                  {orderItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">{item.product.label}</p>
                        <p className="text-sm text-gray-500">
                          Price: {item.lot.sellingPrice} | Qty: {item.quantity} | Discount: {item.discount.toFixed(2)}
                        </p>
                      </div>
                      <Button size="sm" className="bg-red-600 text-white hover:bg-red-700" onClick={() => handleRemoveItem(index)} disabled={!!orderResponse}>
                        <Trash2 className="h-12 w-12" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Order discount */}
              <div>
                <label className="block text-sm font-medium mb-1">Total Order Discount</label>
                <Input type="number" placeholder="Enter discount" value={orderDiscount || ""} onChange={(e) => setOrderDiscount(Number(e.target.value))} />
              </div>

              {/* Totals */}
              <div className="border-t pt-2 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Gross Total:</span>
                  <span>{grossTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Products Discount:</span>
                  <span>- {totalProductDiscount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Order Discount:</span>
                  <span>- {orderDiscount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Net Total:</span>
                  <span>{netTotal.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-end py-4">
            <Button className="bg-gradient-primary" onClick={() => setOpenConfirm(true)} disabled={orderItems.length == 0 || !!orderResponse}>
              Create Order
            </Button>
          </div>
        </div>
      </div>

      <OrderConfirmDialog
        open={openConfirm}
        onOpenChange={onOpenChange}
        order={{
          date,

          items: orderItems,
          grossTotal,
          orderDiscount,
          totalProductDiscount,
          netTotal,
        }}
      />

      <div className="hidden">
        {orderResponse && <OrderReceipt orderResponse={orderResponse} />}
      </div>
    </div>
  );
}

export default NewOrder;

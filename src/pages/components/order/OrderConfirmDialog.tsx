import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import * as z from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoaderCircle, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductOption } from "@/entries/product/option";
import { ProductLot } from "@/entries/product/product-lot";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchableDropdown } from "@/components/ui/searchable-dropdown";
import { getCustomerOptions } from "@/api/customer/getCustomerOptions";
import { CustomerOption } from "@/entries/customer/option";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { addDaysToDate, yyyyMMDD } from "@/lib/dateFormatter";
import { Button } from "@/components/ui/button";
import { OrderInputs, OrderResponse } from "@/entries/order/order";
import { createOrder } from "@/api/orders/createOrder";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_ERROR_MESSAGE } from "@/api/const";

interface OrderItem {
  product: ProductOption;
  lot: ProductLot;
  quantity: number;
  discount: number;
}

interface Order {
  date:Date,
  items: OrderItem[];
  grossTotal: number;
  orderDiscount:number;
  totalProductDiscount: number;
  netTotal: number;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean, orderResponse?: OrderResponse) => void;
  order: Order;
}


const OrderConfirmDialog = ({ open, onOpenChange, order }: Props) => {

  const { toast } = useToast();
  
  const today = new Date();
  const [startDate,setStartDate] = useState<any>(yyyyMMDD(today));
  const [endDate, setEndDate] = useState<any>(null);

  const defaultValues = { downPayment: 0, period: 0, installmentAmount: 0 };
  const [credit, setCredit] = useState(defaultValues);

  const [isCrdit, setIsCredit] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerOption| null>(null);
  
  const [submitting, setSubmitting] = useState(false);

  const itemsPerPage = 5;

  const fetchCustomers = async (search: string) => {
    const customers = await getCustomerOptions(search);
    return customers || [];
  };

  const onChangeInput=(event:any)=>{
    setCredit({
      ...credit,
      [event.target.name]: +event.target.value,
    });
  }


  useEffect(()=>{
      if(startDate && credit.period >0){
        const endDate = addDaysToDate(startDate,credit.period);
        setEndDate(endDate);
      }
  },[credit.period])

  const validateOrder = () =>{
    if(isCrdit)
      return startDate && selectedCustomer && credit.period > 0 && credit.installmentAmount > 0 && credit.downPayment > 0 && order.items?.length > 0;
    return order.items?.length >0;
  }


  const onConfirm = async () => {
    setSubmitting(true);
    try {
       const orderItems = [];
       order.items.map((item) => {
         orderItems.push({
           productId: +item.product?.value,
           productLotId: +item.lot?.id,
           quantity: +item.quantity,
           discount: +item.discount,
         });
       });

       const payload: OrderInputs = {
         date: `${order.date}`,
         isCreditOrder: isCrdit,
         orderDiscount: order.orderDiscount,
         items: orderItems,
       };

       if (isCrdit) {
         payload.customerId = +selectedCustomer.value;
         payload.credit = { ...credit, startDate };
       }

      const result = await createOrder(payload);
      if (result && result.status) {
        onOpenChange(false, result.order);
        toast({
          variant: "success",
          title: `Order ${result.order?.orderNumber} Created Successfully!!`,
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: `${(error as any)?.response?.data?.message || DEFAULT_ERROR_MESSAGE}`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const clearForm = ()=>{
    setSelectedCustomer(null);
    setStartDate(yyyyMMDD(today));
    setCredit(defaultValues);
  }

  const onclose = (open:boolean)=>{
    setIsCredit(false)
    clearForm();
    onOpenChange(open);
  }



  return (
    <Dialog open={open} onOpenChange={() => onclose(false)}>
      <DialogContent className="max-w-3xl max-h-auto overflow-hidden">
        {submitting && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <LoaderCircle className="h-24 w-24 text-white animate-spin" />
          </div>
        )}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Confirm Order
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left"></TableHead>
                <TableHead className="text-left">Product</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Discount</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order?.items.length === 0 ? (
                // Loading skeleton rows
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <TableRow key={index} className="border-b border-border">
                    <TableCell className="py-2 px-2">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                // item rows
                <>
                  {[...order?.items, ...order?.items, ...order?.items, ...order?.items]?.map((item, index) => (
                    <TableRow key={`item_${index}`}>
                      <TableCell className="text-muted-foreground">{item.product.serialNumber}</TableCell>
                      <TableCell className="text-muted-foreground">{item.product.name}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{item.lot.sellingPrice}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{item.quantity.toFixed(2)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{item.discount.toFixed(2)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{(item.quantity * (item.lot.sellingPrice - item.discount)).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}

                  {order && order?.items?.length > 0 && (
                    <TableRow>
                      <TableCell>Total</TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell className="text-right text-muted-foreground">{order.grossTotal.toFixed(2)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{(order.totalProductDiscount + order.orderDiscount).toFixed(2)}</TableCell>
                      <TableCell className="text-right">{order.netTotal.toFixed(2)}</TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </ScrollArea>

        <div>
          <div className="pt-2">
            <Checkbox
              id="terms"
              checked={isCrdit}
              onCheckedChange={(checked) => {
                setIsCredit(!!checked);
                setSelectedCustomer(null);
                setCredit(defaultValues);
              }}
            />
            <label htmlFor="terms" className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Crdit Order
            </label>
          </div>

          {isCrdit && (
            <>
              <div className="text-muted-foreground mt-3">
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="grid gap-2">
                    <label className="block text-sm font-medium">Select Customer</label>
                    <SearchableDropdown
                      placeholder="Search customer..."
                      displayKey="name"
                      fetchItems={fetchCustomers}
                      onSelect={(item) => setSelectedCustomer(item)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" type="date" placeholder="Select date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="period">
                      Period (Days)
                      {credit.period > 0 && endDate && <Label className="mt-2 text-sm"> - End date: {yyyyMMDD(endDate)}</Label>}
                    </Label>
                    <Input
                      id="period"
                      name="period"
                      type="number"
                      value={credit.period}
                      min={0}
                      step="any"
                      onFocus={(e) => e.target.select()}
                      onChange={onChangeInput}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="grid gap-2">
                    <Label htmlFor="downPayment">Down Payment</Label>
                    <Input
                      id="downPayment"
                      name="downPayment"
                      type="number"
                      value={credit.downPayment}
                      min={0}
                      step="any"
                      onFocus={(e) => e.target.select()}
                      onChange={onChangeInput}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="installmentAmount">Installment Amount</Label>
                    <Input
                      id="installmentAmount"
                      type="number"
                      name="installmentAmount"
                      value={credit.installmentAmount}
                      min={0}
                      step="any"
                      onFocus={(e) => e.target.select()}
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onclose(false)}>
              Cancel
            </Button>
            <Button className="bg-gradient-primary ml-3" type="submit" onClick={onConfirm} disabled={!validateOrder()}>
              Coinfrm Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderConfirmDialog;

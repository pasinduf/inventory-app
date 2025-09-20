import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package,AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getOrderDetails } from "@/api/orders/getOrderDetails";
import { getDate, getTime, yyyyMMDD } from "@/lib/dateFormatter";


interface Props {
  orderId: number;
  orderNumber:string;
  children: React.ReactNode;
}

const OrderDetailsDialog = ({ orderId, orderNumber, children }: Props) => {
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState(null);
  
  const itemsPerPage = 5;

  

  useEffect(() => {
    if (open && orderId) {
      fetchOrderDetails();
    }
  }, [open, orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getOrderDetails(orderId);
      setOrder(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order # {orderNumber}
          </DialogTitle>

          {order && (
            <DialogDescription>
              <div className="ml-7">
                Date: {getDate(order.createdAt)} {getTime(order?.createdAt)}
              </div>
            </DialogDescription>
          )}
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Discount</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Loading skeleton rows
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <TableRow key={index} className="border-b border-border">
                    <TableCell className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <Skeleton className="h-4 w-48" />
                      </div>
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
                    <TableCell className="py-4 px-4">
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                  </TableRow>
                ))
              ) : error ? (
                // Error state
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <AlertCircle className="h-12 w-12 text-destructive" />
                      <div>
                        <h3 className="font-medium text-foreground">Failed to load products</h3>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : order.orderItems?.length === 0 ? (
                // Empty state
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Package className="h-12 w-12 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium text-foreground">No records found</h3>
                        {/* <p className="text-muted-foreground">{searchQuery ? "Try adjusting your search terms" : "No products available at the moment"}</p> */}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                // Product rows
                <>
                  {order.orderItems?.map((item) => (
                    <TableRow key={item.serialNumber}>
                      <TableCell className="text-muted-foreground">{item.productName}</TableCell>
                      <TableCell className="text-muted-foreground">{item.serialNumber}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 text-muted-foreground">{item.price}</div>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {item.quantity}
                        <span className="text-sm ml-1">/ {item.unit}</span>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        <div className="flex items-center justify-end gap-1">{item.discount}</div>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        <div className="flex items-center justify-end gap-1">{item.amount}</div>
                      </TableCell>
                    </TableRow>
                  ))}

                  {order && (
                    <TableRow>
                      <TableCell>Total</TableCell>
                      <TableCell colSpan={2}></TableCell>
                      <TableCell className="text-right text-muted-foreground">{order.grossAmount}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{order.discount}</TableCell>
                      <TableCell className="text-right">{order.netAmount}</TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package,AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getCrditOrderPayments } from "@/api/payments/getCrditOrderPayments";
import { Badge } from "@/components/ui/badge";


interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: number;
  customer:string;
}

const OrderPaymentsDialog = ({ open, onOpenChange, orderId, customer }: Props) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payments, setPayments] = useState(null);
  const [order, setOrder] = useState(null);

  const itemsPerPage = 5;

  useEffect(() => {
    if (open && orderId) {
      fetchInstallments();
    }
  }, [open, orderId]);

  const fetchInstallments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getCrditOrderPayments(orderId);
      setPayments(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* <DialogTrigger asChild>{children}</DialogTrigger> */}
      <DialogContent className="max-w-xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Order Payments
          </DialogTitle>

          <DialogDescription>
            <div className="mt-1">{customer}</div>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Date</TableHead>
                <TableHead className="text-left">Amount</TableHead>
                <TableHead className="text-left">Type</TableHead>
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
                  </TableRow>
                ))
              ) : error ? (
                // Error state
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <AlertCircle className="h-12 w-12 text-destructive" />
                      <div>
                        <h3 className="font-medium text-foreground">Failed to load payments</h3>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : payments?.length === 0 ? (
                // Empty state
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Package className="h-12 w-12 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium text-foreground">No records found</h3>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                // payment rows
                <>
                  {payments?.map((item) => (
                    <TableRow key={item.serialNumber}>
                      <TableCell className="text-muted-foreground">{item.date}</TableCell>
                      <TableCell className="text-muted-foreground">{item.amount}</TableCell>
                      <TableCell className="text-left">
                        <Badge className={`${item.type === "Installment" ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"}`}>
                          {item.type}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* {order && (
                    <TableRow>
                      <TableCell>Total</TableCell>
                      <TableCell colSpan={2}></TableCell>
                      <TableCell className="text-right text-muted-foreground">{order.grossAmount}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{order.discount}</TableCell>
                      <TableCell className="text-right">{order.netAmount}</TableCell>
                    </TableRow>
                  )} */}
                </>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default OrderPaymentsDialog;

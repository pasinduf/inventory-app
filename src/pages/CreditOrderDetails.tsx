import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus,  Package, AlertCircle,View, EyeIcon, List, Edit, Trash2, LoaderCircle, PrinterIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { getDate, getTime, yyyyMMDD } from "@/lib/dateFormatter";
import { PaginationWrapper } from "@/components/PaginationWrapper";
import { getOrders } from "@/api/orders/getOrders";
import { Badge } from "@/components/ui/badge";
import OrderDetailsDialog from "./components/order/OrderDetailsDialog";
import { useNavigate, useParams } from "react-router-dom";
import { getCrditOrderDetails } from "@/api/orders/getCrditOrderDetails";
import { CreditOrderDetail } from "@/entries/order/credit-order-detail";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { deletePayment } from "@/api/payments/deletePaymet";
import { DEFAULT_ERROR_MESSAGE } from "@/api/const";
import { AddPaymentDialog } from "./components/payment/AddPaymentDialog";
import { CreditOrderPayment, PaymentReceipt } from "@/entries/payment/payment";
import PaymentReceiptPrint from "./components/payment/PaymentReceipt";
import { it } from "node:test";

const CreditOrderDetails = () => {

  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<CreditOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState<PaymentReceipt | null>(null);
  const itemsPerPage = 5;


   useEffect(() => {
      if (id) {
        fetchCreditOrderDetails();
      }
    }, [id]);
    
  const fetchCreditOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getCrditOrderDetails(+id);
        setOrder(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch order details");
      } finally {
        setLoading(false);
      }
  };


   const onDeletePayment = async (id) => {
      try {
        const result = await deletePayment(id);
        if (result) {
          toast({
            variant: "success",
            title: `Payment Deleted Successfully`,
          });
          fetchCreditOrderDetails();
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: `${(error as any)?.response?.data?.message || DEFAULT_ERROR_MESSAGE}`,
        });
      }
  };

  const onOpenChangeAdd = (refresh: boolean, open: boolean, response?: PaymentReceipt) => {
    setOpenAdd(open);
    if (refresh) fetchCreditOrderDetails();
    if (response) {
      setPaymentResponse(response);
      setTimeout(() => {
        handlePrint();
      }, 1000);
    }
  };

   const handlePrint = () => {
     const printContent = document.getElementById("payment_receipt")?.innerHTML;
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

   const onPrint = (item: CreditOrderPayment) => {
     const data = {
       date: item.date,
       orderNumber: order.orderNumber,
       customer: order.customer,
       fullAmount: Number(order.amount),
       downPayment: Number(order.downPayment),
       outstandingAmount: Number(item.balance) + Number(item.amount),
       paidAmount: Number(item.amount),
       balanceAmount: Number(item.balance),
       receiptNo: item.receiptNo,
     };
     setPaymentResponse(data);
      setTimeout(() => {
        handlePrint();
      }, 500);
   };

  

  return (
    <div className="min-h-screen p-6 flex justify-center">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <LoaderCircle className="h-24 w-24 text-white animate-spin" />
        </div>
      )}
      {!loading && order && (
        <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
          <Card className="self-start md:w-2/5">
            <CardHeader>
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold">Order # {order?.orderNumber}</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-muted-foreground">
                <span className="font-medium">Date:</span>
                <span>{getDate(order?.createdAt)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span className="font-medium">Time:</span>
                <span>{getTime(order?.createdAt)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span className="font-medium">Customer:</span>
                <span>{order?.customer}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span className="font-medium">Amount:</span>
                <span>{order?.amount}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span className="font-medium">Down Payment:</span>
                <span>{order?.downPayment}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span className="font-medium">Start Date:</span>
                <span>{order?.startDate}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span className="font-medium">End Date:</span>
                <span>{order?.endDate}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span className="font-medium">Period:</span>
                <span>{order?.period} Days</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span className="font-medium">Installment:</span>
                <span>{order?.installmentAmount}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span className="font-medium">Balance:</span>
                <span>{order?.remaining}</span>
              </div>
              <div className="flex justify-between text-muted-foreground pt-4">
                <span className="font-medium"></span>

                <OrderDetailsDialog orderId={order?.orderId} orderNumber={order?.orderNumber}>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </OrderDetailsDialog>
              </div>
            </CardContent>
          </Card>

          {/* Right: Payments Card */}
          <div className="md:w-3/5">
            <div className="rounded-2xl shadow-lg flex flex-col gap-2">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-semibold">Payments</h2>
                <Button onClick={() => setOpenAdd(true)}>
                  <Plus className="h-2 w-2" />
                </Button>
              </div>

              <ScrollArea className="h-[80vh] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky top-0 text-left">Date</TableHead>
                      <TableHead className="sticky top-0 text-left">Rec.No</TableHead>
                      <TableHead className="sticky top-0 text-right">Amount</TableHead>
                      <TableHead className="sticky top-0 text-center">Type</TableHead>
                      <TableHead className="sticky top-0 text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      // Loading skeleton rows
                      Array.from({ length: itemsPerPage }).map((_, index) => (
                        <TableRow key={index} className="border-b border-border">
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
                            <Skeleton className="h-4 w-16" />
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
                    ) : order?.payments?.length === 0 ? (
                      // Empty state
                      <TableRow>
                        <TableCell colSpan={8} className="py-12 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <Package className="h-12 w-12 text-muted-foreground" />
                            <div>
                              <h3 className="font-medium text-foreground">No payments found</h3>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      // payment rows
                      <>
                        {order.payments?.map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell className="text-muted-foreground">{item.date}</TableCell>
                            <TableCell className="text-muted-foreground">{item.receiptNo}</TableCell>
                            <TableCell className="text-right text-muted-foreground">{item.amount}</TableCell>
                            <TableCell className="text-center text-muted-foreground">
                              <Badge className={`${item.type === "Installment" ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"}`}>
                                {item.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-center">
                              {index == 0 && item.type == "Installment" && (
                                <>
                                  {/* <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-2" onClick={() => {}}>
                                    <Edit className="h-3 w-3" />
                                  </Button> */}
                                  <ConfirmDialog
                                    title="Delete Payment"
                                    description="Are you sure you want to delete this payment?"
                                    confirmText="Delete"
                                    variant="destructive"
                                    onConfirm={() => onDeletePayment(item.id)}
                                  >
                                    <Button variant="ghost" size="sm" className="text-destructive h-8 w-8 ml-3">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </ConfirmDialog>
                                </>
                              )}
                              {item.type === "Installment" && (
                                <Button variant="ghost" size="sm" className="ml-1" onClick={() => onPrint(item)}>
                                  <PrinterIcon className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </div>

          <AddPaymentDialog order={order} open={openAdd} onOpenChange={onOpenChangeAdd} />

          <div className="hidden">{paymentResponse && <PaymentReceiptPrint payment={paymentResponse} />}</div>
        </div>
      )}
    </div>
  );
};

export default CreditOrderDetails;


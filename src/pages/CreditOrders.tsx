import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search,  Package, AlertCircle} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationWrapper } from "@/components/PaginationWrapper";
import { getCrditOrders } from "@/api/orders/getCrditOrders";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import OrderPaymentsDialog from "./components/order/OrderPaymentsDialog";
import { AddPaymentDialog } from "./components/payment/AddPaymentDialog";
import { PaymentReceipt } from "@/entries/payment/payment";
import PaymentReceiptPrint from "./components/payment/PaymentReceipt";
import { UpdateCreditOrderDialog } from "./components/order/UpdateCreditOrderDialog";
import { CreditOrderListResponse } from "@/entries/order/order-list-response";
import CreditOrderRow from "./components/order/CreditOrderRaw";
import { CreditOrder } from "@/entries/order/order";

const CreditOrders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isInitial, setIsInitial] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<CreditOrderListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status,setStatus] = useState<string>("active");

  const [openView, setOpenView] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [order, setOrder] = useState(null);
  const [paymentResponse, setPaymentResponse] = useState<PaymentReceipt | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    if (status && isInitial) {
      fetchOrders();
    }
  }, [isInitial]);

   useEffect(() => {
     if (!isInitial) {

       if (searchQuery.length === 0) {
         fetchOrders();
         return;
       }
      if (searchQuery.length > 0 && searchQuery.length < 3) return;

      const timer = setTimeout(() => {
        fetchOrders();
      }, 500);

        return () => clearTimeout(timer);
     }
   }, [searchQuery,currentPage, status]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        status,
        searchTerm: searchQuery,
        pageSize: itemsPerPage,
        pageIndex: currentPage-1,
      };

      const response = await getCrditOrders(params);
      setData(response);
      if (isInitial) setIsInitial(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };


  const onOpenChangeView = (open: boolean) => {
    setOpenView(open);
  };

  const onOpenChangeAdd = (refresh:boolean,open: boolean,response?: PaymentReceipt) => {
    setOpenAdd(open);
    if (refresh) fetchOrders();
    if (response) {
      setPaymentResponse(response);
      setTimeout(() => {
        handlePrint();
      }, 1000);
    }
  };

  
  const onOpenChangeEdit = (refresh: boolean, open: boolean) => {
    setOpenEdit(open);
    setOrder(null);
    if (refresh) fetchOrders();
  };


  const handleEdit = useCallback((order: CreditOrder) => {
    setOrder(order);
    setOpenEdit(true);
  }, []);
  

  const handleAddPayment = useCallback((order: CreditOrder) => {
    setOrder(order);
    setOpenAdd(true);
  }, []);

  const handleViewPayments = useCallback((order: CreditOrder) => {
    setOrder(order);
    setOpenView(true);
  }, []);
  


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


  const totalPages = Math.ceil(data?.count / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Credit Orders</h1>
          <p className="text-muted-foreground">Manage your credit order details.</p>
        </div>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-2">
          <div className="flex items-center gap-4">
            <div className="relative flex-[10]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders by customer name , order number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex-[2]">
              <select
                id="type"
                name="type"
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* <div className="flex-[2]">
              <Input id="fromDate" type="date" placeholder="Select date" className="w-full" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>

            <div className="flex-[2]">
              <Input id="toDate" type="date" placeholder="Select date" className="w-full" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div> */}

            {/* <div className="flex-[2]">
              <Button variant="outline" className="w-full" onClick={fetchOrders}>
                Search
              </Button>
            </div> */}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Orders ({data?.count})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-border">
                  <TableHead className="text-left py-3 px-4 font-medium text-muted-foreground">Date</TableHead>
                  <TableHead className="text-left py-3 px-4 font-medium text-muted-foreground">Order #</TableHead>
                  <TableHead className="text-left py-3 px-4 font-medium text-muted-foreground">Customer</TableHead>
                  <TableHead className="text-left py-3 px-4 font-medium text-muted-foreground">Amount</TableHead>
                  <TableHead className="text-left py-3 px-4 font-medium text-muted-foreground">Down Payment</TableHead>
                  <TableHead className="text-left py-3 px-4 font-medium text-muted-foreground">Balance</TableHead>
                  <TableHead className="text-left py-3 px-4 font-medium text-muted-foreground">Status</TableHead>
                  <TableHead className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</TableHead>
                  <TableHead className="text-left py-3 px-4 font-medium text-muted-foreground"></TableHead>
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
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <Skeleton className="h-4 w-20" />
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
                          <h3 className="font-medium text-foreground">Failed to load orders</h3>
                          {/* <p className="text-muted-foreground">{error}</p> */}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : data?.items?.length === 0 ? (
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
                  // order rows
                  data?.items?.map((order) => (
                    <CreditOrderRow
                        key={order.id}
                        order={order}
                        handleEdit={handleEdit}
                        handleAddPayment={handleAddPayment}
                        handleViewPayments={handleViewPayments}
                    />
                  ))
                )}
              </TableBody>
            </Table>

            {order && 
              <UpdateCreditOrderDialog 
                creditOrder={order} 
                open={openEdit} 
                onOpenChange={onOpenChangeEdit} 
              />
            }
            <OrderPaymentsDialog orderId={order?.id} customer={order?.customer} open={openView} onOpenChange={onOpenChangeView} />
            <AddPaymentDialog order={order} customer={order?.customer} open={openAdd} onOpenChange={onOpenChangeAdd} />
          </div>

          {!loading && !error && data?.items?.length > 0 && (
            <PaginationWrapper currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} className="mt-6" />
          )}
        </CardContent>
      </Card>

      <div className="hidden">{paymentResponse && <PaymentReceiptPrint payment={paymentResponse} />}</div>
    </div>
  );
};

export default CreditOrders;


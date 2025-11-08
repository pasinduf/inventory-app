import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus,  Package, AlertCircle,View, Info, MoreHorizontal, Edit, ArrowBigRightDash, ArrowRight, PlusIcon, PencilIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { yyyyMMDD } from "@/lib/dateFormatter";
import { PaginationWrapper } from "@/components/PaginationWrapper";
import { Badge } from "@/components/ui/badge";
import { getCrditOrders } from "@/api/orders/getCrditOrders";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import OrderDetailsDialog from "./components/order/OrderDetailsDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import OrderPaymentsDialog from "./components/order/OrderPaymentsDialog";
import { AddPaymentDialog } from "./components/payment/AddPaymentDialog";
import { useNavigate } from "react-router-dom";
import { PaymentReceipt } from "@/entries/payment/payment";
import PaymentReceiptPrint from "./components/payment/PaymentReceipt";
import { UpdateCreditOrderDialog } from "./components/order/UpdateCreditOrderDialog";

const CreditOrders = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isInitial, setIsInitial] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openView, setOpenView] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [order, setOrder] = useState(null);
  const [paymentResponse, setPaymentResponse] = useState<PaymentReceipt | null>(null);

  const itemsPerPage = 5;

  useEffect(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const today = now;

    setFromDate(yyyyMMDD(firstDay));
    setToDate(yyyyMMDD(today));
  }, []);

  useEffect(() => {
    if (fromDate && toDate && isInitial) {
      fetchOrders();
    }
  }, [fromDate, toDate, isInitial]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getCrditOrders({
        fromDate,
        toDate,
      });
      setData(response.items);
      if (isInitial) setIsInitial(false);
      handlePageChange(1);
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

  const filteredData = data?.filter((order) => 
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchQuery.toLowerCase())
);

  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData?.slice(startIndex, startIndex + itemsPerPage);

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
            <div className="relative flex-[6]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders by order number, customer"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex-[2]">
              <Input id="fromDate" type="date" placeholder="Select date" className="w-full" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>

            <div className="flex-[2]">
              <Input id="toDate" type="date" placeholder="Select date" className="w-full" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>

            <div className="flex-[2]">
              <Button variant="outline" className="w-full" onClick={fetchOrders}>
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Orders ({filteredData?.length})
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
                ) : paginatedData?.length === 0 ? (
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
                  paginatedData?.map((order) => (
                    <TableRow key={order.id} className="border-b border-border hover:bg-muted/50">
                      <TableCell className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-muted-foreground">{order.date}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-4 cursor-pointer">
                        <OrderDetailsDialog orderId={order.orderId} orderNumber={order.orderNumber}>
                          <Button variant="outline" size="sm">
                            {order.orderNumber}
                          </Button>
                        </OrderDetailsDialog>
                      </TableCell>
                      <TableCell className="py-4 px-4 text-muted-foreground">{order.customer}</TableCell>
                      <TableCell className="py-4 px-4 text-muted-foreground">{order.amount}</TableCell>
                      <TableCell className="py-4 px-4 text-muted-foreground">{order.downPayment}</TableCell>
                      <TableCell className="py-4 px-4 text-muted-foreground">
                        {order.remaining}

                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-2">
                              <Info className="h-3 w-3 text-muted-foreground" />
                            </Button>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-auto">
                            <div>
                              <div className="text-muted-foreground">Start Date: {order.startDate}</div>
                              <div className="text-muted-foreground">End Date: {order.endDate}</div>
                              <div className="text-muted-foreground">Period: {order.period} DAYS</div>
                              <div className="text-muted-foreground">Installment: {order.installmentAmount}</div>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      </TableCell>
                      <TableCell className="text-left">
                        {order.isCompleted ? (
                          <Badge className="bg-success text-success-foreground">Completed</Badge>
                        ) : (
                          <Badge className="bg-warning text-warning-foreground">Active</Badge>
                        )}
                      </TableCell>

                      <TableCell className="text-left">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {order.isEditable && (
                              <DropdownMenuItem
                                onClick={() => {
                                  setOrder(order);
                                  setOpenEdit(true);
                                }}
                              >
                                <PencilIcon className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => {
                                setOrder(order);
                                setOpenAdd(true);
                              }}
                            >
                              <PlusIcon className="h-4 w-4 mr-2" />
                              Add Payment
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setOrder(order);
                                setOpenView(true);
                              }}
                            >
                              <Package className="h-4 w-4 mr-2" />
                              View Payments
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>

                      <TableCell className="py-4 px-4 text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => navigate(`/credit-order/${order.id}`)}>
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {order &&
             <UpdateCreditOrderDialog creditOrder={order} open={openEdit} onOpenChange={onOpenChangeEdit} />
            }
            <OrderPaymentsDialog orderId={order?.id} customer={order?.customer} open={openView} onOpenChange={onOpenChangeView} />
            <AddPaymentDialog order={order} customer={order?.customer} open={openAdd} onOpenChange={onOpenChangeAdd} />
          </div>

          {!loading && !error && paginatedData?.length > 0 && (
            <PaginationWrapper currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} className="mt-6" />
          )}
        </CardContent>
      </Card>

      <div className="hidden">{paymentResponse && <PaymentReceiptPrint payment={paymentResponse} />}</div>
    </div>
  );
};

export default CreditOrders;


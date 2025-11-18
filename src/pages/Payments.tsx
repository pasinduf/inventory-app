import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus,  Package, AlertCircle, ChevronUp, ChevronDown, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationWrapper } from "@/components/PaginationWrapper";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getPayments } from "@/api/payments/getPayments";
import { format, startOfMonth, startOfWeek } from "date-fns";
import { PaymentDto, PaymentListResponse } from "@/entries/payment/payment-list-response";
import { formatNumber } from "@/lib/decimalFormatter";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import OrderDetailsDialog from "./components/order/OrderDetailsDialog";
import OrderPaymentsDialog from "./components/order/OrderPaymentsDialog";
import { useNavigate } from "react-router-dom";

const Payments = () => {
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState("today");
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isInitial, setIsInitial] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
   const [data, setData] = useState<PaymentListResponse | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payment, setPayment] = useState<PaymentDto | null>(null);
  const [openView, setOpenView] = useState(false);

  const today = format(new Date(), "yyyy-MM-dd");
  const itemsPerPage = 10;

  useEffect(() => {
    if (isInitial){
      fetchPayments(today, today,true);
    } 
  }, [isInitial]);


  const fetchPayments = async (from: string, to: string, isToday?: boolean) => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        fromDate: from,
        toDate: to,
      };
      if (!isToday) {
        params.isRange = true;
      }

      const response = await getPayments(params);
      setData(response);
      setTotal(response.totalAmount);
      if (isInitial) setIsInitial(false);
      handlePageChange(1);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  const changeDateFilter = (filter: string) => {
    setDateFilter(filter);
    switch (filter) {
      case "today": {
         fetchPayments(today, today,true);
        break;
      }
      case "week": {
        const start = startOfWeek(new Date(), { weekStartsOn: 1 });
         fetchPayments(format(start, "yyyy-MM-dd"), today);
        break;
      }
      case "month": {
        const start = startOfMonth(new Date());
        fetchPayments(format(start, "yyyy-MM-dd"), today);
        break;
      }
    }
  };

   const onExpand = (date: string, isExpand: boolean) => {
     setData((prev) =>
       prev
         ? {
             ...prev,
             items: prev.items.map((item) =>
               item.date === date
                 ? {
                     ...item,
                     isExpand: isExpand,
                   }
                 : item
             ),
           }
         : prev
     );
   };

  const filteredData = data?.isRange ? data.items : data?.items.filter((payment) => payment?.customer?.toLowerCase().includes(searchQuery.toLowerCase()));
  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData?.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const onOpenChangeView = (open: boolean) => {
    setOpenView(open);
    setPayment(null);
  };


  const navigateToDetails=(id:number)=>{
    window.open(`/credit-order/${id}`, "_blank");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payments</h1>
        </div>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-2">
          <div className="flex items-center gap-4">
            <div className="relative flex-[5]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search payments" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
            </div>

            <select
              id="type"
              name="type"
              className="flex-[1] mt-1 block  rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={dateFilter}
              onChange={(e: any) => changeDateFilter(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom</option>
            </select>

            {dateFilter === "custom" && (
              <div className="flex flex-[4]">
                <div>
                  <Input
                    id="fromDate"
                    type="date"
                    placeholder="Select date"
                    className="w-full"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>

                <div className="ml-1">
                  <Input id="toDate" type="date" placeholder="Select date" className="w-full" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </div>

                <div className="ml-2">
                  <Button variant="outline" className="w-full" onClick={() => fetchPayments(format(fromDate, "yyyy-MM-dd"), format(toDate, "yyyy-MM-dd"))}>
                    Search
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Payments ({filteredData?.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-border">
                  <TableHead className="text-left py-3 px-4 font-medium text-muted-foreground">Date</TableHead>
                  <TableHead className="text-left py-3 px-4 font-medium text-muted-foreground">Customer</TableHead>
                  <TableHead className="text-left py-3 px-4 font-medium text-muted-foreground">Receipt #</TableHead>
                  <TableHead className="text-left py-3 px-4 font-medium text-muted-foreground">Amount</TableHead>
                  <TableHead className="text-left py-3 px-4 font-medium text-muted-foreground">Balance</TableHead>
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
                  paginatedData?.map((item) => (
                    <>
                      <TableRow key={item.date} className="border-b border-border hover:bg-muted/50">
                        <TableCell className="py-4 px-4">
                          <span className="font-medium text-muted-foreground">
                            {item.date}
                            {!data.isRange && (
                              <span className="ml-4">
                                <OrderDetailsDialog orderId={item.orderId} orderNumber={item.orderNumber}>
                                  <Button variant="outline" size="sm">
                                    {item.orderNumber}
                                  </Button>
                                </OrderDetailsDialog>
                              </span>
                            )}
                          </span>
                          {item?.payments?.length > 0 &&
                            (item.isExpand ? (
                              <Button variant="ghost" size="sm" className="ml-2 h-5 w-5 p-0" onClick={() => onExpand(item.date, false)}>
                                <ChevronUp />
                              </Button>
                            ) : (
                              <Button variant="ghost" size="sm" className="ml-2 h-5 w-5 p-0" onClick={() => onExpand(item.date, true)}>
                                <ChevronDown />
                              </Button>
                            ))}
                        </TableCell>
                        <TableCell className="py-4 px-4 text-muted-foreground">
                          {item.customer?.length > 20 ? (
                            <HoverCard>
                              <HoverCardTrigger asChild>
                                <span>{item.customer?.substring(0, 20)}</span>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-80">
                                <p className="text-sm">{item.customer}</p>
                              </HoverCardContent>
                            </HoverCard>
                          ) : (
                            <span>{item.customer}</span>
                          )}
                          {!data.isRange && (
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-2" onClick={() => navigateToDetails(item.creditOrderId)}>
                              <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            </Button>
                          )}
                        </TableCell>
                        <TableCell className="py-4 px-4 text-muted-foreground">{data?.isRange ? item.payments.length : item.receiptNo}</TableCell>
                        <TableCell className="py-4 px-4 font-bold text-muted-foreground">{formatNumber(item.amount)}</TableCell>
                        <TableCell className="py-4 px-4 font-bold text-muted-foreground">{!data.isRange ? formatNumber(item.balance) : ""}</TableCell>
                      </TableRow>
                      {item.isExpand &&
                        item.payments?.map((payment) => (
                          <TableRow key={`${item.date}_${payment.receiptNo}`} className="bg-muted/10">
                            <TableCell className="py-2 px-4">
                              <OrderDetailsDialog orderId={payment.orderId} orderNumber={payment.orderNumber}>
                                <Button variant="outline" size="sm">
                                  {payment.orderNumber}
                                </Button>
                              </OrderDetailsDialog>
                            </TableCell>
                            <TableCell className="py-2 px-4 text-muted-foreground">
                              {payment.customer?.substring(0, 20)}
                              <span>
                                {/* <Button
                                  variant="ghost"
                                  size="sm"
                                  className="ml-2 h-5 w-5 p-0"
                                  onClick={() => {
                                    setOpenView(true);
                                    setPayment(payment);
                                  }}
                                >
                                  <Package />
                                </Button> */}
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-2" onClick={() => navigateToDetails(payment.creditOrderId)}>
                                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                </Button>
                              </span>
                            </TableCell>
                            <TableCell className="py-2 px-4 text-muted-foreground">{payment.receiptNo}</TableCell>
                            <TableCell className="py-2 px-4 text-muted-foreground">{formatNumber(payment.amount)}</TableCell>
                            <TableCell className="py-2 px-4 text-muted-foreground">{formatNumber(payment.balance)}</TableCell>
                          </TableRow>
                        ))}
                    </>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {!loading && !error && paginatedData?.length > 0 && (
            <PaginationWrapper currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} className="mt-6" />
          )}
        </CardContent>
      </Card>
      {data && (
        <div className="text-right mr-4">
          <p>Total Amount: {formatNumber(total)}</p>
        </div>
      )}
      {/* {payment && <OrderPaymentsDialog orderId={payment.creditOrderId} customer={payment?.customer} open={openView} onOpenChange={onOpenChangeView} />} */}
    </div>
  );
};

export default Payments;


import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus,  Package, AlertCircle,View, EyeIcon, List, Trash2, MoreHorizontal, PrinterIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { yyyyMMDD } from "@/lib/dateFormatter";
import { PaginationWrapper } from "@/components/PaginationWrapper";
import { getOrders } from "@/api/orders/getOrders";
import { Badge } from "@/components/ui/badge";
import OrderDetailsDialog from "./components/order/OrderDetailsDialog";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { deleteOrder } from "@/api/orders/deleteOrder";
import { DEFAULT_ERROR_MESSAGE } from "@/api/const";
import { printOrder } from "@/api/orders/printOrder";
import { CreateOrderResponse } from "@/entries/order/order";
import OrderReceipt from "./components/order/OrderReceipt";

const Orders = () => {

  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isInitial, setIsInitial] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
   const [orderResponse, setOrderResponse] = useState<CreateOrderResponse | null>(null);
  const itemsPerPage = 10;

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

      const response = await getOrders({
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

   const onDeleteOrder= async (id)=>{
      try {
        const result = await deleteOrder(id);
        if (result) {
          toast({
            variant: "success",
            title: `Order Deleted Successfully`,
          });
          fetchOrders();
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: `${(error as any)?.response?.data?.message || DEFAULT_ERROR_MESSAGE}`,
        });
      }
    }


  const filteredData = data?.filter((order) => order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()));

  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData?.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPrintDetails=async (id:number)=>{
    try {
          setLoading(true);
          setError(null);
          const response = await printOrder(id);
          setOrderResponse(response);
          setTimeout(() => {
            handlePrint();
          }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch print order details");
    } finally {
      setLoading(false);
    }
  }

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



  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground">Manage your order details.</p>
        </div>
        {/* <Button className="bg-gradient-primary" onClick={() => navigate("/order/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Order
        </Button> */}
      </div>

      <Card className="shadow-card">
        <CardContent className="p-2">
          <div className="flex items-center gap-4">
            <div className="relative flex-[6]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search orders by order number" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
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
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Order #</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Discount</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  // Loading skeleton rows
                  Array.from({ length: itemsPerPage }).map((_, index) => (
                    <tr key={index} className="border-b border-border">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-10 h-10 rounded-lg" />
                          <Skeleton className="h-4 w-48" />
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Skeleton className="h-4 w-16" />
                      </td>
                      <td className="py-4 px-4">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="py-4 px-4">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="py-4 px-4">
                        <Skeleton className="h-4 w-20" />
                      </td>
                    </tr>
                  ))
                ) : error ? (
                  // Error state
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <AlertCircle className="h-12 w-12 text-destructive" />
                        <div>
                          <h3 className="font-medium text-foreground">Failed to load orders</h3>
                          {/* <p className="text-muted-foreground">{error}</p> */}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : paginatedData?.length === 0 ? (
                  // Empty state
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Package className="h-12 w-12 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium text-foreground">No records found</h3>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  // order rows
                  paginatedData?.map((order) => (
                    <tr key={order.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <span className="font-medium">{order.date}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">
                        <span>{order.orderNumber}</span>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">{order.amount}</td>
                      <td className="py-4 px-4 text-muted-foreground">{order.discount}</td>

                      <td className="py-4 px-4">
                        {order.isCreditOrder ? (
                          <Badge className="bg-warning text-warning-foreground">Credit</Badge>
                        ) : (
                          <Badge className="bg-success text-success-foreground">Cash</Badge>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <OrderDetailsDialog orderId={order.id} orderNumber={order.orderNumber}>
                          <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-2">
                            <List className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        </OrderDetailsDialog>
                      </td>
                      <td>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => getPrintDetails(order.id)}>
                              <PrinterIcon className="h-4 w-4 mr-2" />
                              Print 
                            </DropdownMenuItem>
                            <ConfirmDialog
                              title="Delete Order"
                              description="Are you sure you want to delete this order?"
                              confirmText="Delete"
                              variant="destructive"
                              onConfirm={() => onDeleteOrder(order.id)}
                            >
                              <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Order
                              </DropdownMenuItem>
                            </ConfirmDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && !error && paginatedData?.length > 0 && (
            <PaginationWrapper currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} className="mt-6" />
          )}
        </CardContent>
      </Card>

      <div className="hidden">
        {!loading && orderResponse && <OrderReceipt orderResponse={orderResponse} />}
      </div>

    </div>
  );
};

export default Orders;


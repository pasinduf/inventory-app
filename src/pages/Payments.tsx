import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus,  Package, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationWrapper } from "@/components/PaginationWrapper";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getPayments } from "@/api/payments/getPayments";
import { format, startOfMonth, startOfWeek } from "date-fns";

const Payments = () => {
  const [dateFilter, setDateFilter] = useState("today");
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isInitial, setIsInitial] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = format(new Date(), "yyyy-MM-dd");
  const itemsPerPage = 10;

  useEffect(() => {
    if (isInitial){
      fetchPayments(today, today);
    } 
  }, [isInitial]);


  const fetchPayments = async (from: string, to: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getPayments({
        fromDate: from,
        toDate: to,
      });

      setData(response.items);
      setTotal(response.totalAmount);
      if(isInitial) setIsInitial(false);
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
         fetchPayments(today, today);
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

  const filteredData = data?.filter((payment) => payment.customer.toLowerCase().includes(searchQuery.toLowerCase()));

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
                  <TableHead className="text-left py-3 px-4 font-medium text-muted-foreground">Receipt No</TableHead>
                  <TableHead className="text-left py-3 px-4 font-medium text-muted-foreground">Customer</TableHead>
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
                  paginatedData?.map((order) => (
                    <TableRow key={order.id} className="border-b border-border hover:bg-muted/50">
                      <TableCell className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-muted-foreground">{order.date}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-4 text-muted-foreground">{order.receiptNo}</TableCell>
                      <TableCell className="py-4 px-4 text-muted-foreground">{order.customer}</TableCell>
                      <TableCell className="py-4 px-4 text-muted-foreground">{order.amount}</TableCell>
                      <TableCell className="py-4 px-4 text-muted-foreground">{order.balance}</TableCell>
                    </TableRow>
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
      <div className="text-right mr-4">
        <p>Total Amount: {total.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default Payments;


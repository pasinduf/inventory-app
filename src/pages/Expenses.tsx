import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter, MoreHorizontal, Package, Edit, Trash2, AlertCircle, RefreshCw } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_ERROR_MESSAGE } from "@/api/const";
import { getExpenses } from "@/api/expense/getExpenses";
import { deleteExpense } from "@/api/expense/deleteExpense";
import { AddExpenseDialog } from "./components/expense/AddExpenseDialog";
import { yyyyMMDD } from "@/lib/dateFormatter";
import { PaginationWrapper } from "@/components/PaginationWrapper";

const Expenses = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isInitial, setIsInitial] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 5;

  const [open, setOpen] = useState(false);
  const [expense, setExpense] = useState(null);


  useEffect(() => {
    // First day of the current month
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const today = now;

    setFromDate(yyyyMMDD(firstDay));
    setToDate(yyyyMMDD(today));
  }, []);


   useEffect(() => {
     if (fromDate && toDate && isInitial) {
       fetchExpenses();
     }
   }, [fromDate, toDate, isInitial]);


  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getExpenses({
        fromDate,
        toDate
      });
      setData(response);
      if(isInitial) setIsInitial(false);
      handlePageChange(1)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  const onDeleteExpense = async (id) => {
    try {
      const result = await deleteExpense(id);
      if (result) {
        toast({
          variant: "success",
          title: `Expense Deleted Successfully`,
        });
        fetchExpenses();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: `${(error as any)?.response?.data?.message || DEFAULT_ERROR_MESSAGE}`,
      });
    }
  };

  const onOpenChange = (refresh: boolean, open: boolean) => {
    if (refresh) fetchExpenses();
    setOpen(open);
    setExpense(null);
  };

  const filteredData = data.filter((expense) => expense.name.toLowerCase().includes(searchQuery.toLowerCase()));

   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
   const startIndex = (currentPage - 1) * itemsPerPage;
   const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

   const handlePageChange = (page: number) => {
     setCurrentPage(page);
   };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Expenses</h1>
          <p className="text-muted-foreground">Manage your expense details.</p>
        </div>
        <Button className="bg-gradient-primary" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
        <AddExpenseDialog open={open} onOpenChange={onOpenChange} expense={expense} />
      </div>

      <Card className="shadow-card">
        <CardContent className="p-2">
          <div className="flex items-center gap-4">
            <div className="relative flex-[6]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search expense by reason" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
            </div>

            <div className="flex-[2]">
              <Input id="fromDate" type="date" placeholder="Select date" className="w-full" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>

            <div className="flex-[2]">
              <Input id="toDate" type="date" placeholder="Select date" className="w-full" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>

            <div className="flex-[2]">
              <Button variant="outline" className="w-full" onClick={fetchExpenses}>
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
            Expenses ({filteredData.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Reason</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Amount</th>
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
                        <Skeleton className="h-4 w-12" />
                      </td>
                      <td className="py-4 px-4">
                        <Skeleton className="h-4 w-16" />
                      </td>
                      <td className="py-4 px-4">
                        <Skeleton className="h-6 w-20" />
                      </td>
                      <td className="py-4 px-4">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Skeleton className="h-8 w-8 rounded ml-auto" />
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
                          <h3 className="font-medium text-foreground">Failed to load records</h3>
                          {/* <p className="text-muted-foreground">{error}</p> */}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
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
                  // Expense rows
                  paginatedData.map((expense) => (
                    <tr key={expense.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{expense.date}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">{expense.name}</td>
                      <td className="py-4 px-4">{expense.amount}</td>

                      <td className="py-4 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setExpense(expense);
                                setOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Expense
                            </DropdownMenuItem>
                            <ConfirmDialog
                              title="Delete Expense"
                              description="Are you sure you want to delete this expense?"
                              confirmText="Delete"
                              variant="destructive"
                              onConfirm={() => onDeleteExpense(expense.id)}
                            >
                              <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Expense
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

          {!loading && !error && paginatedData.length > 0 && (
            <PaginationWrapper currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} className="mt-6" />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Expenses;


import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, MoreHorizontal, Package, Edit, Trash2, AlertCircle, Info, RefreshCw } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_ERROR_MESSAGE } from "@/api/const";
import { PaginationWrapper } from "@/components/PaginationWrapper";
import { AddCustomerDialog } from "./components/customer/AddCustomerDialog";
import { getCustomers } from "@/api/customer/getCustomers";
import { deleteCustomer } from "@/api/customer/deleteCustomer";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";

const Customers = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState(null);


  useEffect(() => {
      fetchCustomers();
  },[]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getCustomers();
      setCustomers(response);
      handlePageChange(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  const onDeleteCustomer = async (id) => {
    try {
      const result = await deleteCustomer(id);
      if (result) {
        toast({
          variant: "success",
          title: `Customer Deleted Successfully`,
        });
        fetchCustomers();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: `${(error as any)?.response?.data?.message || DEFAULT_ERROR_MESSAGE}`,
      });
    }
  };

  const onOpenChange = (refresh: boolean, open: boolean) => {
    if (refresh) fetchCustomers();
    setOpen(open);
    setCustomer(null);
  };

   const filteredCustomers = customers.filter(
     (customer) =>
       customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
       customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
       customer.customerNumber.toLowerCase().includes(searchQuery.toLowerCase())
   );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground">Manage your customers details.</p>
        </div>
        <Button className="bg-gradient-primary" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
        <AddCustomerDialog open={open} onOpenChange={onOpenChange} customer={customer} />
      </div>

      <Card className="shadow-card">
        <CardContent className="p-2">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customer by name, customer number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" onClick={fetchCustomers} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Customers ({filteredCustomers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Customer Number</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">NIC</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Contact #</th>
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
                        <Skeleton className="h-4 w-12" />
                      </td>
                      <td className="py-4 px-4">
                        <Skeleton className="h-4 w-16" />
                      </td>
                      <td className="py-4 px-4">
                        <Skeleton className="h-6 w-20" />
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
                          <h3 className="font-medium text-foreground">Failed to load customers</h3>
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
                          <h3 className="font-medium text-foreground">No customers found</h3>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  // customer rows
                  paginatedData.map((customer) => (
                    <tr key={customer.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{customer.customerNumber}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">
                        {customer.firstName} {customer.lastName}
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">{customer.nic}</td>
                      <td className="py-4 px-4 text-muted-foreground">
                        {customer.contactNumber}

                        {customer?.address && (
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-2">
                                <Info className="h-3 w-3 text-muted-foreground" />
                              </Button>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                              <p className="text-sm">{customer.address}</p>
                            </HoverCardContent>
                          </HoverCard>
                        )}
                      </td>
                      <td className="py-4 px-4">{customer.isCreditCustomer && <Badge className="bg-warning text-warning-foreground">Credit</Badge>}</td>

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
                                setCustomer(customer);
                                setOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Customer
                            </DropdownMenuItem>
                            <ConfirmDialog
                              title="Delete Customer"
                              description={`Are you sure you want to delete the "${customer.customerNumber}"?`}
                              confirmText="Delete"
                              variant="destructive"
                              onConfirm={() => onDeleteCustomer(customer.id)}
                            >
                              <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Customer
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

export default Customers;


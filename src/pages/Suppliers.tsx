import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter, MoreHorizontal, Package, Edit, Trash2, AlertCircle, RefreshCw } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { AddSupplierDialog } from "./components/supplier/AddSupplierDialog";
import { getSuppliers } from "@/api/supplier/getSuppliers";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import { deleteSupplier } from "@/api/supplier/deleteSupplier";
import { DEFAULT_ERROR_MESSAGE } from "@/api/const";
import { getSupplierOptions } from "@/api/supplier/getOptions";
import { useAppStore } from "@/hooks/useAppStore";

const Suppliers = () => {

  const { store, setStore }: any = useAppStore();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

   const [open, setOpen] = useState(false);
   const [supplier, setSupplier] = useState(null);
  const itemsPerPage = 10;


  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getSuppliers();
      setSuppliers(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch suppliers");
    } finally {
      setLoading(false);
    }
  };

  
  const onDeleteSupplier= async (id)=>{
    try {
      const result = await deleteSupplier(id);
      if (result) {
        toast({
          variant: "success",
          title: `Supplier Deleted Successfully`,
        });
        fetchSuppliers();
        const list = await getSupplierOptions();
        setStore({
          ...store,
          suppliers: list,  
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: `${(error as any)?.response?.data?.message || DEFAULT_ERROR_MESSAGE}`,
      });
    }
  }
  
  const onOpenChange = (refresh: boolean, open: boolean) => {
    if (refresh) fetchSuppliers();
    setOpen(open);
    setSupplier(null);
  };

  const filteredSuppliers = suppliers.filter((supplier) => supplier.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Suppliers</h1>
          <p className="text-muted-foreground">Manage your suppliers details.</p>
        </div>
        <Button className="bg-gradient-primary" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Supplier
        </Button>
        <AddSupplierDialog open={open} onOpenChange={onOpenChange} supplier={supplier} />
      </div>

      {/* Search and Filter Bar */}
      <Card className="shadow-card">
        <CardContent className="p-2">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search suppliers by name" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
            </div>
            {/* <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button> */}
            <Button variant="outline" onClick={fetchSuppliers} disabled={loading}>
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
            Suppliers ({filteredSuppliers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Address</th>
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
                          <h3 className="font-medium text-foreground">Failed to load suppliers</h3>
                          {/* <p className="text-muted-foreground">{error}</p> */}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : filteredSuppliers.length === 0 ? (
                  // Empty state
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Package className="h-12 w-12 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium text-foreground">No suppliers found</h3>
                          {/* <p className="text-muted-foreground">{searchQuery ? "Try adjusting your search terms" : "No products available at the moment"}</p> */}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  // Supplier rows
                  filteredSuppliers.map((supplier) => (
                    <tr key={supplier.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <Package className="h-5 w-5 text-white" />
                          </div>
                          <span className="font-medium text-muted-foreground">{supplier.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">{supplier.contactNumber}</td>
                      <td className="py-4 px-4 text-muted-foreground">{supplier.address}</td>

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
                                setSupplier(supplier);
                                setOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Supplier
                            </DropdownMenuItem>
                            <ConfirmDialog
                              title="Delete Supplier"
                              description={`Are you sure you want to delete the "${supplier.name}"?`}
                              confirmText="Delete"
                              variant="destructive"
                              onConfirm={() => onDeleteSupplier(supplier.id)}
                            >
                              <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Supplier
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Suppliers;

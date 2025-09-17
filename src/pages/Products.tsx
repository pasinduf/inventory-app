import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter, MoreHorizontal, Package, Edit, Trash2, AlertCircle, RefreshCw } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PaginationWrapper } from "@/components/PaginationWrapper";
import { getProducts } from "@/api/product/getProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { AddProductDialog } from "./components/product/AddProductDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EditProductDialog } from "./components/product/EditProductDialog";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { deleteProduct } from "@/api/product/deleteProduct";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_ERROR_MESSAGE } from "@/api/const";

const Products = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [products,setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 5;
  
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [product, setProduct] = useState(null);


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getProducts();
      setProducts(response.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "InStock":
        return <Badge className="bg-success text-success-foreground">In Stock</Badge>;
      case "LowStock":
        return <Badge className="bg-warning text-warning-foreground">Low Stock</Badge>;
      case "OutofStock":
        return <Badge variant="destructive">Out of Stock</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };


   const onOpenAddChange = (refresh: boolean, open: boolean) => {
     if (refresh) fetchProducts();
     setOpenAdd(open);
   };


   const onOpenEditChange = (refresh: boolean, open: boolean) => {
     if (refresh) fetchProducts();
     setOpenEdit(open);
   };


    const onDeleteProduct= async (id)=>{
       try {
         const result = await deleteProduct(id);
         if (result) {
           toast({
             variant: "success",
             title: `Product Deleted Successfully`,
           });
           fetchProducts();
         }
       } catch (error: any) {
         toast({
           variant: "destructive",
           title: `${(error as any)?.response?.data?.message || DEFAULT_ERROR_MESSAGE}`,
         });
       }
    }


  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory and stock.</p>
        </div>

        <Button className="bg-gradient-primary" onClick={() => setOpenAdd(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
        <AddProductDialog open={openAdd} onOpenChange={onOpenAddChange} />
      </div>

      {/* Search and Filter Bar */}
      <Card className="shadow-card">
        <CardContent className="p-2">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name, SKU, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" onClick={fetchProducts} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Products ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-border">
                  <TableHead className="text-left py-3 px-4 font-medium text-muted-foreground">Product</TableHead>
                  <TableHead className="text-left py-3 px-4 font-medium text-muted-foreground">SKU</TableHead>
                  <TableHead className="text-left py-3 px-4 font-medium text-muted-foreground">Category</TableHead>
                  <TableHead className="text-left py-3 px-4 font-medium text-muted-foreground">Stock</TableHead>
                  <TableHead className="text-left py-3 px-4 font-medium text-muted-foreground">Price(Rs.)</TableHead>
                  <TableHead className="text-left py-3 px-4 font-medium text-muted-foreground">Status</TableHead>
                  <TableHead className="text-left py-3 px-4 font-medium text-muted-foreground">Supplier</TableHead>
                  <TableHead className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</TableHead>
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
                        <Skeleton className="h-4 w-12" />
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <Skeleton className="h-6 w-20" />
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell className="py-4 px-4 text-right">
                        <Skeleton className="h-8 w-8 rounded ml-auto" />
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
                ) : paginatedProducts.length === 0 ? (
                  // Empty state
                  <TableRow>
                    <TableCell colSpan={8} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Package className="h-12 w-12 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium text-foreground">No products found</h3>
                          {/* <p className="text-muted-foreground">{searchQuery ? "Try adjusting your search terms" : "No products available at the moment"}</p> */}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  // Product rows
                  paginatedProducts.map((product) => (
                    <TableRow key={product.id} className="border-b border-border hover:bg-muted/50">
                      <TableCell className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <Package className="h-5 w-5 text-white" />
                          </div>
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-4">{product.serialNumber}</TableCell>
                      <TableCell className="py-4 px-4 text-muted-foreground">{product.category}</TableCell>
                      <TableCell className="py-4 px-4">
                        {/* <span
                          className={`font-medium ${
                            product.stock <= product.minStock ? (product.stock === 0 ? "text-destructive" : "text-warning") : "text-foreground"
                          }`}
                        >
                          {product.stock}
                        </span> */}
                        <span className="font-medium text-muted-foreground">{product.quantity}</span>
                        {/* <span className="text-muted-foreground text-sm ml-1">/ {product.minStock} min</span> */}
                        <span className="text-muted-foreground text-sm ml-1">/ {product.unit}</span>
                      </TableCell>
                      <TableCell className="py-4 px-4 font-medium text-muted-foreground">{product.price}</TableCell>
                      <TableCell className="py-4 px-4">{getStatusBadge(product.status)}</TableCell>
                      <TableCell className="py-4 px-4 text-muted-foreground">{product.supplier}</TableCell>
                      <TableCell className="py-4 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setProduct(product);
                                setOpenEdit(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Package className="h-4 w-4 mr-2" />
                              Update Stock
                            </DropdownMenuItem>
                            <ConfirmDialog
                              title="Delete Product"
                              description={`Are you sure you want to delete the "${product.name}"?`}
                              confirmText="Delete"
                              variant="destructive"
                              onConfirm={() => onDeleteProduct(product.id)}
                            >
                              <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Product
                              </DropdownMenuItem>
                            </ConfirmDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <EditProductDialog product={product} open={openEdit} onOpenChange={onOpenEditChange} />

          {!loading && !error && paginatedProducts.length > 0 && (
            <PaginationWrapper currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} className="mt-6" />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;

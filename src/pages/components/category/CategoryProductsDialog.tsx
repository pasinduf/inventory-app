import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package, DollarSign, Calendar, AlertCircle } from "lucide-react";
import { Category } from "@/entries/category/category";
import { getCategoryProducts } from "@/api/category/getCategoryProducts";
import { Skeleton } from "@/components/ui/skeleton";


interface Props {
  category: Category;
  children: React.ReactNode;
}

const CategoryProductsDialog = ({ category, children }: Props) => {
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products,setProducts] = useState([])
  const itemsPerPage = 5;

  useEffect(() => {
    if (open && category?.id) {
      fetchCategoryProducts();
    }
  }, [open,category]);

  const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        setError(null);
  
        const response = await getCategoryProducts(category.id);
        setProducts(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch categories");
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Products in {category.name}
          </DialogTitle>
          <DialogDescription>Showing {category.productCount} products in this category</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>Added Date</TableHead>
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
              ) : products.length === 0 ? (
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
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-muted-foreground">{product.serialNumber}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {product.price}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {product.quantity}
                      <span className="text-muted-foreground text-sm ml-1">/ {product.unit}</span>
                    </TableCell>
                    <TableCell className="text-center">{getStatusBadge(product.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {product.addedDate ? new Date(product.addedDate).toLocaleDateString() : "N/A"}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryProductsDialog;

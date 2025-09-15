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

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [products,setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 5;


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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory and stock.</p>
        </div>
        <AddProductDialog />
      </div>

      {/* Search and Filter Bar */}
      <Card className="shadow-card">
        <CardContent className="p-6">
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
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
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
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">SKU</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Stock</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Price(Rs.)</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Supplier</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
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
                          <h3 className="font-medium text-foreground">Failed to load products</h3>
                          <p className="text-muted-foreground">{error}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : paginatedProducts.length === 0 ? (
                  // Empty state
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Package className="h-12 w-12 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium text-foreground">No products found</h3>
                          {/* <p className="text-muted-foreground">{searchQuery ? "Try adjusting your search terms" : "No products available at the moment"}</p> */}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  // Product rows
                  paginatedProducts.map((product) => (
                    <tr key={product.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <Package className="h-5 w-5 text-white" />
                          </div>
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">{product.serialNumber}</td>
                      <td className="py-4 px-4">{product.category}</td>
                      <td className="py-4 px-4">
                        {/* <span
                          className={`font-medium ${
                            product.stock <= product.minStock ? (product.stock === 0 ? "text-destructive" : "text-warning") : "text-foreground"
                          }`}
                        >
                          {product.stock}
                        </span> */}
                        <span className="font-medium text-foreground">{product.quantity}</span>
                        {/* <span className="text-muted-foreground text-sm ml-1">/ {product.minStock} min</span> */}
                        <span className="text-muted-foreground text-sm ml-1">/ {product.unit}</span>
                      </td>
                      <td className="py-4 px-4 font-medium">{product.price}</td>
                      <td className="py-4 px-4">{getStatusBadge(product.status)}</td>
                      <td className="py-4 px-4 text-muted-foreground">{product.supplier}</td>
                      <td className="py-4 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Package className="h-4 w-4 mr-2" />
                              Update Stock
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Product
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && !error && paginatedProducts.length > 0 && (
            <PaginationWrapper currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} className="mt-6" />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;

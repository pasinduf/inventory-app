import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  FolderTree, 
  Package,
  Edit,
  Trash2,
  MoreHorizontal,
  AlertCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { getCategories } from "@/api/category/getCategories";
import { AddCategoryDialog } from "./components/category/AddCategoryDialog";
import CategoryProductsDialog from "./components/category/CategoryProductsDialog";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { deleteCategory } from "@/api/category/deleteCategory";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_ERROR_MESSAGE } from "@/api/const";
import { Skeleton } from "@/components/ui/skeleton";
import { AddProductDialog } from "./components/product/AddProductDialog";
import { getCategoryOptions } from "@/api/category/getOptions";
import { useAppStore } from "@/hooks/useAppStore";

const Categories = () => {

  const { store, setStore }: any = useAppStore();
  const { toast } = useToast();
  const [data,setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(null);
  const [newProduct, setnewProduct] = useState(null);
  const [openAddProduct, setOpenAddProduct] = useState(false);
  const itemsPerPage = 6;


   useEffect(() => {
      fetchCategories();
    }, []);
  
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getCategories();
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };


  const onOpenChange = (refresh:boolean, open:boolean) =>{
    if (refresh) fetchCategories();
    setOpen(open);
    setCategory(null);
  }

  const onDeleteCategory= async (id)=>{
    try {
      const result = await deleteCategory(id);
      if (result) {
        toast({
          variant: "success",
          title: `Category Deleted Successfully`,
        });
        fetchCategories();
         const list = await getCategoryOptions();
          setStore({
            ...store,
            categories: list,
          });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: `${(error as any)?.response?.data?.message || DEFAULT_ERROR_MESSAGE}`,
      });
    }
  }


  const onOpenAddProductChange = (refresh: boolean, open: boolean) => {
    if (refresh) fetchCategories();
    setOpenAddProduct(open);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground">Organize your products into categories for better management.</p>
        </div>
        <Button className="bg-gradient-primary" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
        <AddCategoryDialog open={open} onOpenChange={onOpenChange} category={category} />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: itemsPerPage }).map((_, index) => (
            <Card key={index} className="shadow-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <div>
                      <Skeleton className="h-5 w-24 mb-2" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : error ? (
          // Error state
          <div className="col-span-full">
            <Card className="shadow-card">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <h3 className="font-medium text-foreground mb-2">Failed to load categories</h3>
              </CardContent>
            </Card>
          </div>
        ) : data.length === 0 ? (
          <div className="col-span-full">
            <Card className="shadow-card">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground" />
                <div>
                  <h3 className="font-medium text-foreground">No categories found</h3>
                  {/* <p className="text-muted-foreground">{searchQuery ? "Try adjusting your search terms" : "No products available at the moment"}</p> */}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          data.map((category) => (
            <Card key={category.id} className="shadow-card hover:shadow-elevated transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center`}>
                      <FolderTree className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1 text-sm text-muted-foreground">
                        <Package className="h-3 w-3 mr-1" />
                        {category.productCount} products
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setCategory(category);
                          setOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Category
                      </DropdownMenuItem>

                      <ConfirmDialog
                        title="Delete Category"
                        description={`Are you sure you want to delete the "${category.name}" category?`}
                        confirmText="Delete"
                        variant="destructive"
                        onConfirm={() => onDeleteCategory(category.id)}
                      >
                        <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Category
                        </DropdownMenuItem>
                      </ConfirmDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">{category.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    {category.productCount > 0 && (
                      <CategoryProductsDialog category={category}>
                        <Button variant="outline" size="sm">
                          View Products
                        </Button>
                      </CategoryProductsDialog>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setnewProduct({
                        name: "",
                        category: `${category.id}`,
                        supplier: "",
                        unit: "",
                        quantity: 0,
                        buyingPrice: 0,
                        sellingPrice: 0,
                      });
                      setOpenAddProduct(true);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
        <AddProductDialog open={openAddProduct} onOpenChange={onOpenAddProductChange} newProduct={newProduct} />
      </div>
    </div>
  );
};

export default Categories;
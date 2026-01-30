import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Category } from "@/entries/category/category";
import { Edit, FolderTree, MoreHorizontal, Package, Plus, Trash2 } from "lucide-react";
import CategoryProductsDialog from "./CategoryProductsDialog";

interface Props {
  category: Category;
  setCategory: (category: Category) => void;
  setOpen: (open: boolean) => void;
  onDelete: (categoryId: number) => void;
  setnewProduct: (product: any) => void;
  setOpenAddProduct : (open: boolean) => void;
}

const CategoryCard = React.memo(({ 
    category,
     setCategory, 
     setOpen, 
     onDelete, 
     setnewProduct, 
     setOpenAddProduct 
    }: Props) => {

  return (
    <Card className="shadow-card hover:shadow-elevated transition-shadow">
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
                {category.productCount} {category.productCount > 1 ? "products" : "product"}
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
                description={`Are you sure you want to delete the "${category.name}" category, with existing ${category.productCount} products?`}
                confirmText="Delete"
                variant="destructive"
                onConfirm={() => onDelete(category.id)}
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
  );
});

export default CategoryCard;
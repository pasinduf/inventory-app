import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  FolderTree, 
  Package,
  Edit,
  Trash2,
  MoreHorizontal
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

const Categories = () => {

  const [data,setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(null);


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
        {data.map((category) => (
          <Card key={category.id} className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center`}>
                    <FolderTree className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1 text-sm">
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
                      setOpen(true)
                    }}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Category
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Category
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">{category.description}</p>
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm">
                  View Products
                </Button>
                <Button variant="ghost" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Category Card */}
      {/* <Card className="shadow-card border-2 border-dashed border-muted hover:border-primary transition-colors cursor-pointer">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">Create New Category</h3>
          <p className="text-muted-foreground text-center mb-4">
            Add a new category to organize your products better
          </p>
          <Button className="bg-gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default Categories;
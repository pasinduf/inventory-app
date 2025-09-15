import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface Props {
  trigger?: React.ReactNode;
}

export function AddProductDialog({ trigger }: Props) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Product added");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>Create a new product entry for your inventory.</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" placeholder="Enter product name" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" placeholder="Enter SKU" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                  <SelectItem value="office-supplies">Office Supplies</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" step="0.01" placeholder="0.00" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock">Initial Stock</Label>
                <Input id="stock" type="number" placeholder="0" required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="minStock">Minimum Stock Level</Label>
              <Input id="minStock" type="number" placeholder="0" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Input id="supplier" placeholder="Enter supplier name" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Product description (optional)" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Product</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

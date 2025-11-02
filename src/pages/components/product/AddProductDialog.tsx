import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getCategoryOptions } from "@/api/category/getOptions";
import { getSupplierOptions } from "@/api/supplier/getOptions";
import { Label } from "@/components/ui/label";
import { ProductInputs } from "@/entries/product/product";
import { addProduct } from "@/api/product/addProduct";
import { DEFAULT_ERROR_MESSAGE } from "@/api/const";
import { useAppStore } from "@/hooks/useAppStore";

const Schema = z.object({
  name: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  supplier: z.string().min(1, "Supplier is required"),
  unit: z.string().min(1, "Unit is required"),
  quantity: z.number().min(0.01, "Enter valid Quantity"),
  buyingPrice: z.number().min(0.01, "Enter valid Price"),
  sellingPrice: z.number().min(0.01, "Enter valid Price"),
});

type FormData = z.infer<typeof Schema>;

interface Props {
  open: boolean;
  onOpenChange: (refresh: boolean, open: boolean) => void;
  newProduct?: any;
}

export function AddProductDialog({ open, onOpenChange, newProduct }: Props) {
  
  const { store, setStore }: any = useAppStore();
  const { toast } = useToast();
  const categories = store?.categories || [];
  const suppliers = store?.suppliers || [];
  const [submitting, setSubmitting] = useState(false);

  const defaultValue = {
    name: "",
    category: "",
    supplier: "",
    unit: "",
    quantity: 0,
    buyingPrice: 0,
    sellingPrice: 0,
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(Schema),
    defaultValues: defaultValue,
    mode: "onSubmit",
  });

  useEffect(() => {
    if (open && newProduct) {
      reset(newProduct ?? defaultValue);
    }
  }, [newProduct, open, reset]);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    const payload: ProductInputs = {
      supplierId: +data.supplier,
      categoryId: +data.category,
      name: data.name,
      unit: data.unit,
      quantity: data.quantity,
      buyingPrice: data.buyingPrice,
      sellingPrice: data.sellingPrice,
    };

    try {
      const result = await addProduct(payload);
      if (result) {
        toast({
          variant: "success",
          title: `Product Added Successfully`,
        });
        reset();
        onOpenChange(true, false);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: `${(error as any)?.response?.data?.message || DEFAULT_ERROR_MESSAGE}`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const onClose = () => {
    reset();
    onOpenChange(false, false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          reset();
        }
        onOpenChange(false, false);
      }}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>Create a new product for your inventory.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Select Category</Label>
                <select
                  id="category"
                  name="category"
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  defaultValue=""
                  {...register("category")}
                  disabled={!!newProduct}
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {categories.map((category) => {
                    return (
                      <option key={category.value} value={category.value}>
                        {category.name}
                      </option>
                    );
                  })}
                </select>
                {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name">Select Supplier</Label>
                <select
                  id="supplier"
                  name="supplier"
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  defaultValue=""
                  {...register("supplier")}
                >
                  <option value="" disabled>
                    Select Supplier
                  </option>
                  {suppliers.map((supplier) => {
                    return (
                      <option key={supplier.value} value={supplier.value}>
                        {supplier.name}
                      </option>
                    );
                  })}
                </select>
                {errors.supplier && <p className="text-red-500 text-sm">{errors.supplier.message}</p>}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" placeholder="Enter product name" {...register("name")} />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Select Unit</Label>
                <select
                  id="unit"
                  name="unit"
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  defaultValue=""
                  {...register("unit")}
                >
                  <option value="" disabled>
                    Select Unit
                  </option>
                  <option value="PCS">PCS</option>
                  <option value="KG">KG</option>
                </select>
                {errors.unit && <p className="text-red-500 text-sm">{errors.unit.message}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Enter Quantity"
                  {...register("quantity", { valueAsNumber: true })}
                  min={0}
                  step="any"
                  onFocus={(e) => e.target.select()}
                />
                {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="buyingPrice">Buying Price</Label>
                <Input
                  id="buyingPrice"
                  type="number"
                  min={0}
                  placeholder="Enter Buying Price"
                  {...register("buyingPrice", { valueAsNumber: true })}
                  step="any"
                  onFocus={(e) => e.target.select()}
                />
                {errors.buyingPrice && <p className="text-red-500 text-sm">{errors.buyingPrice.message}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="quantity">Selling Price</Label>
                <Input
                  id="sellingPrice"
                  type="number"
                  min={0}
                  placeholder="Enter Selling Price"
                  {...register("sellingPrice", { valueAsNumber: true })}
                  onFocus={(e) => e.target.select()}
                  step="any"
                />
                {errors.sellingPrice && <p className="text-red-500 text-sm">{errors.sellingPrice.message}</p>}
              </div>
            </div>
          </div>
          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              Add Product
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
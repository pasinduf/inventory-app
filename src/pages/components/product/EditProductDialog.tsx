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
import { Product, ProductInputs } from "@/entries/product/product";
import { DEFAULT_ERROR_MESSAGE } from "@/api/const";
import { updateProduct } from "@/api/product/updateProduct";
import { useAppStore } from "@/hooks/useAppStore";

const Schema = z.object({
  name: z.string().min(1, "Product name is required"),
  categoryId: z.string().min(1, "Category is required"),
  unit: z.string().min(1, "Unit is required"),
});

type FormData = z.infer<typeof Schema>;

interface Props {
  product: Product,
  open: boolean;
  onOpenChange: (refresh: boolean, open: boolean) => void;
}

export function EditProductDialog({ product, open, onOpenChange }: Props) {
    
  const { store, setStore }: any = useAppStore();
  const { toast } = useToast();
  const categories = store?.categories || [];
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(Schema),
    defaultValues: {
      name: "",
      categoryId: "",
      unit: "",
    },
    mode: "onSubmit",
  });


   useEffect(() => {
     if (open && product) {
       reset(product ?? { name: "", categoryId: "", unit: "" });
     }
   }, [product, open, reset]);


  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    const payload: ProductInputs = {
      name: data.name,
      categoryId: +data.categoryId,
      unit: data.unit,
    };

    try {
      const result = await updateProduct(product.id,payload);
      if (result) {
        toast({
          variant: "success",
          title: `Product Updated Successfully`,
        });
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-8 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Select Category</Label>
              <select
                id="category"
                name="category"
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                defaultValue=""
                {...register("categoryId")}
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
              {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" placeholder="Enter product name" {...register("name")} />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              Edit Product
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
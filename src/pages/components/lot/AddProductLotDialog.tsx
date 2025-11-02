import { useEffect, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { DEFAULT_ERROR_MESSAGE } from "@/api/const";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { yyyyMMDD } from "@/lib/dateFormatter";
import { ProductLot } from "@/entries/product/product-lot";
import { updateProductLot } from "@/api/product/updateProductLot";
import { addProductLot } from "@/api/product/addProductLot";
import { getSupplierOptions } from "@/api/supplier/getOptions";

interface Props {
  productId:number;
  open: boolean;
  onOpenChange: (refresh: boolean, open: boolean) => void;
  lot?: ProductLot;
}

const schema = z.object({
  date: z.string().min(1, "Date is required"),
  supplierId: z.string().min(1, "Supplier is required"),
  quantity: z.number().min(0.01, "Enter valid Quantity"),
  buyingPrice: z.number().min(0.01, "Enter valid Price"),
  sellingPrice: z.number().min(0.01, "Enter valid Price"),
});

type FormData = z.infer<typeof schema>;

export function AddProductLotDialog({ productId , open, onOpenChange, lot }: Props) {
  
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const today = new Date();

  const defaultValue = {
    date: yyyyMMDD(today),
    supplierId: "",
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
    resolver: zodResolver(schema),
    defaultValues: defaultValue,
    mode: "onSubmit",
  });


  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const suppliers = await getSupplierOptions();

        setSuppliers(suppliers);
      } catch (error) {
        console.error("Failed to fetch supplies:", error);
      }
    };
    fetchOptions();
  }, [open]);

  useEffect(() => {
    if (open) {
      reset(lot ?? defaultValue);
    }
  }, [lot, open, reset]);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    const payload: any = { ...data, productId };

    try {
      const result = lot ? await updateProductLot(lot.id, payload) : await addProductLot(payload);
      if (result) {
        onOpenChange(true, false);
        toast({
          variant: "success",
          title: `Product lot ${lot ? "Updated" : "Added"} Successfully`,
        });
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
          <DialogTitle>{lot ? "Update" : "Add"} Product Lot</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-8 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Select Supplier</Label>
              <select
                id="supplierId"
                name="supplierId"
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                defaultValue=""
                {...register("supplierId")}
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
              {errors.supplierId && <p className="text-red-500 text-sm">{errors.supplierId.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" placeholder="Select date" {...register("date")} />
                {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
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
              {lot ? "Update" : "Add"} Lot
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useEffect, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Category } from "@/entries/category/category";
import { useForm } from "react-hook-form";
import { DEFAULT_ERROR_MESSAGE } from "@/api/const";
import { addCategory } from "@/api/category/addCategory";
import { useToast } from "@/hooks/use-toast";
import { updateCategory } from "@/api/category/updateCategory";
import { Label } from "@/components/ui/label";
import { Supplier } from "@/entries/supplier/supplier";

interface Props {
  open: boolean;
  onOpenChange: (refresh: boolean, open: boolean) => void;
  supplier?: Supplier;
  trigger?: React.ReactNode;
}

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  contactNumber: z.string().optional(),
  address: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function AddSupplierDialog({ open, onOpenChange, supplier, trigger }: Props) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", contactNumber: "", address:"" },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (open) {
      reset(supplier ?? { name: "", contactNumber: "", address: "" });
    }
  }, [supplier, open, reset]);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    const payload: any = { ...data };

    // try {
    //   const result = category ? await updateCategory(category.id, payload) : await addCategory(payload);
    //   if (result) {
    //     onOpenChange(true, false);
    //     toast({
    //       variant: "success",
    //       title: `Category ${category ? "Updated" : "Added"} Successfully`,
    //     });
    //   }
    // } catch (error: any) {
    //   toast({
    //     variant: "destructive",
    //     title: `${(error as any)?.response?.data?.message || DEFAULT_ERROR_MESSAGE}`,
    //   });
    // } finally {
    //   setSubmitting(false);
    // }
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
      {/* <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        )}
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{supplier ? "Edit" : "Add New"} Supplier</DialogTitle>
          <DialogDescription>Create a new supplier for your inventory.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Supplier Name</Label>
              <Input id="name" placeholder="Enter category name" {...register("name")} />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Contact Number</Label>
              <Input id="contactNumber" placeholder="Contact Number" {...register("contactNumber")} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" placeholder="Contact Number" {...register("address")} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {supplier ? "Edit" : "Add"} Supplier
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

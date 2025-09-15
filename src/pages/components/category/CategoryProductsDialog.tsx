import { useEffect, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { Category } from "@/entries/category/category";
import {  useForm } from "react-hook-form";
import { DEFAULT_ERROR_MESSAGE } from "@/api/const";
import { addCategory } from "@/api/category/addCategory";
import { useToast } from "@/hooks/use-toast";
import { updateCategory } from "@/api/category/updateCategory";
import { Label } from "@/components/ui/label";

interface Props {
  open: boolean;
  onOpenChange: (refresh: boolean, open: boolean) => void;
  category?: Category;
  trigger?: React.ReactNode;
}

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;


export function CategoryProductsDialog({ open, onOpenChange, category, trigger }: Props) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  console.log("category", category);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "" },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (open) {
      reset(category ?? { name: "", description: "" });
    }
  }, [category, open, reset]);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    const payload: any = { ...data };

    try {
      const result = category ? await updateCategory(category.id, payload) : await addCategory(payload);
      if (result) {
        onOpenChange(true, false);
        toast({
          variant: "success",
          title: `Category ${category ? "Updated" : "Added"} Successfully`,
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
          <DialogTitle>{category ? "Edit" : "Add New"} Category</DialogTitle>
          <DialogDescription>Create a new category for your inventory.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Category Name</Label>
              <Input id="name" placeholder="Enter category name" {...register("name")} />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Category description" {...register("description")} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {category ? "Edit" : "Add"} Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useEffect, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { DEFAULT_ERROR_MESSAGE } from "@/api/const";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Expense } from "@/entries/expense/expense";
import { updateExpense } from "@/api/expense/updateExpense";
import { addExpense } from "@/api/expense/addExpense";
import { yyyyMMDD } from "@/lib/dateFormatter";

interface Props {
  open: boolean;
  onOpenChange: (refresh: boolean, open: boolean) => void;
  expense?: Expense;
}

const schema = z.object({
  date: z.string().min(1, "Date is required"),
  name: z.string().min(1, "Reason is required"),
  amount: z.number().min(0, "Amount must be positive"),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function AddExpenseDialog({ open, onOpenChange, expense }: Props) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const today = new Date();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", date: yyyyMMDD(today), amount: 0, description: "" },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (open) {
      reset(expense ?? { name: "", date: yyyyMMDD(today), amount: 0, description: "" });
    }
  }, [expense, open, reset]);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    const payload: any = { ...data };

    try {
      const result = expense ? await updateExpense(expense.id, payload) : await addExpense(payload);
      if (result) {
        onOpenChange(true, false);
        toast({
          variant: "success",
          title: `Expense ${expense ? "Updated" : "Added"} Successfully`,
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
          <DialogTitle>{expense ? "Edit" : "Add New"} Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" placeholder="Select date" {...register("date")} />
              {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Reason</Label>
              <Input id="name" placeholder="Enter reason" {...register("name")} />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter Amount"
                {...register("amount", { valueAsNumber: true })}
                min={0}
                onFocus={(e) => e.target.select()}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Note" {...register("description")} rows={3} />
            </div>

          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {expense ? "Edit" : "Add"} Expense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

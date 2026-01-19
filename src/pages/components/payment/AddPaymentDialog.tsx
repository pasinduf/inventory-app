import { useEffect, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { DEFAULT_ERROR_MESSAGE } from "@/api/const";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { yyyyMMDD } from "@/lib/dateFormatter";
import { CreditOrderPayment, PaymentReceipt } from "@/entries/payment/payment";
import { updatePayment } from "@/api/payments/updatePayment";
import { addPayment } from "@/api/payments/addPayment";
import { CreditOrder } from "@/entries/order/order";

interface Props {
  order: CreditOrder;
  open: boolean;
  onOpenChange: (refresh: boolean, open: boolean, response?: PaymentReceipt) => void;
  customer?: string;
  payment?: CreditOrderPayment;
}

const schema = z.object({
  date: z.string().min(1, "Date is required"),
  amount: z.number().min(0, "Amount must be positive"),
  orderId: z.number().min(0, ""),
});

type FormData = z.infer<typeof schema>;

export function AddPaymentDialog({ order ,customer,open, onOpenChange, payment }: Props) {
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
    defaultValues: { date: yyyyMMDD(today), amount: 0, orderId: order?.id },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (open) {
      reset(payment ?? { date: yyyyMMDD(today), amount: 0, orderId: order?.id });
    }
  }, [payment, open, reset]);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    const payload: any = { ...data };

    try {
      const result = payment ? await updatePayment(order.id, payload) : await addPayment(payload);
      if (result) {
        onOpenChange(true, false, result);
        toast({
          variant: "success",
          title: `Payment ${payment ? "Updated" : "Added"} Successfully`,
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
    onOpenChange(false, false, null);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          reset();
        }
        onOpenChange(false, false, null);
      }}
    >
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{payment ? "Edit" : "Add New"} Payment</DialogTitle>
          <DialogDescription>
            <div className="mt-1">{customer}</div>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" placeholder="Select date" {...register("date")} />
              {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter Amount"
                {...register("amount", { valueAsNumber: true })}
                min={0}
                step="any"
                onFocus={(e) => e.target.select()}
              />
              <p className="text-muted-foreground">Installment: {order?.installmentAmount}</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {payment ? "Edit" : "Add"} Payment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

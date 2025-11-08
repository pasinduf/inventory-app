import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEFAULT_ERROR_MESSAGE } from "@/api/const";
import { CreditOrder } from "@/entries/order/order";
import { updateCreditOrder } from "@/api/orders/updateCreditOrder";

const Schema = z.object({
  downPayment: z.number().min(0.01, "Enter valid Amount"),
  period: z.number().min(1, "Enter valid Period"),
  installmentAmount: z.number().min(0.01, "Enter valid Amount"),
});

type FormData = z.infer<typeof Schema>;

interface Props {
  open: boolean;
  onOpenChange: (refresh: boolean, open: boolean) => void;
  creditOrder: CreditOrder;
}

export function UpdateCreditOrderDialog({ open, onOpenChange, creditOrder }: Props) {

  console.log(creditOrder);
  
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const defaultValue = {
    downPayment: Number(creditOrder.downPayment),
    period: Number(creditOrder.period),
    installmentAmount: Number(creditOrder.installmentAmount),
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


  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    const payload: any = {...data };

    try {
      const result = await updateCreditOrder(creditOrder.id, payload);
      if (result) {
        toast({
          variant: "success",
          title: `Updated Successfully`,
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
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Update Credit Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 py-2">
            <div className="grid gap-2 mt-1">
              <Label htmlFor="downPayment">Down Payment</Label>
              <Input id="downPayment" name="downPayment" type="number" {...register("downPayment", { valueAsNumber: true })} min={0} step="any" />
              {errors.downPayment && <p className="text-red-500 text-sm">{errors.downPayment.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="period">Period (Days)</Label>
              <Input id="period" name="period" type="number" {...register("period", { valueAsNumber: true })} min={0} step="any" />
              {errors.period && <p className="text-red-500 text-sm">{errors.period.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="installmentAmount">Installment Amount</Label>
              <Input
                id="installmentAmount"
                type="number"
                name="installmentAmount"
                {...register("installmentAmount", { valueAsNumber: true })}
                min={0}
                step="any"
              />
              {errors.installmentAmount && <p className="text-red-500 text-sm">{errors.installmentAmount.message}</p>}
            </div>
          </div>
          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
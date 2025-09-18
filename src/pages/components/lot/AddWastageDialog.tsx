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
import { yyyyMMDD } from "@/lib/dateFormatter";
import { Wastage } from "@/entries/product/wastage";
import { updateWastage } from "@/api/product/updateWastage";
import { addWastage } from "@/api/product/addWastage";

interface Props {
  lotId:number,
  open: boolean;
  onOpenChange: (refresh: boolean, open: boolean) => void;
  wastage?: Wastage;
}

const schema = z.object({
  date: z.string().min(1, "Date is required"),
  reason: z.string().min(1, "Reason is required"),
  quantity: z.number().min(0, "Quantity must be positive"),
  lotId: z.number().min(0, ""),
});

type FormData = z.infer<typeof schema>;

export function AddWastageDialog({lotId, open, onOpenChange, wastage }: Props) {

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
    defaultValues: { lotId, reason: "", date: yyyyMMDD(today), quantity: 0 },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (open) {
      reset(wastage ?? { lotId, reason: "", date: yyyyMMDD(today), quantity: 0 });
    }
  }, [wastage, open, reset]);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    const payload: any = { ...data };

    try {
      const result = wastage ? await updateWastage(wastage.id, payload) : await addWastage(payload);
      if (result) {
        onOpenChange(true, false);
        toast({
          variant: "success",
          title: `Wastage ${wastage ? "Updated" : "Added"} Successfully`,
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
          <DialogTitle>{wastage ? "Edit" : "Add New"} Wastage</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" placeholder="Select date" {...register("date")} />
              {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea id="reason" placeholder="Reason" {...register("reason")} rows={3} />
              {errors.reason && <p className="text-red-500 text-sm">{errors.reason.message}</p>}
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
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {wastage ? "Edit" : "Add"} Wastage
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

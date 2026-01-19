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
import { Customer } from "@/entries/customer/customer";
import { updateCustomer } from "@/api/customer/updateCustomer";
import { addCustomer } from "@/api/customer/addCustomer";

interface Props {
  open: boolean;
  onOpenChange: (refresh: boolean, open: boolean) => void;
  customer?: Customer;
}

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  nic: z.string().min(1, "NIC is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  address: z.string().optional(),
  isCreditCustomer: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export function AddCustomerDialog({ open, onOpenChange, customer }: Props) {
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
    defaultValues: { firstName: "", lastName : "", nic : "", contactNumber: "", address:"", isCreditCustomer:true },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (open) {
      reset(customer ?? { firstName: "", lastName: "", nic: "", contactNumber: "", address: "", isCreditCustomer: true });
    }
  }, [customer, open, reset]);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    const payload: any = { ...data };

    try {
      const result = customer ? await updateCustomer(customer.id, payload) : await addCustomer(payload);
      if (result) {
        onOpenChange(true, false);
        toast({
          variant: "success",
          title: `Customer ${customer ? "Updated" : "Added"} Successfully`,
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{customer ? "Edit" : "Add New"} Customer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" placeholder="Enter first Name" {...register("firstName")} />
                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" placeholder="Enter last Name" {...register("lastName")} />
                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nic">NIC</Label>
                <Input id="nic" placeholder="Enter NIC" {...register("nic")} />
                {errors.nic && <p className="text-red-500 text-sm">{errors.nic.message}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name">Contact Number</Label>
                <Input id="contactNumber" placeholder="Enter contact number" {...register("contactNumber")} />
                {errors.contactNumber && <p className="text-red-500 text-sm">{errors.contactNumber.message}</p>}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" placeholder="Enter address" {...register("address")} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {customer ? "Edit" : "Add"} Customer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

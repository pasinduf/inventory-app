import { TableCell, TableRow } from "@/components/ui/table";
import { CreditOrder } from "@/entries/order/order";
import React from "react";
import OrderDetailsDialog from "./OrderDetailsDialog";
import { Button } from "@/components/ui/button";
import { HoverCard } from "@radix-ui/react-hover-card";
import { HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ArrowRight, Info, MoreHorizontal, Package, PencilIcon, PlusIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface Props {
  order: CreditOrder;
  handleEdit: (order: CreditOrder) => void;
  handleAddPayment: (order: CreditOrder) => void;
  handleViewPayments: (order: CreditOrder) => void;
}

const CreditOrderRow = React.memo(({
    order, 
    handleEdit, 
    handleAddPayment, 
    handleViewPayments
} : Props)=>{

  const navigate = useNavigate();

    return (
      <TableRow  className="border-b border-border hover:bg-muted/50">
        <TableCell className="py-4 px-4">
          <div className="flex items-center gap-3">
            <span className="font-medium text-muted-foreground">{order.date}</span>
          </div>
        </TableCell>
        <TableCell className="py-4 px-4 cursor-pointer">
          <OrderDetailsDialog orderId={order.orderId} orderNumber={order.orderNumber}>
            <Button variant="outline" size="sm">
              {order.orderNumber}
            </Button>
          </OrderDetailsDialog>
        </TableCell>
        <TableCell className="py-4 px-4 text-muted-foreground">
          {order.customer?.length > 20 ? (
            <HoverCard>
              <HoverCardTrigger asChild>
                <span>{order.customer?.substring(0, 20)}</span>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <p className="text-sm">{order.customer}</p>
              </HoverCardContent>
            </HoverCard>
          ) : (
            <span>{order.customer}</span>
          )}
        </TableCell>
        <TableCell className="py-4 px-4 text-muted-foreground">{order.amount}</TableCell>
        <TableCell className="py-4 px-4 text-muted-foreground">{order.downPayment}</TableCell>
        <TableCell className="py-4 px-4 text-muted-foreground">
          {order.remaining}

          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-2">
                <Info className="h-3 w-3 text-muted-foreground" />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto">
              <div>
                <div className="text-muted-foreground">Start Date: {order.startDate}</div>
                <div className="text-muted-foreground">End Date: {order.endDate}</div>
                <div className="text-muted-foreground">Period: {order.period} DAYS</div>
                <div className="text-muted-foreground">Installment: {order.installmentAmount}</div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </TableCell>
        <TableCell className="text-left">
          {order.isCompleted ? (
            <Badge className="bg-success text-success-foreground">Completed</Badge>
          ) : (
            <Badge className="bg-warning text-warning-foreground">Active</Badge>
          )}
        </TableCell>

        <TableCell className="text-left">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {order.isEditable && (
                <DropdownMenuItem
                  onClick={() => handleEdit(order)}
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => handleAddPayment(order)}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Payment
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleViewPayments(order)}
              >
                <Package className="h-4 w-4 mr-2" />
                View Payments
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>

        <TableCell className="py-4 px-4 text-right">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => navigate(`/credit-order/${order.id}`)}>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
          </Button>
        </TableCell>
      </TableRow>
    );
})

export default CreditOrderRow;
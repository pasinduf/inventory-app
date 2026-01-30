import { Badge } from "@/components/ui/badge";
import { Order } from "@/entries/order/order";
import React from "react";
import OrderDetailsDialog from "./OrderDetailsDialog";
import { Button } from "@/components/ui/button";
import { List, MoreHorizontal, PrinterIcon, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ConfirmDialog from "@/components/ui/confirm-dialog";

interface Props {
  order: Order;
  handlePrint : (orderId:number) => void;
  handeDelete : (orderId:number) => void;
}

const OrderRaw = React.memo(({order, handlePrint, handeDelete} : Props)=>{
    return (
      <tr key={order.id} className="border-b border-border hover:bg-muted/50">
        <td className="py-4 px-4">
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="font-medium">{order.date}</span>
          </div>
        </td>
        <td className="py-4 px-4 text-muted-foreground">
          <span>{order.orderNumber}</span>
        </td>
        <td className="py-4 px-4 text-muted-foreground">{order.amount}</td>
        <td className="py-4 px-4 text-muted-foreground">{order.discount}</td>

        <td className="py-4 px-4">
          {order.isCreditOrder ? (
            <Badge className="bg-warning text-warning-foreground">Credit</Badge>
          ) : (
            <Badge className="bg-success text-success-foreground">Cash</Badge>
          )}
        </td>

        <td className="py-4 px-4 text-right">
          <OrderDetailsDialog orderId={order.id} orderNumber={order.orderNumber}>
            <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-2">
              <List className="h-3 w-3 text-muted-foreground" />
            </Button>
          </OrderDetailsDialog>
        </td>
        <td>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handlePrint(order.id)}>
                <PrinterIcon className="h-4 w-4 mr-2" />
                Print
              </DropdownMenuItem>
              <ConfirmDialog
                title="Delete Order"
                description="Are you sure you want to delete this order?"
                confirmText="Delete"
                variant="destructive"
                onConfirm={() => handeDelete(order.id)}
              >
                <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Order
                </DropdownMenuItem>
              </ConfirmDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>
    );
})

export default OrderRaw;
// src/pages/UpdateStockPage.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ChevronDown, ChevronRight, Delete, Edit, Package, Plus, RefreshCw, Trash, Trash2 } from "lucide-react";
import { getProductDetails } from "@/api/product/getProductDetails";
import { AddWastageDialog } from "./components/lot/AddWastageDialog";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { deleteWastage } from "@/api/product/deleteWastage";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_ERROR_MESSAGE } from "@/api/const";
import { AddProductLotDialog } from "./components/lot/AddProductLotDialog";
import { deleteProductLot } from "@/api/product/deleteProductLot";

interface Lot {
  id: number;
  date: string;
  price: number;
  quantity: number;
}

const UpdateStock = () => {
  
  const { productId } = useParams<{ productId: string }>();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedLotId, setExpandedLotId] = useState<number | null>(null);
  const [product, setProduct] = useState<any>(null);
  const [lot, setLot] = useState<any>(null);
  const [wastage, setWastage] = useState<any>(null);
  const [openLot, setOpenLot] = useState(false);
  const [openWastage,setOpenWastage] = useState(false);
  const itemsPerPage = 3;

  const [lots, setLots] = useState<Lot[]>([
    { id: 1, date: "2025-09-01", price: 120, quantity: 30 },
    { id: 2, date: "2025-09-05", price: 115, quantity: 50 },
  ]);

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);
  
  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProductDetails(+productId);
      setProduct(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch product details");
    } finally {
      setLoading(false);
    }
  };


   const onDeleteProductLot = async (id)=>{
      try {
        const result = await deleteProductLot(id);
        if (result) {
          toast({
            variant: "success",
            title: `Product Lot Deleted Successfully`,
          });
          fetchProductDetails();
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: `${(error as any)?.response?.data?.message || DEFAULT_ERROR_MESSAGE}`,
        });
      }
  }


  const onDeleteWastage = async (id) => {
    try {
      const result = await deleteWastage(id);
      if (result) {
        toast({
          variant: "success",
          title: `Wastage Deleted Successfully`,
        });
        fetchProductDetails();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: `${(error as any)?.response?.data?.message || DEFAULT_ERROR_MESSAGE}`,
      });
    }
  };


  const onOpenChangeLot = (refresh: boolean, open: boolean) => {
    setLot(null);
    setOpenLot(open);
    if (refresh) fetchProductDetails();
  };

  const onOpenAddWastage=(lot:any)=>{
    setLot(lot);
    setOpenWastage(true);
  }

  const onOpenChangeWastage = (refresh: boolean, open: boolean) => {
    setLot(null);
    setWastage(null);
    setOpenWastage(open);
    if (refresh) fetchProductDetails();
  };


  return (
    <div className="min-h-screen p-8">
      <Card className="shadow-card">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-2xl font-semibold">Update Stock</h2>
            <p className="text-gray-500">
              Manage lots for {product?.name} ({product?.serialNumber})
            </p>
          </div>

          <div>
            <Button variant="outline" onClick={fetchProductDetails} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            <Button className="ml-4 bg-gradient-primary" onClick={() => setOpenLot(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Lot
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-border">
                  <TableHead className="text-left py-3 px-4 font-medium"></TableHead>
                  <TableHead className="text-left py-3 px-4 font-medium">Date</TableHead>
                  <TableHead className="text-left py-3 px-4 font-medium">Buying Price</TableHead>
                  <TableHead className="text-left py-3 px-4 font-medium">Selling Price</TableHead>
                  <TableHead className="text-left py-3 px-4 font-medium">Quantity ({product?.unit})</TableHead>
                  <TableHead className="text-left py-3 px-4 font-medium">Supplier</TableHead>
                  <TableHead className="text-center py-3 px-4 font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Loading skeleton rows
                  Array.from({ length: itemsPerPage }).map((_, index) => (
                    <TableRow key={index} className="border-b border-border">
                      <TableCell className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-10 h-10 rounded-lg" />
                          <Skeleton className="h-4 w-48" />
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <Skeleton className="h-4 w-12" />
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <Skeleton className="h-4 w-12" />
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <Skeleton className="h-4 w-12" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : error ? (
                  // Error state
                  <TableRow>
                    <TableCell colSpan={8} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <AlertCircle className="h-12 w-12 text-destructive" />
                        <div>
                          <h3 className="font-medium text-foreground">Failed to load product lots</h3>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : product?.productLots.length === 0 ? (
                  // Empty state
                  <TableRow>
                    <TableCell colSpan={8} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Package className="h-12 w-12 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium text-foreground">No products found</h3>
                          {/* <p className="text-muted-foreground">{searchQuery ? "Try adjusting your search terms" : "No products available at the moment"}</p> */}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  // Product lot rows
                  product?.productLots.map((lot) => (
                    <>
                      <TableRow key={lot.id} className="border-b border-border hover:bg-muted/50">
                        <TableCell
                          onClick={() => (lot?.wastages?.length > 0 ? setExpandedLotId(expandedLotId === lot.id ? null : lot.id) : onOpenAddWastage(lot))}
                        >
                          {lot?.wastages?.length > 0 ? (
                            expandedLotId === lot.id ? (
                              <Button variant="ghost" size="sm" className="h-8 w-8" onClick={() => {}}>
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button variant="ghost" size="sm" className="h-8 w-8" onClick={() => {}}>
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            )
                          ) : (
                            <Button variant="ghost" size="sm" className="h-8 w-8" onClick={() => {}}>
                              <Plus className="h-3 w-3" />
                            </Button>
                          )}
                        </TableCell>
                        <TableCell className="border px-4 py-2 text-muted-foreground">{lot.date}</TableCell>
                        <TableCell className="border px-4 py-2 text-muted-foreground">{lot.buyingPrice}</TableCell>
                        <TableCell className="border px-4 py-2 text-muted-foreground">{lot.sellingPrice}</TableCell>
                        <TableCell className="border px-4 py-2 text-muted-foreground">{lot.quantity}</TableCell>
                        <TableCell className="border px-4 py-2 text-muted-foreground">{lot?.supplier?.name}</TableCell>
                        <TableCell className="border px-4 py-2 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 ml-2"
                            onClick={() => {
                              setLot({
                                ...lot,
                                supplierId: lot?.supplier?.id,
                              });
                              setOpenLot(true);
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>

                          <ConfirmDialog
                            title="Delete Product Lot"
                            description="Are you sure you want to delete the lot?"
                            confirmText="Delete"
                            variant="destructive"
                            onConfirm={() => onDeleteProductLot(lot.id)}
                          >
                            <Button variant="ghost" size="sm" className="text-destructive h-8 w-8 ml-3">
                              <Trash2 className="h-4 w-4 mr-2" />
                            </Button>
                          </ConfirmDialog>
                        </TableCell>
                      </TableRow>
                      {expandedLotId === lot.id && (
                        <TableRow>
                          <TableCell colSpan={4} className="px-4 py-2">
                            <div>
                              {lot?.wastages?.length > 0 && (
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2">
                                  <div>
                                    <p className="text-foreground px-3">Wastages</p>
                                  </div>
                                  <Button size="sm" className="bg-gradient-primary mt-2" onClick={() => onOpenAddWastage(lot)}>
                                    <Plus className="h-2 w-2 mr-2" />
                                    Add Wastage
                                  </Button>
                                </div>
                              )}

                              {lot?.wastages?.length > 0 && (
                                <Table className="w-full">
                                  <TableHeader>
                                    <TableRow className="hover:bg-muted/50">
                                      <TableHead className="py-1 text-center">Date</TableHead>
                                      <TableHead className="py-1 text-center">Quantity ({product?.unit})</TableHead>
                                      <TableHead className="py-1 text-center">Reason</TableHead>
                                      <TableHead className="py-1 text-center"></TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {lot.wastages.map((wastage) => (
                                      <TableRow key={`${lot.id}_wastage_${wastage.id}`}>
                                        <TableCell className="text-center text-muted-foreground px-4 py-1">{wastage.date}</TableCell>
                                        <TableCell className="text-center text-muted-foreground px-4 py-1">{wastage.quantity}</TableCell>
                                        <TableCell className="text-center text-muted-foreground px-4 py-1">{wastage.reason}</TableCell>
                                        <TableCell className="text-center">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() => {
                                              setLot(lot);
                                              setWastage({ ...wastage, lotId: lot.id });
                                              setOpenWastage(true);
                                            }}
                                          >
                                            <Edit className="h-3 w-3" />
                                          </Button>

                                          <ConfirmDialog
                                            title="Delete Wastage"
                                            description="Are you sure you want to delete this wastage?"
                                            confirmText="Delete"
                                            variant="destructive"
                                            onConfirm={() => onDeleteWastage(wastage.id)}
                                          >
                                            <Button variant="ghost" size="sm" className="text-destructive h-8 w-8 p-0 ml-2" onClick={() => {}}>
                                              <Trash2 className="h-3 w-3" />
                                            </Button>
                                          </ConfirmDialog>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <AddProductLotDialog productId={+productId} open={openLot} onOpenChange={onOpenChangeLot} lot={lot} />
          <AddWastageDialog lotId={lot?.id} open={openWastage} onOpenChange={onOpenChangeWastage} wastage={wastage} />
        </CardContent>
      </Card>
    </div>
  );
}

export default UpdateStock;

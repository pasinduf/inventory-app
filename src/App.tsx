import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLayout } from "@/components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Suppliers from "./pages/Suppliers";
import Expenses from "./pages/Expenses";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import CreditOrders from "./pages/CreditOrders";
import UpdateStock from "./pages/UpdateStock";
import NewOrder from "./pages/NewOrder";
import CreditOrderDetails from "./pages/CreditOrderDetails";
import RequireAuth from "./components/RequireAuth";
import Payments from "./pages/Payments";
import OrderSummary from "./pages/OrderSummary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* <LogoOverlay /> */}
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<RequireAuth />}>
              <Route
                path="*"
                element={
                  <AdminLayout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/suppliers" element={<Suppliers />} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/update-stock/:productId" element={<UpdateStock />} />
                      <Route path="/expenses" element={<Expenses />} />
                      <Route path="/customers" element={<Customers />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/credit-orders" element={<CreditOrders />} />
                      <Route path="/payments" element={<Payments />} />
                      <Route path="/report" element={<OrderSummary />} />
                      <Route path="/credit-order/:id" element={<CreditOrderDetails />} />
                      <Route path="/order/new" element={<NewOrder />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AdminLayout>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

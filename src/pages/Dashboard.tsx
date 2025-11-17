import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, 
  AlertTriangle, 
  Building2,
  BanknoteIcon,
  AlertCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { getSummary } from "@/api/dashboard/getSummary";
import { Summary } from "@/entries/dashboard/summary";
import { Skeleton } from "@/components/ui/skeleton";
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getSales } from "@/api/dashboard/getSales";
import { Sale } from "@/entries/dashboard/sales";
import { addDaysToDate, yyyyMMDD } from "@/lib/dateFormatter";
import { formatNumber } from "@/lib/decimalFormatter";


const Dashboard = () => {

 const [loadingSummary, setLoadingSummary] = useState(true);
 const [loadingSales, setLoadingSales] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [summary, setSummary] = useState<Summary | null>(null);

 
 const [sales, setSales] = useState<Sale[] | []>(null);
 const [fromDate, setFromDate] = useState("");
 const [toDate, setToDate] = useState("");
 const [chartType, setChartType] = useState("week");
 const now = new Date();
 const cardsPerPage = 4;


  useEffect(() => {
    fetchSummary();
  }, []);


  const fetchSummary = async () => {
    try {
      setLoadingSummary(true);
      setError(null);

      const response = await getSummary();
      setSummary(response);;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch summary data");
    } finally {
      setLoadingSummary(false);
    }
  };
   
   useEffect(() => {
     const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
     const today = now;

     setFromDate(yyyyMMDD(firstDay));
     setToDate(yyyyMMDD(today));
   }, []);

   useEffect(()=>{
      if(chartType === 'week'){
        const firstDay = addDaysToDate(now, -7);
        setFromDate(yyyyMMDD(firstDay));
      }else{
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        setFromDate(yyyyMMDD(firstDay));
      }
   },[chartType])

    useEffect(() => {
        if (fromDate && toDate) {
          fetchSales();
        }
      }, [fromDate, toDate]);

  const fetchSales = async () => {
    try {
      setLoadingSales(true);
      setError(null);

      const response = await getSales({ fromDate, toDate});
      setSales(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch sales data");
    } finally {
      setLoadingSales(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your inventory.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loadingSummary ? (
          Array.from({ length: cardsPerPage }).map((_, index) => (
            <Card key={index} className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-8" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-8" />
              </CardContent>
            </Card>
          ))
        ) : error ? (
          // Error state
          <div className="col-span-full">
            <Card className="shadow-card">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <h3 className="font-medium text-foreground mb-2">Failed to load data</h3>
              </CardContent>
            </Card>
          </div>
        ) : (
          summary && (
            <>
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary?.totalCategories}</div>
                  {/* <div className="flex items-center space-x-2 text-xs">
              <Badge variant={stat.changeType === "positive" ? "default" : "destructive"} className="text-xs">
                {stat.change}
              </Badge>
              <span className="text-muted-foreground">from last month</span>
            </div> */}
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary?.totalProducts}</div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Products Value</CardTitle>
                  <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(summary?.totalProductsValue)}</div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Credit Orders</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(summary?.totalCreditOrdersValue)}</div>
                </CardContent>
              </Card>
            </>
          )
        )}
      </div>
      <div className="grid grid-cols-1 gap-6">
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">Recent Sales</CardTitle>
            <select
              id="type"
              name="type"
              className="mt-1 block  rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={chartType}
              onChange={(e: any) => setChartType(e.target.value)}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={500}
                  height={300}
                  data={sales}
                  // margin={{
                  //   top: 5,
                  //   right: 30,
                  //   left: 20,
                  //   bottom: 5,
                  // }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip cursor={{ fill: "transparent" }} />
                  <Legend />
                  <Bar dataKey="instantSales" fill="#8884d8" name="Instant Orders" barSize={20} />
                  <Bar dataKey="creditPayments" fill="#82ca9d" name="Credit Payments" barSize={20} />
                  {/* <Bar dataKey="uv" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} /> */}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Low Stock Alert
            </CardTitle>
            <Button variant="outline" size="sm">
              View All
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.map((product) => (
                <div key={product.sku} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant="destructive" className="text-xs">
                      {product.current}/{product.minimum}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>


        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.item}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* Quick Actions */}
      {/* <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Package className="h-6 w-6" />
              <span>Add Product</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <ShoppingCart className="h-6 w-6" />
              <span>Update Stock</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Building2 className="h-6 w-6" />
              <span>Add Supplier</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <TrendingUp className="h-6 w-6" />
              <span>View Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default Dashboard;
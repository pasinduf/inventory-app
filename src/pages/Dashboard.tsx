import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  ShoppingCart,
  Building2,
  Plus,
  ArrowUpRight
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Products",
      value: "1,247",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: Package
    },
    {
      title: "Low Stock Items",
      value: "23",
      change: "-5.2%",
      changeType: "negative" as const,
      icon: AlertTriangle
    },
    {
      title: "Total Value",
      value: "$284,590",
      change: "+18.7%",
      changeType: "positive" as const,
      icon: DollarSign
    },
    {
      title: "Categories",
      value: "48",
      change: "+2",
      changeType: "positive" as const,
      icon: Building2
    }
  ];

  const lowStockProducts = [
    { name: "Wireless Mouse", sku: "WM001", current: 5, minimum: 20, category: "Electronics" },
    { name: "Office Chair", sku: "OC102", current: 2, minimum: 10, category: "Furniture" },
    { name: "Bluetooth Speaker", sku: "BS203", current: 8, minimum: 25, category: "Electronics" },
    { name: "Desk Lamp", sku: "DL404", current: 3, minimum: 15, category: "Lighting" },
  ];

  const recentActivity = [
    { action: "Stock Updated", item: "Laptop Stand", time: "2 minutes ago" },
    { action: "New Product Added", item: "Ergonomic Keyboard", time: "1 hour ago" },
    { action: "Stock Alert", item: "USB Cable", time: "3 hours ago" },
    { action: "Category Created", item: "Gaming Accessories", time: "5 hours ago" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your inventory.
          </p>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs">
                <Badge 
                  variant={stat.changeType === "positive" ? "default" : "destructive"}
                  className="text-xs"
                >
                  {stat.change}
                </Badge>
                <span className="text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low Stock Alert */}
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

        {/* Recent Activity */}
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
      </div>

      {/* Quick Actions */}
      <Card className="shadow-card">
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
      </Card>
    </div>
  );
};

export default Dashboard;
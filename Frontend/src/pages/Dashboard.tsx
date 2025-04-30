import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { StockAlerts } from "@/components/dashboard/StockAlerts";
import { BestSellingProducts } from "@/components/dashboard/BestSellingProducts";
import { RecentSales } from "@/components/dashboard/RecentSales";
import {
  getDashboardStats,
  getBestSellingProducts,
  getRecentSales,
} from "@/utils/api";
import { getProductCount, getLowStockCount, getLowStockProducts } from "@/api/productApi";
import {
  DashboardStats,
  BestSellingProduct,
  StockAlert,
  RecentSale,
} from "@/types";
import {
  Package,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { BarChart } from "@/components/dashboard/BarChart";
import { monthlySalesData, categorySalesData } from "@/utils/mockData";
import { DoughnutChart } from "@/components/dashboard/DoughnutChart";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bestSelling, setBestSelling] = useState<BestSellingProduct[]>([]);
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);
  const [recentSales, setRecentSales] = useState<RecentSale[]>([]);
  const [productCount, setProductCount] = useState<number>(0);
  const [lowStockCount, setLowStockCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch product count, low stock count, and low stock products from the actual database
        const [count, lowStock, lowStockProducts] = await Promise.all([
          getProductCount(),
          getLowStockCount(),
          getLowStockProducts(token)
        ]);
        setProductCount(count);
        setLowStockCount(lowStock);
        
        // Transform the low stock products data to match StockAlert type
        const transformedAlerts = lowStockProducts.map(product => ({
          id: product._id,
          name: product.name,
          currentStock: product.stock,
          reorderLevel: product.reorderLevel,
          supplier: product.supplier,
          status: product.stock === 0 ? 'outOfStock' : 'low'
        }));
        setStockAlerts(transformedAlerts);
        
        const [statsRes, bestSellingRes, salesRes] = await Promise.all([
          getDashboardStats(),
          getBestSellingProducts(),
          getRecentSales(),
        ]);

        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        }

        if (bestSellingRes.success && bestSellingRes.data) {
          setBestSelling(bestSellingRes.data);
        }

        if (salesRes.success && salesRes.data) {
          setRecentSales(salesRes.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  return (
    <AppLayout allowedRoles={["admin", "staff"]}>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Products"
            value={productCount}
            description="Total products in inventory MY name is parth"
            icon={Package}
            iconColor="text-blue-500"
          />
          <StatCard
            title="Total Sales"
            value={stats?.totalSales ?? 0}
            description="Total sales made"
            icon={ShoppingCart}
            iconColor="text-green-500"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Revenue"
            value={`$${stats?.totalRevenue.toFixed(2) ?? "0.00"}`}
            description="Total revenue generated"
            icon={DollarSign}
            iconColor="text-amber-500"
            trend={{ value: 8.5, isPositive: true }}
          />
          <StatCard
            title="Low Stock Items"
            value={lowStockCount}
            description="Products needing attention"
            icon={AlertTriangle}
            iconColor="text-red-500"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="grid gap-6 h-full">
            <BestSellingProducts products={bestSelling} isLoading={isLoading} />
          </div>
          <div className="grid gap-6 h-full">
            <StockAlerts alerts={stockAlerts} isLoading={isLoading} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <BarChart data={monthlySalesData} title="Monthly Sales (2023)" />
          </div>
          <div>
            <DoughnutChart data={categorySalesData} title="Sales by Category" />
          </div>
        </div>

        <div className="mt-6">
          <RecentSales sales={recentSales} isLoading={isLoading} />
        </div>
      </div>
    </AppLayout>
  );
}

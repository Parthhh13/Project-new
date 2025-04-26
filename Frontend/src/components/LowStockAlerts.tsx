import { useEffect, useState } from "react";
import { Product } from "@/types";
import { getProducts } from "@/api/productApi";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function LowStockAlerts() {
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchLowStockProducts = async () => {
      try {
        setIsLoading(true);
        const products = await getProducts(token);
        // Filter products where stock is less than or equal to reorder level
        const lowStock = products.filter(
          (product) => product.stock <= product.reorderLevel
        );
        setLowStockProducts(lowStock);
      } catch (error) {
        console.error("Error fetching low stock products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLowStockProducts();
  }, [token]);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-20 bg-gray-100 rounded-lg"></div>
      </div>
    );
  }

  if (lowStockProducts.length === 0) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-5 w-5" />
      <AlertTitle className="text-lg font-bold">⚠️ Low Stock Alerts</AlertTitle>
      <AlertDescription>
        <ul className="mt-2 space-y-1">
          {lowStockProducts.map((product) => (
            <li key={product._id} className="flex items-center justify-between">
              <span className="font-medium">{product.name}</span>
              <span className="text-sm">
                Only {product.stock} left
                {product.reorderLevel > 0 && (
                  <span className="text-muted-foreground ml-2">
                    (Reorder at {product.reorderLevel})
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
} 
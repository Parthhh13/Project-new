import React, { useState, useEffect } from 'react';
import { reportService } from '../services/api';

const Reports = () => {
  const [salesData, setSalesData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0], // Last month
    endDate: new Date().toISOString().split('T')[0] // Today
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const [sales, inventory, products] = await Promise.all([
          reportService.getSalesReport({ ...dateRange, groupBy: 'day' }),
          reportService.getInventoryReport({ lowStock: true }),
          reportService.getProductReport({ ...dateRange, limit: 10 })
        ]);

        setSalesData(sales.data);
        setInventoryData(inventory.data);
        setTopProducts(products.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [dateRange]);

  if (loading) return (
    <div className="flex justify-center items-center h-full">
      <div className="text-xl">Loading reports...</div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-full">
      <div className="text-xl text-red-600">Error: {error}</div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Reports Dashboard</h1>
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="border rounded p-2"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sales Report Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Sales Report</h2>
          <div className="space-y-4">
            {salesData.map((sale) => (
              <div key={sale._id} className="border-b pb-2">
                <div className="font-medium">{new Date(sale._id).toLocaleDateString()}</div>
                <div className="text-gray-600">Total Sales: ${sale.totalSales.toFixed(2)}</div>
                <div className="text-gray-600">Orders: {sale.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Report Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Low Stock Inventory</h2>
          <div className="space-y-4">
            {inventoryData.map((category) => (
              <div key={category._id} className="border-b pb-2">
                <div className="font-medium">{category._id || 'Uncategorized'}</div>
                <div className="text-gray-600">Products: {category.totalProducts}</div>
                <div className="text-gray-600">Total Stock: {category.totalStock}</div>
                <div className="text-gray-600">Value: ${category.totalValue.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
          <div className="space-y-4">
            {topProducts.map((item) => (
              <div key={item.product.id} className="border-b pb-2">
                <div className="font-medium">{item.product.name}</div>
                <div className="text-gray-600">Category: {item.product.category}</div>
                <div className="text-gray-600">Quantity Sold: {item.totalQuantity}</div>
                <div className="text-gray-600">Revenue: ${item.totalRevenue.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 
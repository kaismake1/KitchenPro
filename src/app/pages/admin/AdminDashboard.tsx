import { Users, Package, ShoppingBag, DollarSign } from "lucide-react";
import { toast } from "sonner";

import { useEffect, useState } from "react";
const API_URL = "http://localhost:8000/api";

export function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<"week" | "month" | "year">(
    "month",
  );
  const [periodRevenue, setPeriodRevenue] = useState(0);
  const [allOrders, setAllOrders] = useState<any[]>([]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Fetch users
      const usersRes = await fetch(`${API_URL}/admin/users`, { headers });
      const users = usersRes.ok ? await usersRes.json() : [];

      // Fetch products
      const productsRes = await fetch(`${API_URL}/products/`);
      const products = productsRes.ok ? await productsRes.json() : [];

      // Fetch orders
      const ordersRes = await fetch(`${API_URL}/admin/orders`, { headers });
      const orders = ordersRes.ok ? await ordersRes.json() : [];

      // Store all orders for period filtering
      setAllOrders(orders);

      // Calculate revenue - chỉ từ orders có status "paid"
      const revenue = orders
        .filter((order: any) => order.status === "paid")
        .reduce((sum: number, order: any) => sum + (order.total || 0), 0);

      setStats({
        users: users.length,
        products: products.length,
        orders: orders.length,
        revenue,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Không thể tải thống kê");
      setLoading(false);
    }
  };

  const calculatePeriodRevenue = (period: "week" | "month" | "year") => {
    const now = new Date();
    const paidOrders = allOrders.filter(
      (order: any) => order.status === "paid",
    );

    let startDate = new Date();

    if (period === "week") {
      startDate.setDate(now.getDate() - 7);
    } else if (period === "month") {
      startDate.setMonth(now.getMonth() - 1);
    } else if (period === "year") {
      startDate.setFullYear(now.getFullYear() - 1);
    }

    const revenue = paidOrders
      .filter((order: any) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startDate && orderDate <= now;
      })
      .reduce((sum: number, order: any) => sum + (order.total || 0), 0);

    return revenue;
  };

  useEffect(() => {
    // Fetch stats immediately
    fetchStats();

    // Set up interval to refresh stats every 5 seconds for real-time updates
    const interval = setInterval(() => {
      fetchStats();
    }, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Calculate period revenue whenever timePeriod or allOrders changes
    const revenue = calculatePeriodRevenue(timePeriod);
    setPeriodRevenue(revenue);
  }, [timePeriod, allOrders]);

  if (loading) {
    return <div className="text-center py-20">Đang tải thống kê...</div>;
  }

  const cards = [
    {
      title: "Tổng Người Dùng",
      value: stats.users,
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Tổng Sản Phẩm",
      value: stats.products,
      icon: Package,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Tổng Đơn Hàng",
      value: stats.orders,
      icon: ShoppingBag,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Doanh Thu",
      value: `${stats.revenue.toLocaleString("vi-VN")} ₫`,
      icon: DollarSign,
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Tổng Quan Bảng Điều Khiển
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${card.color} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">{card.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Thống Kê Doanh Thu
        </h2>

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setTimePeriod("week")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              timePeriod === "week"
                ? "bg-gradient-to-r from-[#0A3D62] to-[#1E90FF] text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Tuần Này
          </button>
          <button
            onClick={() => setTimePeriod("month")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              timePeriod === "month"
                ? "bg-gradient-to-r from-[#0A3D62] to-[#1E90FF] text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Tháng Này
          </button>
          <button
            onClick={() => setTimePeriod("year")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              timePeriod === "year"
                ? "bg-gradient-to-r from-[#0A3D62] to-[#1E90FF] text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Năm Này
          </button>
        </div>

        {/* Revenue Display */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-8 border-2 border-orange-200">
          <p className="text-gray-600 text-sm mb-2">
            Doanh Thu{" "}
            {timePeriod === "week"
              ? "Tuần Này"
              : timePeriod === "month"
                ? "Tháng Này"
                : "Năm Này"}
          </p>
          <div className="flex items-center gap-3">
            <DollarSign className="w-10 h-10 text-orange-500" />
            <p className="text-5xl font-bold text-orange-600">
              {periodRevenue.toLocaleString("vi-VN")}
            </p>
            <p className="text-2xl text-orange-500 ml-2">₫</p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-gray-600 mb-1">Tổng Đơn Hàng</p>
            <p className="text-2xl font-bold text-blue-600">{stats.orders}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-gray-600 mb-1">Tổng Doanh Thu</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.revenue.toLocaleString("vi-VN")} ₫
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <p className="text-sm text-gray-600 mb-1">Đơn Hàng Đã Thanh Toán</p>
            <p className="text-2xl font-bold text-purple-600">
              {allOrders.filter((o: any) => o.status === "paid").length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { Package, Calendar, Truck, Eye } from "lucide-react";

const API_URL = "http://localhost:8000/api";

export function OrderHistoryPage() {
  const { user, isLoading, accessToken } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
      return;
    }

    if (user) {
      fetchOrders();
    }
  }, [user, isLoading, navigate]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/checkout/user/history`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        console.error("Failed to fetch orders");
        setOrders([]);
        return;
      }

      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const res = await fetch(`${API_URL}/checkout/${orderId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        console.error("Failed to fetch order details");
        return null;
      }
      return await res.json();
    } catch (err) {
      console.error("Error fetching order details:", err);
      return null;
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E90FF] mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-[calc(100vh-20rem)] py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Lịch Sử Đơn Hàng
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-24 h-24 mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Chưa có đơn hàng
            </h2>
            <p className="text-gray-600">
              Bắt đầu mua sắm để xem các đơn hàng của bạn tại đây
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Đơn Hàng #{order.id}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(
                        order.createdAt || order.date,
                      ).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                    {order.status}
                  </span>
                </div>

                <div className="border-t border-b py-4 my-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-600">
                      Mặt Hàng: {order.itemCount ?? 0}
                    </p>
                    <p className="text-2xl font-bold text-[#0A3D62]">
                      {(order.total || 0).toLocaleString("vi-VN")} ₫
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Truck className="w-4 h-4 mr-1" />
                    Công Ty Vận Chuyển: {order.shipper || "—"}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Thanh Toán:{" "}
                    {order.paymentMethod === "qr"
                      ? "Mã QR"
                      : "Trả Tiền Khi Nhận"}
                  </div>
                  <button
                    onClick={async () => {
                      if (selectedOrder?.id === order.id) {
                        setSelectedOrder(null);
                        return;
                      }
                      const details = await fetchOrderDetails(order.id);
                      if (details) setSelectedOrder(details);
                    }}
                    className="flex items-center space-x-2 text-[#1E90FF] hover:text-[#0A3D62] font-semibold transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>
                      {selectedOrder?.id === order.id ? "Ẩn" : "Xem"} Chi Tiết
                    </span>
                  </button>
                </div>

                {selectedOrder?.id === order.id && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-bold mb-3">Mặt Hàng Trong Đơn Hàng:</h4>
                    <div className="space-y-2">
                      {selectedOrder.items?.map((item: any) => (
                        <div
                          key={item.productId || item.id}
                          className="flex justify-between py-2"
                        >
                          <span>
                            {item.name} x{item.quantity}
                          </span>
                          <span className="font-semibold">
                            {(item.price * item.quantity).toLocaleString(
                              "vi-VN",
                            )}{" "}
                            ₫
                          </span>
                        </div>
                      )) || <p className="text-gray-500">Không có sản phẩm</p>}
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <h4 className="font-bold mb-2">Địa Chỉ Giao Hàng:</h4>
                      <p className="text-gray-600">
                        {selectedOrder.shippingInfo?.fullName || "—"}
                      </p>
                      <p className="text-gray-600">
                        {selectedOrder.shippingInfo?.phone || "—"}
                      </p>
                      <p className="text-gray-600">
                        {selectedOrder.shippingInfo?.address || "—"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

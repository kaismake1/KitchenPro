import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { apiClient } from "../../utils/apiClient";
import {
  MapPin,
  Phone,
  Package,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Loader,
} from "lucide-react";

interface OrderItem {
  productId: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  status: string;
  total: number;
  paymentMethod: string;
  shippingInfo: {
    fullName: string;
    phone: string;
    address: string;
  };
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export function ShipperDashboard() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "shipper")) {
      toast.error("Chỉ shipper mới có thể truy cập trang này");
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user && user.role === "shipper") {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const data = await apiClient.get("/shipper/orders");
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId);
    try {
      await apiClient.patch(`/shipper/${orderId}/status`, {
        status: newStatus,
      });
      toast.success(`Cập nhật trạng thái thành công!`);
      fetchOrders();
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error(error.message || "Lỗi cập nhật trạng thái");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
            Chờ Xử Lý
          </span>
        );
      case "paid":
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
            Đã Thanh Toán
          </span>
        );
      case "shipped":
        return (
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
            Đang Giao
          </span>
        );
      case "delivered":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold flex items-center gap-1">
            <CheckCircle className="w-4 h-4" /> Đã Giao
          </span>
        );
      case "cancelled":
        return (
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold flex items-center gap-1">
            <XCircle className="w-4 h-4" /> Hủy
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
            {status}
          </span>
        );
    }
  };

  const toggleExpandOrder = (orderId: string) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const canUpdateStatus = (status: string) => {
    return status !== "delivered" && status !== "cancelled";
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

  return (
    <div className="min-h-[calc(100vh-20rem)] py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Bảng Điều Khiển Shipper
          </h1>
          <p className="text-gray-600">
            Quản lý đơn hàng và cập nhật trạng thái giao hàng
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              Không có đơn hàng nào được giao cho bạn
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Tổng Đơn Hàng</p>
                <p className="text-2xl font-bold text-[#1E90FF]">
                  {orders.length}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Đã Giao</p>
                <p className="text-2xl font-bold text-green-600">
                  {orders.filter((o) => o.status === "delivered").length}
                </p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Đang Xử Lý</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {
                    orders.filter((o) =>
                      ["pending", "paid", "shipped"].includes(o.status),
                    ).length
                  }
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Đã Hủy</p>
                <p className="text-2xl font-bold text-red-600">
                  {orders.filter((o) => o.status === "cancelled").length}
                </p>
              </div>
            </div>

            {orders.map((order) => {
              const isExpanded = expandedOrders.has(order.id);
              const isUpdating = updatingStatus === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Order Header - Click to expand */}
                  <button
                    onClick={() => toggleExpandOrder(order.id)}
                    className="w-full px-6 py-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            Đơn Hàng #{order.id.substring(0, 8).toUpperCase()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString(
                              "vi-VN",
                            )}
                          </p>
                        </div>
                        <div className="ml-4">
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-bold text-[#0A3D62]">
                        {order.total.toLocaleString("vi-VN")} ₫
                      </p>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Order Details - Expanded */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                      {/* Recipient Information */}
                      <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-4">
                          Thông Tin Người Nhận
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-600">
                              Tên Người Nhận
                            </p>
                            <p className="font-semibold text-gray-900">
                              {order.shippingInfo.fullName}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Phone className="w-4 h-4" /> Số Điện Thoại
                            </p>
                            <p className="font-semibold text-gray-900">
                              {order.shippingInfo.phone}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <MapPin className="w-4 h-4" /> Địa Chỉ Giao Hàng
                            </p>
                            <p className="font-semibold text-gray-900">
                              {order.shippingInfo.address}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-4">
                          Danh Sách Sản Phẩm
                        </h3>
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div
                              key={item.productId}
                              className="flex justify-between items-center pb-3 border-b last:border-b-0"
                            >
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">
                                  {item.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Số lượng: {item.quantity}
                                </p>
                              </div>
                              <p className="font-bold text-[#0A3D62]">
                                {(item.price * item.quantity).toLocaleString(
                                  "vi-VN",
                                )}{" "}
                                ₫
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-3 border-t font-bold text-gray-900 flex justify-between">
                          <span>Tổng Cộng:</span>
                          <span className="text-[#0A3D62]">
                            {order.total.toLocaleString("vi-VN")} ₫
                          </span>
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600">
                          Phương Thức Thanh Toán
                        </p>
                        <p className="font-semibold text-gray-900 capitalize">
                          {order.paymentMethod === "qr"
                            ? "Mã QR / Chuyển Khoản"
                            : order.paymentMethod === "cod"
                              ? "Trả Tiền Khi Nhận"
                              : order.paymentMethod}
                        </p>
                      </div>

                      {/* Status Update Actions */}
                      {canUpdateStatus(order.status) && (
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm font-semibold text-gray-900 mb-3">
                            Cập Nhật Trạng Thái
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() =>
                                handleStatusUpdate(order.id, "delivered")
                              }
                              disabled={isUpdating}
                              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition-colors"
                            >
                              {isUpdating ? (
                                <Loader className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                              Đã Giao
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(order.id, "cancelled")
                              }
                              disabled={isUpdating}
                              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400 transition-colors"
                            >
                              {isUpdating ? (
                                <Loader className="w-4 h-4 animate-spin" />
                              ) : (
                                <XCircle className="w-4 h-4" />
                              )}
                              Hủy
                            </button>
                          </div>
                        </div>
                      )}

                      {!canUpdateStatus(order.status) && (
                        <div className="p-4 bg-gray-100 rounded-lg text-center text-gray-600">
                          Đơn hàng này không thể cập nhật trạng thái
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import {
  Package,
  Calendar,
  User,
  DollarSign,
  Trash2,
  Edit,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";

export function ManageOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [newStatus, setNewStatus] = useState("");
  const [editingShipper, setEditingShipper] = useState<any>(null);
  const [shipperName, setShipperName] = useState("");
  const [shipperPhone, setShipperPhone] = useState("");
  const { accessToken, isAdmin } = useAuth();

  useEffect(() => {
    loadOrders();
  }, [accessToken, isAdmin]);

  const loadOrders = async () => {
    if (!accessToken || !isAdmin) {
      toast.error("Bạn không có quyền truy cập trang này");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/admin/orders", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await res.json();
      setOrders(
        data.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
    } catch (err) {
      console.error("Error loading orders:", err);
      toast.error("Không thể tải dữ liệu đơn hàng");
      setOrders([]);
    }
  };

  const handleStatusChange = (order: any) => {
    setEditingOrder(order);
    setNewStatus(order.status || "pending");
  };

  const handleShipperEdit = (order: any) => {
    setEditingShipper(order);
    setShipperName(order.shipper || "");
    setShipperPhone(order.shipper_phone || "");
  };

  const getStockChangeInfo = (oldStatus: string, newStatus: string) => {
    const RESERVED_STATUSES = ["paid", "shipping", "delivered"];
    const isOldReserved = RESERVED_STATUSES.includes(oldStatus);
    const isNewReserved = RESERVED_STATUSES.includes(newStatus);

    if (!isOldReserved && isNewReserved) {
      return "sẽ trừ số lượng kho";
    } else if (isOldReserved && !isNewReserved) {
      return "sẽ trả lại số lượng kho";
    }
    return "";
  };

  const handleSaveStatus = async () => {
    if (!editingOrder) return;

    // Get stock change info
    const stockChangeInfo = getStockChangeInfo(editingOrder.status, newStatus);

    // Show confirmation dialog if stock will change
    if (stockChangeInfo) {
      const productList = editingOrder.items
        ?.map((item: any) => `${item.name} (x${item.quantity})`)
        .join(", ");

      const confirmed = confirm(
        `Cập nhật trạng thái sẽ ${stockChangeInfo}:\n\n${productList}\n\nBạn có chắc chắn?`,
      );

      if (!confirmed) {
        return;
      }
    }

    try {
      // Update via backend
      const res = await fetch(
        `http://localhost:8000/api/admin/orders/${editingOrder.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (!res.ok) {
        throw new Error("Failed to update order status");
      }

      const updatedOrders = orders.map((o) =>
        o.id === editingOrder.id ? { ...o, status: newStatus } : o,
      );
      setOrders(updatedOrders);

      const statusMap: any = {
        pending: "Chờ Xử Lý",
        paid: "Đã Thanh Toán",
        shipping: "Đang Vận Chuyển",
        delivered: "Đã Giao",
        cancelled: "Đã Hủy",
      };

      toast.success(
        `Cập nhật trạng thái thành ${statusMap[newStatus]}. ${stockChangeInfo ? "Kho hàng đã được cập nhật." : ""}`,
      );
      setEditingOrder(null);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng");
    }
  };

  const handleSaveShipper = async () => {
    if (!editingShipper) return;

    if (!shipperName.trim() || !shipperPhone.trim()) {
      toast.error("Vui lòng nhập tên và số điện thoại shipper");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8000/api/admin/orders/${editingShipper.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shipper: shipperName,
            shipper_phone: shipperPhone,
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Failed to update shipper info");
      }

      const updatedOrders = orders.map((o) =>
        o.id === editingShipper.id
          ? { ...o, shipper: shipperName, shipper_phone: shipperPhone }
          : o,
      );
      setOrders(updatedOrders);

      toast.success("Cập nhật thông tin shipper thành công");
      setEditingShipper(null);
      setShipperName("");
      setShipperPhone("");
    } catch (error) {
      console.error("Error updating shipper info:", error);
      toast.error("Có lỗi xảy ra khi cập nhật thông tin shipper");
    }
  };

  const handleDeleteOrder = async (order: any) => {
    if (confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
      try {
        const res = await fetch(
          `http://localhost:8000/api/admin/orders/${order.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (!res.ok) {
          throw new Error("Failed to delete order");
        }

        const filteredOrders = orders.filter((o) => o.id !== order.id);
        setOrders(filteredOrders);

        toast.success("Xóa đơn hàng thành công");
      } catch (error) {
        console.error("Error deleting order:", error);
        toast.error("Có lỗi xảy ra khi xóa đơn hàng");
      }
    }
  };

  const getStatusColor = (status: string) => {
    const colorMap: any = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      shipping: "bg-blue-100 text-blue-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const labelMap: any = {
      pending: "Chờ Xử Lý",
      paid: "Đã Thanh Toán",
      shipping: "Đang Vận Chuyển",
      delivered: "Đã Giao",
      cancelled: "Đã Hủy",
    };
    return labelMap[status] || status;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Quản Lý Đơn Hàng
      </h1>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">Chưa có đơn hàng</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Mã Đơn Hàng</p>
                  <p className="font-bold">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Ngày</p>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                    <p className="font-semibold">
                      {new Date(
                        order.createdAt || order.date,
                      ).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Khách Hàng</p>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1 text-gray-400" />
                    <p className="font-semibold">
                      {order.shippingInfo?.fullName || "—"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tổng Cộng</p>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                    <p className="font-bold text-[#0A3D62] text-xl">
                      {order.total.toLocaleString("vi-VN")} ₫
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-bold mb-3">Các Sản Phẩm trong Đơn Hàng:</h3>
                <div className="space-y-2">
                  {order.items?.map((item: any) => (
                    <div
                      key={item.productId || item.id}
                      className="flex justify-between py-2 bg-gray-50 px-4 rounded-lg"
                    >
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-semibold">
                        {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                  )) || <p className="text-gray-500">Không có sản phẩm</p>}
                </div>
              </div>

              <div className="border-t mt-4 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-bold mb-2">Thông Tin Vận Chuyển:</h4>
                  <p className="text-sm text-gray-600">
                    {order.shippingInfo?.fullName || "—"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.shippingInfo?.phone || "—"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.shippingInfo?.address || "—"}
                  </p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Thanh Toán & Giao Hàng:</h4>
                  <p className="text-sm text-gray-600">
                    Thanh Toán:{" "}
                    {order.paymentMethod === "qr"
                      ? "Mã QR / Chuyển Khoản"
                      : "COD"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Nhân Viên Vận Chuyển: {order.shipper || "—"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Số ĐT Shipper: {order.shipper_phone || "—"}
                  </p>
                  <p className="text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleStatusChange(order)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Sửa Trạng Thái</span>
                  </button>
                  <button
                    onClick={() => handleShipperEdit(order)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Sửa Shipper</span>
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(order)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Hủy</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Status Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl p-8 max-w-md w-full my-8">
            <h2 className="text-2xl font-bold mb-6">
              Cập Nhật Trạng Thái Đơn Hàng
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Mã Đơn Hàng: {editingOrder.id}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Trạng Thái
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                >
                  <option value="pending">Chờ Xử Lý</option>
                  <option value="paid">Đã Thanh Toán</option>
                  <option value="shipping">Đang Vận Chuyển</option>
                  <option value="delivered">Đã Giao</option>
                  <option value="cancelled">Đã Hủy</option>
                </select>
              </div>

              {/* Stock change warning */}
              {getStockChangeInfo(editingOrder.status, newStatus) && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-semibold text-blue-900 mb-2">
                    ⚠️ Ảnh Hưởng Kho Hàng
                  </p>
                  <p className="text-xs text-blue-800 mb-2">
                    {getStockChangeInfo(editingOrder.status, newStatus) ===
                    "sẽ trừ số lượng kho"
                      ? "Sản phẩm sẽ được trừ khỏi kho:"
                      : "Sản phẩm sẽ được trả lại vào kho:"}
                  </p>
                  <ul className="text-xs text-blue-800 space-y-1">
                    {editingOrder.items?.map((item: any) => (
                      <li key={item.productId || item.id}>
                        • {item.name} x{item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setEditingOrder(null)}
                className="flex-1 border-2 border-gray-300 py-2 rounded-lg hover:bg-gray-50"
              >
                Đóng
              </button>
              <button
                onClick={handleSaveStatus}
                className="flex-1 bg-gradient-to-r from-[#0A3D62] to-[#1E90FF] text-white py-2 rounded-lg hover:shadow-lg"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Shipper Modal */}
      {editingShipper && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">
              Cập Nhật Thông Tin Shipper
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Mã Đơn Hàng: {editingShipper.id}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Tên Shipper
                </label>
                <input
                  type="text"
                  value={shipperName}
                  onChange={(e) => setShipperName(e.target.value)}
                  placeholder="Nhập tên shipper"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Số Điện Thoại Shipper
                </label>
                <input
                  type="tel"
                  value={shipperPhone}
                  onChange={(e) => setShipperPhone(e.target.value)}
                  placeholder="Nhập số điện thoại"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                />
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => {
                  setEditingShipper(null);
                  setShipperName("");
                  setShipperPhone("");
                }}
                className="flex-1 border-2 border-gray-300 py-2 rounded-lg hover:bg-gray-50"
              >
                Đóng
              </button>
              <button
                onClick={handleSaveShipper}
                className="flex-1 bg-gradient-to-r from-[#0A3D62] to-[#1E90FF] text-white py-2 rounded-lg hover:shadow-lg"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { apiClient } from "../../utils/apiClient";
import {
  CreditCard,
  Banknote,
  Package,
  MapPin,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

type Step = "cart" | "payment" | "shipping" | "confirmation";
type PaymentMethod = "qr" | "cod";

export function CheckoutPage() {
  const [step, setStep] = useState<Step>("cart");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("qr");
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  const { cart, cartTotal, clearCart } = useCart();
  const { user, isLoading, accessToken } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E90FF] mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  const validateShipping = () => {
    const newErrors = { fullName: "", phone: "", address: "" };
    let isValid = true;

    if (!shippingInfo.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập tên đầy đủ";
      isValid = false;
    }
    if (!shippingInfo.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
      isValid = false;
    }
    if (!shippingInfo.address.trim()) {
      newErrors.address = "Vui lòng nhập địa chỉ";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePlaceOrder = async () => {
    if (!validateShipping()) return;

    try {
      const data = await apiClient.post("/checkout/", {
        cart: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        shippingInfo,
        paymentMethod,
      });

      clearCart();
      toast.success("Đơn hàng đã được đặt thành công!");
      navigate("/order-success");
    } catch (error: any) {
      console.error("Order error:", error);
      toast.error(error.message || "Lỗi hệ thống, vui lòng thử lại");
    }
  };

  const steps = [
    { id: "cart", name: "Kiểm Tra Giỏ Hàng", icon: Package },
    { id: "payment", name: "Thanh Toán", icon: CreditCard },
    { id: "shipping", name: "Vận Chuyển", icon: MapPin },
    { id: "confirmation", name: "Xác Nhận", icon: CheckCircle },
  ];

  return (
    <div className="min-h-[calc(100vh-20rem)] py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Thanh Toán</h1>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isActive = s.id === step;
              const isCompleted = steps.findIndex((st) => st.id === step) > idx;

              return (
                <div key={s.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-[#0A3D62] to-[#1E90FF] text-white scale-110"
                          : isCompleted
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <p
                      className={`mt-2 text-sm font-semibold ${isActive ? "text-[#0A3D62]" : "text-gray-500"}`}
                    >
                      {s.name}
                    </p>
                  </div>
                  {idx < steps.length - 1 && (
                    <ChevronRight className="w-6 h-6 text-gray-300 mx-2" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step 1: Cart Review */}
          {step === "cart" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">
                Kiểm Tra Đơn Hàng Của Bạn
              </h2>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 border-b pb-4"
                  >
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        Số lượng: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-[#0A3D62]">
                      {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-2xl font-bold">
                  <span>Tổng Cộng:</span>
                  <span className="text-[#0A3D62]">
                    {cartTotal.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              </div>
              <button
                onClick={() => setStep("payment")}
                className="w-full bg-gradient-to-r from-[#0A3D62] to-[#1E90FF] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Tiếp Tục Thanh Toán
              </button>
            </div>
          )}

          {/* Step 2: Payment Method */}
          {step === "payment" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">
                Chọn Phương Thức Thanh Toán
              </h2>
              <div className="space-y-4 mb-8">
                <div
                  onClick={() => setPaymentMethod("qr")}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                    paymentMethod === "qr"
                      ? "border-[#1E90FF] bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <CreditCard className="w-8 h-8 text-[#1E90FF]" />
                    <div>
                      <h3 className="font-bold">Mã QR / Chuyển Khoản</h3>
                      <p className="text-sm text-gray-600">
                        Thanh toán qua chuyển khoản ngân hàng
                      </p>
                    </div>
                  </div>
                  {paymentMethod === "qr" && (
                    <div className="mt-4 p-4 bg-white rounded-lg border">
                      <p className="text-sm text-gray-600 mb-2">
                        Quét mã QR để thanh toán:
                      </p>
                      <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                        <p className="text-gray-400">[Mã QR Tạm Thời]</p>
                      </div>
                    </div>
                  )}
                </div>

                <div
                  onClick={() => setPaymentMethod("cod")}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-[#1E90FF] bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <Banknote className="w-8 h-8 text-[#1E90FF]" />
                    <div>
                      <h3 className="font-bold">Trả Tiền Khi Nhận</h3>
                      <p className="text-sm text-gray-600">
                        Thanh toán khi nhận hàng
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setStep("cart")}
                  className="flex-1 border-2 border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  Quay Lại
                </button>
                <button
                  onClick={() => setStep("shipping")}
                  className="flex-1 bg-gradient-to-r from-[#0A3D62] to-[#1E90FF] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Tiếp Tục Vận Chuyển
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Shipping Information */}
          {step === "shipping" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Thông Tin Vận Chuyển</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Tên Đầy Đủ
                  </label>
                  <input
                    value={shippingInfo.fullName}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        fullName: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.fullName
                        ? "border-red-500 focus:ring-red-500"
                        : "focus:ring-[#1E90FF]"
                    }`}
                    placeholder="Nguyễn Văn A"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.fullName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Số Điện Thoại
                  </label>
                  <input
                    value={shippingInfo.phone}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        phone: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.phone
                        ? "border-red-500 focus:ring-red-500"
                        : "focus:ring-[#1E90FF]"
                    }`}
                    placeholder="0123 456 789"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Địa Chỉ Giao Hàng
                  </label>
                  <textarea
                    value={shippingInfo.address}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        address: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.address
                        ? "border-red-500 focus:ring-red-500"
                        : "focus:ring-[#1E90FF]"
                    }`}
                    rows={3}
                    placeholder="123 Phố Bếp, Quận 1, Hồ Chí Minh, Việt Nam"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setStep("payment")}
                  className="flex-1 border-2 border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  Quay Lại
                </button>
                <button
                  onClick={() => {
                    if (validateShipping()) setStep("confirmation");
                  }}
                  className="flex-1 bg-gradient-to-r from-[#0A3D62] to-[#1E90FF] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Tiếp Tục Xác Nhận
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === "confirmation" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Xác Nhận Đơn Hàng</h2>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-bold mb-3">Tóm Tắt Đơn Hàng</h3>
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between py-2">
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-semibold">
                        {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                  ))}
                  <div className="border-t mt-3 pt-3 flex justify-between text-xl font-bold">
                    <span>Tổng Cộng:</span>
                    <span className="text-[#0A3D62]">
                      {cartTotal.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-bold mb-3">Phương Thức Thanh Toán</h3>
                  <p>
                    {paymentMethod === "qr"
                      ? "Mã QR / Chuyển Khoản"
                      : "Trả Tiền Khi Nhận"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-bold mb-3">Thông Tin Vận Chuyển</h3>
                  <p>
                    <strong>Tên:</strong> {shippingInfo.fullName}
                  </p>
                  <p>
                    <strong>Điện thoại:</strong> {shippingInfo.phone}
                  </p>
                  <p>
                    <strong>Địa chỉ:</strong> {shippingInfo.address}
                  </p>
                </div>
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  onClick={() => setStep("shipping")}
                  className="flex-1 border-2 border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  Quay Lại
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="flex-1 bg-gradient-to-r from-[#0A3D62] to-[#1E90FF] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Đặt Hàng
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

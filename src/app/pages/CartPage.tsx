import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

export function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Giỏ hàng của bạn trống');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center py-20 px-4">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Giỏ hàng của bạn trống</h2>
          <p className="text-gray-600 mb-8">Bắt đầu mua sắm để thêm hàng vào giỏ của bạn</p>
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-[#0A3D62] to-[#1E90FF] text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Tiếp Tục Mua Sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-20rem)] py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Giỏ Hàng</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md p-6 flex flex-col sm:flex-row gap-6"
              >
                <div className="w-full sm:w-32 h-32 flex-shrink-0">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                    <button
                      onClick={() => {
                        removeFromCart(item.id);
                        toast.success('Sản phẩm đã bị xóa khỏi giỏ hàng');
                      }}
                      className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-semibold text-lg w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#0A3D62]">
                        {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                      </p>
                      <p className="text-sm text-gray-500">{item.price.toLocaleString('vi-VN')} ₫ / cái</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tóm Tắt Đơn Hàng</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Tổng Cộng</span>
                  <span>{cartTotal.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Vận Chuyển</span>
                  <span className="text-green-600">Miễn Phí</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-xl font-bold text-gray-900">
                  <span>Tổng Cộng</span>
                  <span className="text-[#0A3D62]">{cartTotal.toLocaleString('vi-VN')} ₫</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-[#0A3D62] to-[#1E90FF] text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 mb-4"
              >
                Tiến Hành Thanh Toán
              </button>

              <Link
                to="/"
                className="block w-full text-center text-[#1E90FF] hover:text-[#0A3D62] font-semibold transition-colors"
              >
                Tiếp Tục Mua Sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

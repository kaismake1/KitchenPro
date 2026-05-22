import { Link } from 'react-router';
import { CheckCircle } from 'lucide-react';

export function OrderSuccessPage() {
  return (
    <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center py-20 px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <CheckCircle className="w-24 h-24 mx-auto text-green-500" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Đơn Hàng Đã Được Đặt Thành Công!</h1>
        <p className="text-gray-600 mb-8">
          Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/orders"
            className="bg-gradient-to-r from-[#0A3D62] to-[#1E90FF] text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Xem Đơn Hàng
          </Link>
          <Link
            to="/"
            className="border-2 border-[#1E90FF] text-[#1E90FF] px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all"
          >
            Tiếp Tục Mua Sắm
          </Link>
        </div>
      </div>
    </div>
  );
}

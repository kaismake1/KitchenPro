import { Link } from 'react-router';
import { Home } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-300">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Trang Không Được Tìm Thấy</h2>
        <p className="text-gray-600 mb-8">Trang bạn tìm kiếm không tồn tại.</p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#0A3D62] to-[#1E90FF] text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          <Home className="w-5 h-5" />
          <span>Về Trang Chủ</span>
        </Link>
      </div>
    </div>
  );
}

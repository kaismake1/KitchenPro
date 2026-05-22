import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { LayoutDashboard, Users, Package, ShoppingBag, LogOut, Home } from 'lucide-react';
import { Toaster } from 'sonner';

export function AdminLayout() {
  const { user, isAdmin, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Wait for auth context to load before checking auth status
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/login');
    }
  }, [user, isAdmin, navigate, isLoading]);

  // Show loading state while auth context is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E90FF] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Bảng Điều Khiển' },
    { path: '/admin/users', icon: Users, label: 'Quản Lý Người Dùng' },
    { path: '/admin/products', icon: Package, label: 'Quản Lý Sản Phẩm' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'Quản Lý Đơn Hàng' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-[#0A3D62] to-[#083049] text-white flex-shrink-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-[#1E90FF] bg-clip-text text-transparent">
            Trang quản trị
          </h1>
          <p className="text-sm text-gray-300 mt-1">KitchenPro</p>
        </div>

        <nav className="px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-[#1E90FF] shadow-lg'
                    : 'hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-3 mt-4 border-t border-white/10">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors duration-200 text-white"
          >
            <Home className="w-5 h-5" />
            <span>Quay về cửa hàng</span>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </div>

      <Toaster position="top-right" richColors />
    </div>
  );
}

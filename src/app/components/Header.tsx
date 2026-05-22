import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  History,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="w-full">
        <div className="flex items-center justify-between h-24 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 -ml-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-[#0A3D62] to-[#1E90FF] bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              KitchenPro
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 mx-auto">
            <a
              href="/#home"
              className="text-gray-700 hover:text-[#0A3D62] transition-colors duration-200"
            >
              Trang Chủ
            </a>
            <a
              href="/#products"
              className="text-gray-700 hover:text-[#0A3D62] transition-colors duration-200"
            >
              Sản Phẩm
            </a>
            {/* <a
              href="/#categories"
              className="text-gray-700 hover:text-[#0A3D62] transition-colors duration-200"
            >
              Danh Mục
            </a> */}
            <a
              href="/#about"
              className="text-gray-700 hover:text-[#0A3D62] transition-colors duration-200"
            >
              Giới Thiệu
            </a>
            <a
              href="/#contact"
              className="text-gray-700 hover:text-[#0A3D62] transition-colors duration-200"
            >
              Liên Hệ
            </a>
            {isAdmin && (
              <Link
                to="/admin"
                className="text-[#1E90FF] hover:text-[#0A3D62] transition-colors duration-200 font-semibold"
              >
                Quản Trị
              </Link>
            )}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              to="/cart"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 relative"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#1E90FF] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 flex items-center space-x-2"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-[#0A3D62] to-[#1E90FF] rounded-full flex items-center justify-center text-white">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="font-semibold text-gray-900">
                        {user.username}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      to="/orders"
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <History className="w-4 h-4" />
                      <span>Lịch Sử Đơn Hàng</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Bảng Điều Khiển Quản Trị</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors duration-200 w-full text-left text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng Xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <User className="w-6 h-6 text-gray-700" />
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <a
                href="/#home"
                className="text-gray-700 hover:text-[#0A3D62] transition-colors duration-200"
              >
                Trang Chủ
              </a>
              <a
                href="/#products"
                className="text-gray-700 hover:text-[#0A3D62] transition-colors duration-200"
              >
                Sản Phẩm
              </a>
              {/* <a
                href="/#categories"
                className="text-gray-700 hover:text-[#0A3D62] transition-colors duration-200"
              >
                Danh Mục
              </a> */}
              <a
                href="/#about"
                className="text-gray-700 hover:text-[#0A3D62] transition-colors duration-200"
              >
                Giới Thiệu
              </a>
              <a
                href="/#contact"
                className="text-gray-700 hover:text-[#0A3D62] transition-colors duration-200"
              >
                Liên Hệ
              </a>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-[#1E90FF] hover:text-[#0A3D62] transition-colors duration-200 font-semibold"
                >
                  Bảng Điều Khiển
                </Link>
              )}
              <div className="relative pt-2">
                <input
                  type="text"
                  placeholder="Tìm kiếm thiết bị..."
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                />
                <Search className="absolute left-3 top-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

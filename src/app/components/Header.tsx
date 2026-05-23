import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  History,
  Settings,
  Edit,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    email: "",
    fullname: "",
    phone: "",
    address: "",
  });
  const { user, logout, isAdmin, isShipper, updateUserProfile } = useAuth();

  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  const handleEditProfile = () => {
    if (user) {
      setProfileForm({
        email: user.email || "",
        fullname: user.fullname || "",
        phone: user.phone || "",
        address: user.address || "",
      });
      setEditingProfile(true);
    }
  };

  const handleSaveProfile = async () => {
    if (editingProfile && user && updateUserProfile) {
      try {
        // Try to update via backend
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
          const res = await fetch("http://localhost:8000/api/auth/profile", {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: profileForm.email,
              fullname: profileForm.fullname,
              phone: profileForm.phone,
              address: profileForm.address,
            }),
          });

          if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail || "Lỗi khi cập nhật thông tin");
          }
        }

        // Update local context
        updateUserProfile({
          email: profileForm.email,
          fullname: profileForm.fullname,
          phone: profileForm.phone,
          address: profileForm.address,
        });

        // Update localStorage currentUser if it exists
        const savedUser = JSON.parse(
          localStorage.getItem("currentUser") || "{}",
        );
        if (Object.keys(savedUser).length > 0) {
          localStorage.setItem(
            "currentUser",
            JSON.stringify({
              ...savedUser,
              email: profileForm.email,
              fullname: profileForm.fullname,
              phone: profileForm.phone,
              address: profileForm.address,
            }),
          );
        }

        setEditingProfile(false);
        toast.success("Cập nhật thông tin tài khoản thành công");
      } catch (err) {
        console.error("Error updating profile:", err);
        toast.error(
          err instanceof Error
            ? err.message
            : "Có lỗi xảy ra khi cập nhật thông tin",
        );
      }
    }
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
            {isShipper && (
              <Link
                to="/shipper"
                className="text-[#1E90FF] hover:text-[#0A3D62] transition-colors duration-200 font-semibold"
              >
                Đơn Hàng Cần Giao
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
                    <button
                      onClick={() => {
                        handleEditProfile();
                        setUserMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors duration-200 w-full text-left"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Chỉnh Sửa Tài Khoản</span>
                    </button>
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

      {/* Edit Profile Modal */}
      {editingProfile && user && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Chỉnh Sửa Tài Khoản</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Email
                </label>
                <input
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, email: e.target.value })
                  }
                  placeholder="Nhập email"
                  type="email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Tên Đầy Đủ
                </label>
                <input
                  value={profileForm.fullname}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, fullname: e.target.value })
                  }
                  placeholder="Nhập tên đầy đủ"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Số Điện Thoại
                </label>
                <input
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, phone: e.target.value })
                  }
                  placeholder="Nhập số điện thoại"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Địa Chỉ
                </label>
                <textarea
                  value={profileForm.address}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, address: e.target.value })
                  }
                  placeholder="Nhập địa chỉ"
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                />
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setEditingProfile(false)}
                className="flex-1 border-2 border-gray-300 py-2 rounded-lg hover:bg-gray-50"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex-1 bg-gradient-to-r from-[#0A3D62] to-[#1E90FF] text-white py-2 rounded-lg hover:shadow-lg"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

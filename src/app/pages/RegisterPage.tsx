import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { Lock, Mail, User, Eye, EyeOff, Phone, MapPin } from "lucide-react";

export function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullname: "",
    phone: "",
    address: "",
  });

  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      fullname: "",
      phone: "",
      address: "",
    };
    let isValid = true;

    if (!username.trim()) {
      newErrors.username = "Tên người dùng là bắt buộc";
      isValid = false;
    } else if (username.length < 3) {
      newErrors.username = "Tên người dùng phải có ít nhất 3 ký tự";
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Email là bắt buộc";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Định dạng email không hợp lệ";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Mật khẩu là bắt buộc";
      isValid = false;
    } else if (password.length < 3) {
      newErrors.password = "Mật khẩu phải có ít nhất 3 ký tự";
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không đúng";
      isValid = false;
    }

    if (!fullname.trim()) {
      newErrors.fullname = "Tên đầy đủ là bắt buộc";
      isValid = false;
    }

    if (!phone.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc";
      isValid = false;
    } else if (!/^\d{9,}$/.test(phone.replace(/\s+/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ";
      isValid = false;
    }

    if (!address.trim()) {
      newErrors.address = "Địa chỉ là bắt buộc";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const result = await register(
        username,
        email,
        password,
        fullname,
        phone,
        address,
      );

      if (result.success) {
        toast.success("Tài khoản đã được tạo thành công!");
        navigate("/");
      } else {
        toast.error("Tên người dùng đã tồn tại");
        setErrors({
          ...errors,
          username: "Tên người dùng đã được sử dụng",
        });
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#0A3D62] to-[#1E90FF] bg-clip-text text-transparent">
              Tạo Tài Khoản
            </h2>
            <p className="text-gray-600 mt-2">Tham gia KitchenPro hôm nay</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Tên Người Dùng
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrors({ ...errors, username: "" });
                  }}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.username
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#1E90FF]"
                  }`}
                  placeholder="Chọn tên người dùng"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({ ...errors, email: "" });
                  }}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#1E90FF]"
                  }`}
                  placeholder="Nhập email của bạn"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Fullname Field */}
            <div>
              <label
                htmlFor="fullname"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Tên Đầy Đủ
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="fullname"
                  type="text"
                  value={fullname}
                  onChange={(e) => {
                    setFullname(e.target.value);
                    setErrors({ ...errors, fullname: "" });
                  }}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.fullname
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#1E90FF]"
                  }`}
                  placeholder="Nhập tên đầy đủ của bạn"
                />
              </div>
              {errors.fullname && (
                <p className="mt-1 text-sm text-red-600">{errors.fullname}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Số Điện Thoại
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setErrors({ ...errors, phone: "" });
                  }}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.phone
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#1E90FF]"
                  }`}
                  placeholder="Nhập số điện thoại"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Address Field */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Địa Chỉ
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setErrors({ ...errors, address: "" });
                  }}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.address
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#1E90FF]"
                  }`}
                  placeholder="Nhập địa chỉ của bạn"
                />
              </div>
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Mật Khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, password: "" });
                  }}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#1E90FF]"
                  }`}
                  placeholder="Tạo mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Xác Nhận Mật Khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors({ ...errors, confirmPassword: "" });
                  }}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#1E90FF]"
                  }`}
                  placeholder="Xác nhận mật khẩu của bạn"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-[#0A3D62] to-[#1E90FF] text-white py-3 rounded-lg font-semibold transition-all duration-300 transform ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-lg hover:scale-105"
              }`}
            >
              {loading ? "Đang tạo tài khoản..." : "Tạo Tài Khoản"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="text-[#1E90FF] hover:text-[#0A3D62] font-semibold transition-colors"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

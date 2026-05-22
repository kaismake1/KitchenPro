import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ username: "", password: "" });

  const { login, user } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = { username: "", password: "" };
    let isValid = true;

    if (!username.trim()) {
      newErrors.username = "Tên người dùng là bắt buộc";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Mật khẩu là bắt buộc";
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
      const success = await login(username, password);

      if (success) {
        toast.success("Đăng nhập thành công!");
        // Redirect based on role
        if (user?.role === "admin") {
          navigate("/admin");
        } else if (user?.role === "shipper") {
          navigate("/shipper");
        } else {
          navigate("/");
        }
      } else {
        toast.error("Tên người dùng hoặc mật khẩu không hợp lệ");
        setErrors({
          username: "Thông tin đăng nhập không hợp lệ",
          password: "Thông tin đăng nhập không hợp lệ",
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
              Chào Mừng Quay Lại
            </h2>
            <p className="text-gray-600 mt-2">
              Đăng nhập vào tài khoản của bạn
            </p>
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
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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
                  placeholder="Nhập tên người dùng của bạn"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
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
                  placeholder="Nhập mật khẩu của bạn"
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
              {loading ? "Đắng đăng nhập..." : "Đăng Nhập"}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-semibold text-blue-900 mb-2">
              Thông Tin Đăng Nhập Demo:
            </p>
            <p className="text-sm text-blue-700">
              Quản Trị - Tên người dùng: <strong>admin</strong>, Mật khẩu:{" "}
              <strong>123</strong>
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Hoặc tạo tài khoản mới dưới đây
            </p>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="text-[#1E90FF] hover:text-[#0A3D62] font-semibold transition-colors"
              >
                Đăng ký
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

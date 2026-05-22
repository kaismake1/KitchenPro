import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export function Footer() {
  return (
    <footer
      id="contact"
      className="bg-gradient-to-b from-[#0A3D62] to-[#083049] text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-[#1E90FF] bg-clip-text text-transparent mb-4">
              KitchenPro
            </h3>
            <p className="text-gray-300 mb-6">
              Các thiết bị bếp cao cấp cho ngôi nhà hiện đại. Chất lượng bạn có
              thể tin tưởng.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#1E90FF] transition-colors duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#1E90FF] transition-colors duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#1E90FF] transition-colors duration-300"
              >
                <Twitter className="w-5 h-5" />
              </a>
              {/* <a
                href="https://www.linkedin.com/"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#1E90FF] transition-colors duration-300"
              >
                <Linkedin className="w-5 h-5" />
              </a> */}
            </div>
          </div>

          {/* Quick Links */}
          {/* <div>
            <h4 className="text-xl font-bold mb-4">Liên Kết Nhanh</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Giới Thiệu
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Sản Phẩm
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Danh Mục
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Bảo Hành
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Hỗ Trợ
                </a>
              </li>
            </ul>
          </div> */}

          {/* Support
          <div>
            <h4 className="text-xl font-bold mb-4">Hỗ Trợ</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Câu Hỏi Thường Gặp
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Thông Tin Giao Hàng
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Trả Lại
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                ></a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Điều Khoản Dịch Vụ
                </a>
              </li>
            </ul>
          </div> */}

          {/* Contact */}
          <div>
            <h4 className="text-xl font-bold mb-4">Liên Hệ Với Chúng Tôi</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                <span className="text-gray-300">
                  123 Đường Bepsen, Thành Phố Hồ Chí Minh, Việt Nam
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span className="text-gray-300">+84 123 456 7890</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span className="text-gray-300">info@kitchenpro.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter 
        <div className="border-t border-white/20 pt-8 mb-8">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-xl font-bold mb-4">Theo Dõi Bảng Tin Nhập</h4>
            <p className="text-gray-300 mb-4">
              Nhận các cập nhật mới nhất về sản phẩm và khuyến mãi
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
              />
              <button className="bg-[#1E90FF] text-white px-8 py-3 rounded-xl hover:bg-[#1E90FF]/90 transition-colors duration-300">
                Đăng Ký
              </button>
            </div>
          </div>
        </div>
*/}
        {/* Copyright */}
        <div className="border-t border-white/20 pt-8 text-center text-gray-400">
          <p>&copy; 2026 KitchenPro. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}

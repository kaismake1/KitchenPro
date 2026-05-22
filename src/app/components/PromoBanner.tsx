import { Tag, Clock } from 'lucide-react';

export function PromoBanner() {
  return (
    <section className="py-20 bg-gradient-to-r from-[#0A3D62] to-[#1E90FF] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* <div>
            <div className="flex items-center space-x-2 mb-4">
              <Tag className="w-6 h-6" />
              <span className="text-sm uppercase tracking-wider">Ưu Đãi Giới Hạn Thời Gian</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Tiết Kiệm Đến 30% Cho Thiết Bị Thông Minh
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Nâng cấp bếp của bạn với bộ sưu tập mới nhất của chúng tôi với các thiết bị thông minh
            </p>
            <button className="bg-white text-[#0A3D62] px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Mua Hàng Khuyến Mại
            </button>
          </div> */}

          {/* <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="flex items-center space-x-3 mb-6">
              <Clock className="w-8 h-8" />
              <h3 className="text-2xl font-bold">Ưu Đãi Kết Thúc Trong:</h3>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[
                { value: '05', label: 'Ngày' },
                { value: '12', label: 'Giờ' },
                { value: '34', label: 'Phút' },
                { value: '56', label: 'Giây' },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-2">
                    <span className="text-3xl font-bold">{item.value}</span>
                  </div>
                  <span className="text-sm opacity-75">{item.label}</span>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}

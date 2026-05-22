import { ImageWithFallback } from './figma/ImageWithFallback';
import { Award, Shield, Zap } from 'lucide-react';

export function About() {
  const features = [
    {
      icon: Award,
      title: 'Chất Lượng Cao Cấp',
      description: 'Được chế tạo với độ chính xác và xây dựng để kéo dài hàng thế hệ',
    },
    {
      icon: Zap,
      title: 'Công Nghệ Thông Minh',
      description: 'Các tính năng thông minh giúp cuộc sống của bạn dễ dàng hơn',
    },
    {
      icon: Shield,
      title: 'Bảo Hành 10 Năm',
      description: 'Bảo vệ toàn diện cho khoản đầu tư của bạn',
    },
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1740803292374-1b167c1558b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwYXBwbGlhbmNlJTIwc3RvcmV8ZW58MXx8fHwxNzc2MjcyMDIxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Premium Kitchen Appliances"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-[#0A3D62] to-[#1E90FF] text-white p-6 rounded-2xl shadow-xl">
              <p className="text-4xl font-bold">25+</p>
              <p className="text-sm">Năm Xuất Sắc</p>
            </div>
          </div>

          {/* Content */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Nâng Cao Trải Nghiệm Bếp Của Bạn
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Chúng tôi tin vào việc tạo ra các thiết bị kết hợp thẩm mỹ thiết kế Scandinavia với công nghệ tiên tiến. Cam kết của chúng tôi về chất lượng và đổi mới đã giúp chúng tôi trở thành một thương hiệu đáng tin cậy trong các nhà bếp hiện đại trên toàn thế giới.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-[#0A3D62] to-[#1E90FF] rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* <button className="mt-8 bg-gradient-to-r from-[#0A3D62] to-[#1E90FF] text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              Tìm Hiểu Thêm Về Chúng Tôi
            </button> */}
          </div>
        </div>
      </div>
    </section>
  );
}

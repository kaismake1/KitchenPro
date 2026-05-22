import { Star, Quote } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Đầu Bếp Tại Nhà',
    image: 'https://images.unsplash.com/photo-1625580353616-c477154bbcb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGN1c3RvbWVyJTIwaG9tZSUyMGtpdGNoZW58ZW58MXx8fHwxNzc2MjcyMDIxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 5,
    text: 'Tủ lạnh thông minh đã hoàn toàn thay đổi bếp của tôi. Thiết kế rất đẹp và công nghệ tuyệt vời. Đây là khoản đầu tư tốt nhất cho nhà tôi!',
  },
  {
    name: 'Michael Chen',
    role: 'Đầu Bếp Chuyên Nghiệp',
    image: 'https://i.pravatar.cc/150?img=12',
    rating: 5,
    text: 'Là một đầu bếp chuyên nghiệp, tôi yêu cầu cái tốt nhất. Những thiết bị này cung cấp hiệu suất và độ tin cậy ngoài thường. Độ chính xác của lò nướng là vô song.',
  },
  {
    name: 'Emma Williams',
    role: 'Nhà Thiết Kế Nội Thất',
    image: 'https://i.pravatar.cc/150?img=45',
    rating: 5,
    text: 'Thẩm mỹ thiết kế Scandinavia hoàn hảo bổ sung cho những căn bếp hiện đại. Các khách hàng của tôi luôn ấn tượng với chất lượng và phong cách.',
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Khách Hàng Nói Gì Về Chúng Tôi</h2>
          <p className="text-gray-600 text-lg">Tham gia hàng ngàn khách hàng hài lòng trên toàn thế giới</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative"
            >
              <Quote className="absolute top-6 right-6 w-12 h-12 text-[#1E90FF] opacity-20" />
              
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                  <ImageWithFallback
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

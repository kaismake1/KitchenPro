import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Hero() {
  return (
    <section
      id="home"
      className="relative h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1756906838843-c80118e2416e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwaW50ZXJpb3IlMjBibHVlfGVufDF8fHx8MTc3NjI3MjAxN3ww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Modern Kitchen"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A3D62]/80 to-[#1E90FF]/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
          Giải Pháp Bếp Hiện Đại
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          Các thiết bị bếp cao cấp cho mọi nhà
        </p>
        <a
          href="/#products"
          className="inline-block bg-white text-[#0A3D62] px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Mua Ngay
        </a>
      </div>
    </section>
  );
}

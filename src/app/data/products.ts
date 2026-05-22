export interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  badge: string | null;
  description: string;
  status: "in-stock" | "out-of-stock" | "coming-soon";
  stock: number;
}

export const initialProducts: Product[] = [
  {
    id: 1,
    name: "Lò Nướng Điện Cao Cấp",
    price: 29999900,
    rating: 4.8,
    reviews: 124,
    image:
      "https://images.unsplash.com/photo-1772567733108-38d940269d86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFpbmxlc3MlMjBzdGVlbCUyMG92ZW58ZW58MXx8fHwxNzc2MjcyMDE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Lò Nướng",
    badge: "Bán Chạy Nhất",
    description:
      "Công nghệ lò nướng vòi điều khiển nhiệt độ độc lập. Tính năng 10 chế độ nấu nướng, chức năng tự làm sạch và thiết kế tiết kiệm năng lượng.",
    status: "in-stock",
    stock: 15,
  },
  {
    id: 2,
    name: "Tủ Lạnh Thông Minh",
    price: 56999800,
    rating: 4.9,
    reviews: 89,
    image:
      "https://images.unsplash.com/photo-1771794980860-38f3291807e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHJlZnJpZ2VyYXRvciUyMG1vZGVybnxlbnwxfHx8fDE3NzYyNzIwMjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Tủ Lạnh",
    badge: "Mới",
    description:
      "Tủ lạnh thông minh hỗ trợ WiFi với màn hình cảm ứng. Các vùng nhiệt độ, camera tích hợp và điều khiển ứng dụng di động.",
    status: "in-stock",
    stock: 8,
  },
  {
    id: 3,
    name: "Máy Rửa Chén Sinh Thái",
    price: 20799900,
    rating: 4.7,
    reviews: 156,
    image:
      "https://images.unsplash.com/photo-1668910225551-1080c3a12241?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFpbmxlc3MlMjBzdGVlbCUyMGRpc2h3YXNoZXJ8ZW58MXx8fHwxNzc2MjcyMDIwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Máy Rửa Chén",
    badge: null,
    description:
      "Máy rửa chén tiết kiệm năng lượng với 6 chương trình rửa. Hoạt động siêu yên tĩnh và hệ thống lọc nước tiên tiến.",
    status: "in-stock",
    stock: 22,
  },
  {
    id: 4,
    name: "Lò Vi Sóng Pro",
    price: 7999900,
    rating: 4.6,
    reviews: 203,
    image:
      "https://images.unsplash.com/photo-1587892106866-e6b362b35449?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWNyb3dhdmUlMjBvdmVuJTIwYXBwbGlhbmNlfGVufDF8fHx8MTc3NjI0MjI0NXww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Lò Vi Sóng",
    badge: null,
    description:
      "Lò vi sóng 1200W với chức năng nướng bằng lò nức. Công nghệ cảm biến thông minh và 15 chương trình nấu nướng được cài sẵn.",
    status: "in-stock",
    stock: 30,
  },
  {
    id: 5,
    name: "Máy Hút Hơi Thiết Kế",
    price: 18499900,
    rating: 4.8,
    reviews: 67,
    image:
      "https://images.unsplash.com/photo-1714358013380-b75b16127007?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHhraXRjaGVuJTIwY29va2VyJTIwaG9vZHxlbnwxfHx8fDE3NzYyNzIwMTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Máy Hút Hơi",
    badge: null,
    description:
      "Thiết kế inox bạc sáng bóng với khả năng hút mạnh. Đèn LED và điều khiển bằng cảm ứng.",
    status: "in-stock",
    stock: 12,
  },
  {
    id: 6,
    name: "Lò Nướng Tích Hợp Deluxe",
    price: 36999900,
    rating: 4.9,
    reviews: 94,
    image:
      "https://images.unsplash.com/photo-1754568401041-11ad5769ed7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMG92ZW4lMjBhcHBsaWFuY2V8ZW58MXx8fHwxNzc2MjcyMDE3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Lò Nướng",
    badge: "Cao Cấp",
    description:
      "Lò nướng tích hợp cấp chuyên nghiệp với hệ thống quạt kép. Nấu với hơi nước và chức năng làm nóng nhanh.",
    status: "in-stock",
    stock: 6,
  },
];

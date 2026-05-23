import { useParams, useNavigate, Link } from "react-router";
import { initialProducts } from "../data/products";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  ShoppingCart,
  Star,
  ArrowLeft,
  Package,
  Shield,
  Truck,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { useState, useEffect } from "react";
const API_URL = "http://localhost:8000/api";
export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(
    initialProducts.find((p) => p.id === Number(id)),
  );
  const [loading, setLoading] = useState(true);
  // Load products from localStorage
  // useEffect(() => {
  //   const savedProducts = localStorage.getItem('products');
  //   if (savedProducts) {
  //     try {
  //       const allProducts = JSON.parse(savedProducts);
  //       const foundProduct = allProducts.find((p: any) => p.id === Number(id));
  //       if (foundProduct) {
  //         setProduct(foundProduct);
  //       }
  //     } catch (error) {
  //       console.error('Failed to load products:', error);
  //     }
  //   }
  // }, [id]);
  useEffect(() => {
    if (id) {
      fetchProducts();
    }
  }, [id]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/products/`);
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await res.json();
      // Map API response to include image field
      const mappedProducts = data.map((p: any) => ({
        ...p,
        image:
          p.image ||
          p.images?.[0]?.image_url ||
          "https://via.placeholder.com/400",
      }));
      const foundProduct = mappedProducts.find((p: any) => p.id === Number(id));
      setProduct(foundProduct);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Không thể tải sản phẩm");
      setProduct(undefined);
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Sản phẩm không tậm thời
          </h2>
          <Link to="/" className="text-[#1E90FF] hover:text-[#0A3D62]">
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thêm mặt hàng vào giỏ hàng");
      navigate("/login");
      return;
    }

    if (product.status !== "in-stock") {
      toast.error("Sản phẩm này không có sẵn");
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    toast.success(`${product.name} đã được thêm vào giỏ hàng!`);
  };

  return (
    <div className="min-h-[calc(100vh-20rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-[#1E90FF] hover:text-[#0A3D62] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay Lại Sản Phẩm</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.badge && (
              <span className="absolute top-4 left-4 bg-[#1E90FF] text-white px-4 py-2 rounded-full text-sm font-semibold">
                {product.badge}
              </span>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">{product.category}</p>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  {product.rating} ({product.reviews} đánh giá)
                </span>
              </div> */}

              <div className="mb-6">
                <span className="text-4xl font-bold text-[#0A3D62]">
                  {product.price.toLocaleString("vi-VN")} ₫
                </span>
                <p
                  className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    product.status === "in-stock"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.status === "in-stock"
                    ? `Còn Hàng (${product.stock} có sẵn)`
                    : "Hết Hàng"}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mô Tả</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.status !== "in-stock"}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform flex items-center justify-center space-x-2 ${
                product.status === "in-stock"
                  ? "bg-gradient-to-r from-[#0A3D62] to-[#1E90FF] text-white hover:shadow-xl hover:scale-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <ShoppingCart className="w-6 h-6" />
              <span>
                {product.status === "in-stock"
                  ? "Thêm Vào Giỏ Hàng"
                  : "Hết Hàng"}
              </span>
            </button>

            {/* Features */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Truck className="w-8 h-8 mx-auto text-[#1E90FF] mb-2" />
                <p className="text-sm font-semibold">Giao Hàng Miễn Phí</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Shield className="w-8 h-8 mx-auto text-[#1E90FF] mb-2" />
                <p className="text-sm font-semibold">Bảo Hành 10 Năm</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Package className="w-8 h-8 mx-auto text-[#1E90FF] mb-2" />
                <p className="text-sm font-semibold">1 Đổi 1 Trong 30 Ngày</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

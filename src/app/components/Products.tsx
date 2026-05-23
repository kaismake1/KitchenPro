import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  ShoppingCart,
  Star,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const API_URL = "http://localhost:8000/api";

const filters = [
  "Tất Cả",
  "Lò Nướng",
  "Tủ Lạnh",
  "Máy Rửa Chén",
  "Lò Vi Sóng",
  "Máy Hút Hơi",
];
const ITEMS_PER_PAGE = 6;

interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  category: string;
  badge: string | null;
  description: string;
  status: "in-stock" | "out-of-stock";
  stock: number;
  images?: Array<{ image_url: string; is_primary: boolean }>;
}

interface ProductsProps {
  selectedCategory?: string;
  onFilterChange?: (filter: string) => void;
}

export function Products({
  selectedCategory: controlledFilter,
  onFilterChange,
}: ProductsProps) {
  const [selectedFilter, setSelectedFilter] = useState("Tất Cả");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch products from backend API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products/`);
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Không thể tải sản phẩm");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const activeFilter = controlledFilter ?? selectedFilter;

  const filteredProducts =
    activeFilter === "Tất Cả"
      ? products
      : products.filter((product) => product.category === activeFilter);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleFilterChange = (filter: string) => {
    if (onFilterChange) {
      onFilterChange(filter);
    } else {
      setSelectedFilter(filter);
    }
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  const getImageUrl = (product: Product): string => {
    return (
      product.images?.[0]?.image_url ||
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
    );
  };

  const handleAddToCart = (product: Product) => {
    if (product.status !== "in-stock") {
      toast.error("Sản phẩm này không khả dụng");
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: getImageUrl(product),
      category: product.category,
    });
    toast.success(`${product.name} đã được thêm vào giỏ hàng!`);
  };

  if (loading) {
    return (
      <section id="products" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E90FF] mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Sản Phẩm Của Chúng Tôi
          </h2>
          <p className="text-gray-600 text-lg">
            Khám phá các thiết bị bếp chất lượng cao cho nhà bếp của bạn
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                selectedFilter === filter
                  ? "bg-gradient-to-r from-[#0A3D62] to-[#1E90FF] text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative aspect-square overflow-hidden">
                <ImageWithFallback
                  src={getImageUrl(product)}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-[#1E90FF] text-white px-3 py-1 rounded-full text-sm">
                    {product.badge}
                  </span>
                )}
                {product.status !== "in-stock" && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-white px-4 py-2 rounded-lg font-semibold">
                      {product.status === "out-of-stock"
                        ? "Hết Hàng"
                        : "Sắp Ra Mắt"}
                    </span>
                  </div>
                )}
                <Link
                  to={`/product/${product.id}`}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-100"
                >
                  <Eye className="w-5 h-5 text-gray-700" />
                </Link>
              </div>

              <div className="p-6">
                <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>

                {/* <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm font-semibold text-gray-700">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 ml-2">
                    ({product.reviews} đánh giá)
                  </span>
                </div> */}

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#0A3D62]">
                    {product.price.toLocaleString("vi-VN")} ₫
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.status !== "in-stock"}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 ${
                      product.status === "in-stock"
                        ? "bg-gradient-to-r from-[#0A3D62] to-[#1E90FF] text-white hover:shadow-lg"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Thêm</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                      currentPage === page
                        ? "bg-gradient-to-r from-[#0A3D62] to-[#1E90FF] text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

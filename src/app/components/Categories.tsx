import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CATEGORIES_PER_PAGE = 6;

const categories = [
  {
    name: "Lò Nướng",
    image:
      "https://cdn.mediamart.vn/images/product/lo-nuong-dien-roler-reo-3313-30l_67ec5a8f.png",
    count: "",
  },
  {
    name: "Tủ Lạnh",
    image:
      "https://cdn.tgdd.vn/Files/2017/09/27/1025134/nhung-kieu-tu-lanh-thong-dung-nhat-hien-nay-5.jpg",
    count: "",
  },
  {
    name: "Máy Rửa Chén",
    image:
      "https://images.unsplash.com/photo-1758631130778-42d518bf13aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXNod2FzaGVyJTIwYXBwbGlhbmNlfGVufDF8fHx8MTc3NjI3MjAxOHww&ixlib=rb-4.1.0&q=80&w=1080",
    count: "",
  },
  {
    name: "Lò Vi Sóng",
    image: "https://cdn.mediamart.vn/images/product/-iX87sP.jpg",
    count: "",
  },
  {
    name: "Máy Hút Hơi",
    image:
      "https://images.unsplash.com/photo-1714358013380-b75b16127007?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHhraXRjaGVuJTIwY29va2VyJTIwaG9vZHxlbnwxfHx8fDE3NzYyNzIwMTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    count: "",
  },
  {
    name: "Thiết Bị Thông Minh",
    image:
      "https://images.unsplash.com/photo-1771371600769-051e03e354d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwa2l0Y2hlbiUyMGFwcGxpYW5jZXMlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3NjI3MjAyMXww&ixlib=rb-4.1.0&q=80&w=1080",
    count: "",
  },
];

interface CategoriesProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function Categories({
  selectedCategory,
  onSelectCategory,
}: CategoriesProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(categories.length / CATEGORIES_PER_PAGE);
  const paginatedCategories = categories.slice(
    (currentPage - 1) * CATEGORIES_PER_PAGE,
    currentPage * CATEGORIES_PER_PAGE,
  );

  const handleCategoryClick = (categoryName: string) => {
    onSelectCategory(categoryName);
    document
      .getElementById("products")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="categories" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Danh Mục Nổi Bật
          </h2>
          <p className="text-gray-600 text-lg">
            Khám phá công dùng bếp cão cấp của chúng tôi
          </p>
        </div> */}

        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedCategories.map((category, index) => (
            <div
              key={index}
              role="button"
              tabIndex={0}
              onClick={() => handleCategoryClick(category.name)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleCategoryClick(category.name);
                }
              }}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                selectedCategory === category.name
                  ? "ring-2 ring-[#1E90FF]"
                  : ""
              }`}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A3D62]/90 via-[#0A3D62]/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
                <p className="text-gray-200">{category.count}</p>
              </div>
            </div>
          ))}
        </div> */}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Trước Đó</span>
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
                        : "bg-gray-300 hover:bg-gray-400 text-gray-800"
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
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

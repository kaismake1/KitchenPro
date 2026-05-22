import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { initialProducts, type Product } from '../../data/products';
import { useParams } from "react-router";
const ITEMS_PER_PAGE = 6;
const API_URL = "http://localhost:8000/api";

export function ManageProducts() {
  const [product, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Lò Nướng',
    status: 'in-stock' as 'in-stock' | 'out-of-stock' | 'coming-soon',
    image: '',
    stock: '',
  });

  // Load products from localStorage on mount
  // useEffect(() => {
  //   const savedProducts = localStorage.getItem('products');
  //   if (savedProducts) {
  //     try {
  //       setProducts(JSON.parse(savedProducts));
  //     } catch (error) {
  //       console.error('Failed to load products:', error);
  //       setProducts(initialProducts);
  //       localStorage.setItem('products', JSON.stringify(initialProducts));
  //     }
  //   } else {
  //     setProducts(initialProducts);
  //     localStorage.setItem('products', JSON.stringify(initialProducts));
  //   }
  // }, []);
  useEffect(() => {
      fetchProducts();
    }, []);

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
          image: p.image || p.images?.[0]?.image_url || 'https://via.placeholder.com/400',
        }));
        setProducts(mappedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Không thể tải sản phẩm");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
  
  // Removed: Save products to localStorage
  // Using API backend instead
  //   const savedProducts = localStorage.getItem("products");
  //   if (savedProducts) {
  //     try {
  //       const allProducts = JSON.parse(savedProducts);
  //       const foundProduct = allProducts.find((p: any) => p.id === Number(id));
  //       if (foundProduct) {
  //         setProducts(foundProduct);
  //       }
  //     } catch (error) {
  //       console.error("Failed to load products:", error);
  //     }
  //   }
  // }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        // Update existing product
        const updateData = {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          status: formData.status,
          image: formData.image || 'https://via.placeholder.com/400',
          stock: parseInt(formData.stock),
        };
        
        const res = await fetch(`${API_URL}/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData),
        });
        
        if (!res.ok) throw new Error("Failed to update product");
        
        const updated = product.map(p =>
          p.id === editingProduct.id
            ? { ...p, ...updateData }
            : p
        );
        setProducts(updated);
        toast.success('Cập nhật sản phẩm thành công');
      } else {
        // Add new product
        const newProductData = {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          status: formData.status,
          image: formData.image || 'https://via.placeholder.com/400',
          stock: parseInt(formData.stock),
        };
        
        const res = await fetch(`${API_URL}/products/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProductData),
        });
        
        if (!res.ok) throw new Error("Failed to add product");
        const newProduct = await res.json();
        
        setProducts([...product, newProduct]);
        // Reset to last page when adding new product
        const newTotalPages = Math.ceil((product.length + 1) / ITEMS_PER_PAGE);
        setCurrentPage(newTotalPages);
        toast.success('Thêm sản phẩm thành công');
      }
      
      resetForm();
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Lò Nướng',
      status: 'in-stock' as 'in-stock' | 'out-of-stock' | 'coming-soon',
      image: '',
      stock: '',
    });
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      status: product.status,
      image: product.image,
      stock: product.stock.toString(),
    });
    setShowForm(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({...formData, image: reader.result as string});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        const res = await fetch(`${API_URL}/products/${id}`, {
          method: 'DELETE',
        });
        
        if (!res.ok) throw new Error("Failed to delete product");
        
        setProducts(product.filter(p => p.id !== id));
        toast.success('Xóa sản phẩm thành công');
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Có lỗi xảy ra khi xóa sản phẩm");
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Sản Phẩm</h1>
          <p className="text-gray-600 mt-1">Tổng Sản Phẩm: {product.length}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-[#0A3D62] to-[#1E90FF] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Thêm Sản Phẩm</span>
        </button>
      </div>

      {/* Products Grid with Pagination */}
      {product.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product
              .slice(
                (currentPage - 1) * ITEMS_PER_PAGE,
                currentPage * ITEMS_PER_PAGE,
              )
              .map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {product.category}
                    </p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xl font-bold text-[#0A3D62]">
                        {product.price.toLocaleString("vi-VN")} ₫
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          product.status === "in-stock"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.status === "in-stock"
                          ? "Có Hàng"
                          : product.status === "out-of-stock"
                            ? "Hết Hàng"
                            : "Sắp Ra Mắt"}
                      </span>
                    </div>
                    <div className="flex space-x-2 mt-auto">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 flex items-center justify-center space-x-1 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="text-sm">Chỉnh Sửa</span>
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="flex-1 flex items-center justify-center space-x-1 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm">Xóa</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Pagination Controls */}
          {Math.ceil(product.length / ITEMS_PER_PAGE) > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Trước Đó</span>
              </button>

              <div className="flex gap-2">
                {[...Array(Math.ceil(product.length / ITEMS_PER_PAGE))].map(
                  (_, index) => {
                    const page = index + 1;
                    return (
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
                    );
                  },
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(
                      Math.ceil(product.length / ITEMS_PER_PAGE),
                      prev + 1,
                    ),
                  )
                }
                disabled={
                  currentPage === Math.ceil(product.length / ITEMS_PER_PAGE)
                }
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span>Tiếp Theo</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-600 text-lg">
            Chưa có sản phẩm. Thêm sản phẩm đầu tiên của bạn!
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 inline-flex items-center space-x-2 bg-gradient-to-r from-[#0A3D62] to-[#1E90FF] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Thêm Sản Phẩm Đầu Tiên</span>
          </button>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full my-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingProduct ? "Chỉnh Sửa " : "Thêm Sản Phẩm Mới"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-2">
                    Tên Sản Phẩm
                  </label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-2">
                    Mô Tả
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Giá
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Tồn Kho
                  </label>
                  <input
                    required
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Danh Mục
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                  >
                    <option value="Lò Nướng">Lò Nướng</option>
                    <option value="Tủ Lạnh">Tủ Lạnh</option>
                    <option value="Máy Rửa Chén">Máy Rửa Chén</option>
                    <option value="Lò Vi Sóng">Lò Vi Sóng</option>
                    <option value="Máy Hút Hơi">Máy Hút Hơi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Trạng Thái
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                  >
                    <option value="in-stock">Còn Hàng</option>
                    <option value="out-of-stock">Hết Hàng</option>
                    <option value="coming-soon">Sắp Ra Mắt</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-2">
                    Hình Ảnh
                  </label>
                  <div className="flex gap-2 mb-3">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">
                        Tải Lên Từ PC:
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">
                        Hoặc Dán URL:
                      </label>
                      <input
                        value={
                          formData.image && formData.image.startsWith("data:")
                            ? ""
                            : formData.image
                        }
                        onChange={(e) =>
                          setFormData({ ...formData, image: e.target.value })
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  {formData.image && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-2">Xem Trước:</p>
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          const errorDiv = (e.target as HTMLImageElement)
                            .nextElementSibling as HTMLElement;
                          if (errorDiv) errorDiv.style.display = "flex";
                        }}
                      />
                      <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center text-red-600 text-sm hidden">
                        Hình ảnh không tải được
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex space-x-4 mt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 border-2 border-gray-300 py-3 rounded-lg hover:bg-gray-50"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#0A3D62] to-[#1E90FF] text-white py-3 rounded-lg hover:shadow-lg"
                >
                  {editingProduct ? "Cập Nhật" : "Thêm"} Sản Phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

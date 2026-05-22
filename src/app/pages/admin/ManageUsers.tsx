import { useState, useEffect } from "react";
import { Trash2, Edit, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";

export function ManageUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
    phone: "",
    address: "",
  });
  const { accessToken, isAdmin } = useAuth();

  useEffect(() => {
    loadUsers();
  }, [accessToken, isAdmin]);

  const loadUsers = async () => {
    // Try to load from backend
    if (accessToken && isAdmin) {
      try {
        const res = await fetch("http://localhost:8000/api/admin/users", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
          return;
        }
      } catch (err) {
        console.error("Error loading users from backend:", err);
      }
    }

    // Fallback: load from localStorage
    const savedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers([
      {
        id: "admin-1",
        username: "admin",
        email: "admin@kitchenpro.com",
        role: "admin",
        status: "active",
      },
      ...savedUsers,
    ]);
  };

  const handleDelete = (userId: string) => {
    if (userId === "admin-1") {
      toast.error("Không thể xóa tài khoản quản trị viên");
      return;
    }

    if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      const filtered = users.filter((u) => u.id !== userId);
      const nonAdmin = filtered.filter((u) => u.id !== "admin-1");
      localStorage.setItem("users", JSON.stringify(nonAdmin));
      setUsers(filtered);
      toast.success("Người dùng đã xóa thành công");
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
  };

  const handleSave = () => {
    if (editingUser) {
      const updated = users.map((u) =>
        u.id === editingUser.id ? editingUser : u,
      );
      setUsers(updated);
      const nonAdmin = updated.filter((u) => u.id !== "admin-1");
      localStorage.setItem("users", JSON.stringify(nonAdmin));

      // Try to update via backend
      if (accessToken && isAdmin) {
        fetch(`http://localhost:8000/api/admin/users/${editingUser.id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: editingUser.username,
            email: editingUser.email,
            role: editingUser.role,
            phone: editingUser.phone,
            address: editingUser.address,
          }),
        }).catch((err) => console.error("Backend update failed:", err));
      }

      setEditingUser(null);
      toast.success("Cập Nhật người dùng thành công");
    }
  };

  const handleAddUser = async () => {
    if (!newUserForm.username || !newUserForm.email || !newUserForm.password) {
      toast.error("Vui lòng điền tất cả các trường");
      return;
    }

    // Try to create via backend
    if (accessToken && isAdmin) {
      try {
        const res = await fetch("http://localhost:8000/api/admin/users", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUserForm),
        });

        if (res.ok) {
          const result = await res.json();
          setUsers([...users, result]);
          toast.success("Người dùng đã được thêm thành công");
          setNewUserForm({
            username: "",
            email: "",
            password: "",
            role: "user",
          });
          setShowAddModal(false);
          return;
        } else {
          const error = await res.json();
          toast.error(error.detail || "Lỗi khi thêm người dùng");
          return;
        }
      } catch (err) {
        console.error("Error creating user via backend:", err);
      }
    }

    // Fallback: save to localStorage
    const newUser = {
      id: `user-${Date.now()}`,
      username: newUserForm.username,
      email: newUserForm.email,
      role: newUserForm.role,
      status: "active",
    };
    setUsers([...users, newUser]);
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    localStorage.setItem("users", JSON.stringify([...allUsers, newUser]));
    toast.success("Người dùng đã được thêm thành công");
    setNewUserForm({ username: "", email: "", password: "", role: "user" });
    setShowAddModal(false);
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Quản Lý Người Dùng</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-[#0A3D62] to-[#1E90FF] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
        >
          <UserPlus className="w-5 h-5" />
          <span>Thêm Người Dùng</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Tên Đăng Nhập
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Vai Trò
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Trạng Thái
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Hành Động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{user.username}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : user.role === "shipper"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role === "admin"
                      ? "Quản Trị Viên"
                      : user.role === "shipper"
                        ? "Shipper"
                        : "Người Dùng"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    {user.status === "active" ? "Hoạt Động" : user.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={user.id === "admin-1"}
                      className={`p-2 rounded-lg transition-colors ${
                        user.id === "admin-1"
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-red-600 hover:bg-red-50"
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Chỉnh Sửa Người Dùng</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Tên Đăng Nhập
                </label>
                <input
                  value={editingUser.username}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, username: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Email
                </label>
                <input
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Vai Trò
                </label>
                <select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                >
                  <option value="user">Người Dùng</option>
                  <option value="shipper">Shipper</option>
                  <option value="admin">Quản Trị Viên</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Số Điện Thoại{" "}
                  <span className="text-gray-500">(Tùy Chọn)</span>
                </label>
                <input
                  value={editingUser.phone || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, phone: e.target.value })
                  }
                  placeholder="Nhập số điện thoại"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Địa Chỉ <span className="text-gray-500">(Tùy Chọn)</span>
                </label>
                <textarea
                  value={editingUser.address || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, address: e.target.value })
                  }
                  placeholder="Nhập địa chỉ"
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                />
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setEditingUser(null)}
                className="flex-1 border-2 border-gray-300 py-2 rounded-lg hover:bg-gray-50"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-[#0A3D62] to-[#1E90FF] text-white py-2 rounded-lg hover:shadow-lg"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Thêm Người Dùng Mới</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Tên Đăng Nhập
                </label>
                <input
                  value={newUserForm.username}
                  onChange={(e) =>
                    setNewUserForm({ ...newUserForm, username: e.target.value })
                  }
                  placeholder="Nhập tên đăng nhập"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Email
                </label>
                <input
                  value={newUserForm.email}
                  onChange={(e) =>
                    setNewUserForm({ ...newUserForm, email: e.target.value })
                  }
                  placeholder="Nhập email"
                  type="email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Mật Khẩu
                </label>
                <input
                  value={newUserForm.password}
                  onChange={(e) =>
                    setNewUserForm({ ...newUserForm, password: e.target.value })
                  }
                  placeholder="Nhập mật khẩu"
                  type="password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Vai Trò
                </label>
                <select
                  value={newUserForm.role}
                  onChange={(e) =>
                    setNewUserForm({ ...newUserForm, role: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                >
                  <option value="user">Người Dùng</option>
                  <option value="shipper">Shipper</option>
                  <option value="admin">Quản Trị Viên</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Số Điện Thoại{" "}
                  <span className="text-gray-500">(Tùy Chọn)</span>
                </label>
                <input
                  value={newUserForm.phone}
                  onChange={(e) =>
                    setNewUserForm({ ...newUserForm, phone: e.target.value })
                  }
                  placeholder="Nhập số điện thoại"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Địa Chỉ <span className="text-gray-500">(Tùy Chọn)</span>
                </label>
                <textarea
                  value={newUserForm.address}
                  onChange={(e) =>
                    setNewUserForm({ ...newUserForm, address: e.target.value })
                  }
                  placeholder="Nhập địa chỉ"
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                />
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewUserForm({
                    username: "",
                    email: "",
                    password: "",
                    role: "user",
                    phone: "",
                    address: "",
                  });
                }}
                className="flex-1 border-2 border-gray-300 py-2 rounded-lg hover:bg-gray-50"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={handleAddUser}
                className="flex-1 bg-gradient-to-r from-[#0A3D62] to-[#1E90FF] text-white py-2 rounded-lg hover:shadow-lg"
              >
                Thêm Người Dùng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

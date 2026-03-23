import { useState } from "react";
import { Search, UserPlus, Edit, Ban, Trophy } from "lucide-react";
import { memberTiers } from "../../data/mockData";

export function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tierFilter, setTierFilter] = useState<"all" | number>("all");

  // Mock users data
  const users = [
    {
      id: 1,
      ten: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      so_dien_thoai: "0123456789",
      diem_tich_luy: 1250,
      hang_thanh_vien: memberTiers[2],
      ngay_dang_ky: "2025-01-15",
      trang_thai: "active",
    },
    {
      id: 2,
      ten: "Trần Thị B",
      email: "tranthib@example.com",
      so_dien_thoai: "0987654321",
      diem_tich_luy: 650,
      hang_thanh_vien: memberTiers[1],
      ngay_dang_ky: "2025-02-20",
      trang_thai: "active",
    },
    {
      id: 3,
      ten: "Lê Văn C",
      email: "levanc@example.com",
      so_dien_thoai: "0369852147",
      diem_tich_luy: 2500,
      hang_thanh_vien: memberTiers[3],
      ngay_dang_ky: "2024-11-10",
      trang_thai: "active",
    },
    {
      id: 4,
      ten: "Phạm Thị D",
      email: "phamthid@example.com",
      so_dien_thoai: "0147258369",
      diem_tich_luy: 180,
      hang_thanh_vien: memberTiers[0],
      ngay_dang_ky: "2026-03-01",
      trang_thai: "active",
    },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier =
      tierFilter === "all" || user.hang_thanh_vien.id === tierFilter;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Quản lý người dùng</h1>
          <p className="text-gray-400">Quản lý thành viên và hạng thành viên</p>
        </div>
        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2">
          <UserPlus className="h-5 w-5" />
          <span>Thêm người dùng</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-6">
        {memberTiers.map((tier) => {
          const count = users.filter((u) => u.hang_thanh_vien.id === tier.id).length;
          return (
            <div key={tier.id} className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: tier.mau_sac }}
                >
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{tier.ten_hang}</h3>
                  <p className="text-sm text-gray-400">x{tier.he_so_tich_diem}</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-gray-900 rounded-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500"
            />
          </div>
          <select
            value={tierFilter}
            onChange={(e) =>
              setTierFilter(e.target.value === "all" ? "all" : Number(e.target.value))
            }
            className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500"
          >
            <option value="all">Tất cả hạng</option>
            {memberTiers.map((tier) => (
              <option key={tier.id} value={tier.id}>
                {tier.ten_hang}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  Người dùng
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  Liên hệ
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  Hạng thành viên
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  Điểm tích lũy
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  Ngày đăng ký
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {user.ten.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-white">{user.ten}</p>
                        <p className="text-sm text-gray-400">ID: #{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-300">{user.email}</p>
                      <p className="text-sm text-gray-400">{user.so_dien_thoai}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className="inline-flex items-center space-x-2 px-3 py-1 rounded-full"
                      style={{ backgroundColor: `${user.hang_thanh_vien.mau_sac}20` }}
                    >
                      <Trophy
                        className="h-4 w-4"
                        style={{ color: user.hang_thanh_vien.mau_sac }}
                      />
                      <span
                        className="font-semibold text-sm"
                        style={{ color: user.hang_thanh_vien.mau_sac }}
                      >
                        {user.hang_thanh_vien.ten_hang}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white font-semibold">
                      {user.diem_tich_luy.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-300">{user.ngay_dang_ky}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-yellow-400">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-red-400">
                        <Ban className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

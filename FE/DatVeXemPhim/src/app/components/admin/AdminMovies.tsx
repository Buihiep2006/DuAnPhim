import { useState } from "react";
import { Plus, Edit, Trash2, Search, Filter, Eye } from "lucide-react";
import { movies } from "../../data/mockData";

export function AdminMovies() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | 1 | 2>("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.ten_phim.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || movie.trang_thai === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Quản lý phim</h1>
          <p className="text-gray-400">Quản lý danh sách phim và lịch chiếu</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Thêm phim mới</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-900 rounded-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm phim..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value={1}>Đang chiếu</option>
            <option value={2}>Sắp chiếu</option>
          </select>
        </div>
      </div>

      {/* Movies Table */}
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  Phim
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  Thể loại
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  Thời lượng
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  Độ tuổi
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  Đánh giá
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredMovies.map((movie) => (
                <tr key={movie.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={movie.poster_url}
                        alt={movie.ten_phim}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-semibold text-white">{movie.ten_phim}</p>
                        <p className="text-sm text-gray-400">{movie.ten_goc}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-300 line-clamp-1">
                      {movie.the_loai.split(", ")[0]}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-300">{movie.thoi_luong} phút</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                      {movie.phan_loai_do_tuoi}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        movie.trang_thai === 1
                          ? "bg-green-900/30 text-green-400"
                          : "bg-blue-900/30 text-blue-400"
                      }`}
                    >
                      {movie.trang_thai === 1 ? "Đang chiếu" : "Sắp chiếu"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-300">
                      {movie.danh_gia_tb > 0 ? `⭐ ${movie.danh_gia_tb}` : "—"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-blue-400">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-yellow-400">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Movie Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-2xl font-bold text-white">Thêm phim mới</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-gray-400 text-sm mb-1 block">Tên phim</label>
                  <input
                    type="text"
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500"
                    placeholder="Nhập tên phim"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-gray-400 text-sm mb-1 block">Tên gốc</label>
                  <input
                    type="text"
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500"
                    placeholder="Original title"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Thời lượng (phút)</label>
                  <input
                    type="number"
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Phân loại độ tuổi</label>
                  <select className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500">
                    <option>P</option>
                    <option>T13</option>
                    <option>T16</option>
                    <option>T18</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-gray-400 text-sm mb-1 block">Mô tả</label>
                  <textarea
                    rows={4}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500"
                    placeholder="Nhập mô tả phim"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-800 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Hủy
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Thêm phim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

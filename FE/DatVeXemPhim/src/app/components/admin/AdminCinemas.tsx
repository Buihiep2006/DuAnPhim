import { useState } from "react";
import { Plus, Edit, Trash2, MapPin, Phone } from "lucide-react";
import { cinemas, showtimes, movies } from "../../data/mockData";

export function AdminCinemas() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Quản lý rạp chiếu</h1>
          <p className="text-gray-400">Quản lý rạp và phòng chiếu</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Thêm rạp mới</span>
        </button>
      </div>

      {/* Cinemas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cinemas.map((cinema) => {
          const cinemaShowtimes = showtimes.filter((s) => s.rap_id === cinema.id);
          const activeMovies = new Set(cinemaShowtimes.map((s) => s.phim_id)).size;

          return (
            <div key={cinema.id} className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{cinema.ten_rap}</h3>
                    <div className="space-y-1 text-sm text-gray-400">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{cinema.dia_chi}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>{cinema.so_dien_thoai}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-yellow-400">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-gray-800 px-3 py-2 rounded-lg">
                    <span className="text-gray-400 text-xs">Khu vực</span>
                    <p className="text-white font-semibold">{cinema.khu_vuc}</p>
                  </div>
                  <div className="bg-gray-800 px-3 py-2 rounded-lg">
                    <span className="text-gray-400 text-xs">Phim chiếu</span>
                    <p className="text-white font-semibold">{activeMovies}</p>
                  </div>
                  <div className="bg-gray-800 px-3 py-2 rounded-lg">
                    <span className="text-gray-400 text-xs">Suất chiếu</span>
                    <p className="text-white font-semibold">{cinemaShowtimes.length}</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h4 className="font-semibold text-white mb-3">Phòng chiếu</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((room) => (
                    <div
                      key={room}
                      className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      <p className="text-white font-semibold">Phòng {room}</p>
                      <p className="text-sm text-gray-400">120 ghế</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Cinema Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-2xl font-bold text-white">Thêm rạp mới</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Tên rạp</label>
                <input
                  type="text"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500"
                  placeholder="VD: CGV Vincom Center"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Địa chỉ</label>
                <input
                  type="text"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500"
                  placeholder="Nhập địa chỉ đầy đủ"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Khu vực</label>
                  <select className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500">
                    <option>TP. Hồ Chí Minh</option>
                    <option>Hà Nội</option>
                    <option>Đà Nẵng</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Số điện thoại</label>
                  <input
                    type="tel"
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500"
                    placeholder="1900 xxxx"
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
                Thêm rạp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

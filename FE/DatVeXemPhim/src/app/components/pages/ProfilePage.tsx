import { useState, useEffect } from "react";
import { User, Ticket, Trophy, Gift, Settings, LogOut } from "lucide-react";
import { memberTiers } from "../../data/mockData";
import { useNavigate } from "react-router";

export function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"info" | "history" | "points">("info");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      // Find user's tier
      const tier = memberTiers.find(t => t.id === parsedUser.hang_thanh_vien_id) || memberTiers[0];
      setUser({
        ...parsedUser,
        hang_thanh_vien: tier
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Đang tải...</div>
      </div>
    );
  }

  // Mock order history
  const orders = [
    {
      id: 1,
      ma_ve: "VE2026031501",
      phim: "Avatar: The Way of Water",
      rap: "CGV Vincom Center",
      ngay_chieu: "2026-03-10",
      gio_bat_dau: "14:00",
      ghe: "A5, A6",
      tong_tien: 190000,
      trang_thai: "Đã sử dụng",
    },
    {
      id: 2,
      ma_ve: "VE2026031502",
      phim: "The Batman",
      rap: "Galaxy Nguyễn Du",
      ngay_chieu: "2026-03-12",
      gio_bat_dau: "20:00",
      ghe: "D10",
      tong_tien: 95000,
      trang_thai: "Đã sử dụng",
    },
    {
      id: 3,
      ma_ve: "VE2026031503",
      phim: "John Wick: Chapter 4",
      rap: "Lotte Cinema Cộng Hòa",
      ngay_chieu: "2026-03-20",
      gio_bat_dau: "18:30",
      ghe: "E5, E6",
      tong_tien: 200000,
      trang_thai: "Chưa sử dụng",
    },
  ];

  const nextTier = memberTiers.find(
    (tier) => tier.diem_toi_thieu > user.diem_tich_luy
  );
  const pointsToNextTier = nextTier
    ? nextTier.diem_toi_thieu - user.diem_tich_luy
    : 0;

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-red-900 to-red-700 rounded-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
              <User className="h-12 w-12 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">{user.ten}</h1>
              <p className="text-red-100 mb-4">{user.email}</p>
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <div
                  className="px-4 py-2 rounded-full font-semibold text-white"
                  style={{ backgroundColor: user.hang_thanh_vien.mau_sac }}
                >
                  {user.hang_thanh_vien.ten_hang}
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full">
                  <Trophy className="h-5 w-5 text-yellow-300" />
                  <span className="text-white font-semibold">
                    {user.diem_tich_luy} điểm
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-800">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === "info"
                ? "text-red-500 border-red-500"
                : "text-gray-400 border-transparent hover:text-gray-300"
            }`}
          >
            Thông tin
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === "history"
                ? "text-red-500 border-red-500"
                : "text-gray-400 border-transparent hover:text-gray-300"
            }`}
          >
            Lịch sử đặt vé
          </button>
          <button
            onClick={() => setActiveTab("points")}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === "points"
                ? "text-red-500 border-red-500"
                : "text-gray-400 border-transparent hover:text-gray-300"
            }`}
          >
            Điểm thưởng
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "info" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-6">Thông tin cá nhân</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm">Họ và tên</label>
                    <input
                      type="text"
                      value={user.ten}
                      readOnly
                      className="w-full mt-1 bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      readOnly
                      className="w-full mt-1 bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Số điện thoại</label>
                    <input
                      type="tel"
                      value={user.so_dien_thoai}
                      readOnly
                      className="w-full mt-1 bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
                    />
                  </div>
                  <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>Chỉnh sửa thông tin</span>
                  </button>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-6">Cài đặt tài khoản</h2>
                <div className="space-y-3">
                  <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-lg text-left transition-colors">
                    Đổi mật khẩu
                  </button>
                  <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-lg text-left transition-colors">
                    Quản lý phương thức thanh toán
                  </button>
                  <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-lg text-left transition-colors">
                    Cài đặt thông báo
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-900/30 hover:bg-red-900/50 text-red-400 py-3 px-4 rounded-lg text-left transition-colors flex items-center space-x-2"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-gray-900 rounded-lg p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <Ticket className="h-5 w-5 text-red-500" />
                        <span className="font-semibold text-white text-lg">
                          {order.phim}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.trang_thai === "Đã sử dụng"
                              ? "bg-gray-700 text-gray-300"
                              : "bg-green-900/30 text-green-400"
                          }`}
                        >
                          {order.trang_thai}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-400">Mã vé:</span>
                          <span className="text-white ml-2 font-mono">{order.ma_ve}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Rạp:</span>
                          <span className="text-white ml-2">{order.rap}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Suất chiếu:</span>
                          <span className="text-white ml-2">
                            {order.ngay_chieu} • {order.gio_bat_dau}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Ghế:</span>
                          <span className="text-white ml-2">{order.ghe}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-red-500 font-bold text-xl mb-2">
                        {order.tong_tien.toLocaleString("vi-VN")} ₫
                      </p>
                      <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "points" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-6">Điểm tích lũy</h2>
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-red-500 mb-2">
                    {user.diem_tich_luy}
                  </div>
                  <p className="text-gray-400">điểm hiện có</p>
                </div>

                {nextTier && (
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-2">Đến hạng {nextTier.ten_hang}</p>
                    <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden mb-2">
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-600 to-red-500 rounded-full"
                        style={{
                          width: `${
                            ((user.diem_tich_luy - user.hang_thanh_vien.diem_toi_thieu) /
                              (nextTier.diem_toi_thieu -
                                user.hang_thanh_vien.diem_toi_thieu)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                    <p className="text-white text-sm text-right">
                      Còn {pointsToNextTier} điểm
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-6">Hạng thành viên</h2>
                <div className="space-y-3">
                  {memberTiers.map((tier) => {
                    const isCurrent = tier.id === user.hang_thanh_vien.id;
                    const isUnlocked = user.diem_tich_luy >= tier.diem_toi_thieu;

                    return (
                      <div
                        key={tier.id}
                        className={`p-4 rounded-lg border-2 ${
                          isCurrent
                            ? "border-red-500 bg-red-900/20"
                            : isUnlocked
                            ? "border-gray-700 bg-gray-800"
                            : "border-gray-800 bg-gray-800/50 opacity-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: tier.mau_sac }}
                            >
                              <Trophy className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">{tier.ten_hang}</h3>
                              <p className="text-sm text-gray-400">
                                {tier.diem_toi_thieu} điểm • x{tier.he_so_tich_diem} tích điểm
                              </p>
                            </div>
                          </div>
                          {isCurrent && (
                            <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                              Hiện tại
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
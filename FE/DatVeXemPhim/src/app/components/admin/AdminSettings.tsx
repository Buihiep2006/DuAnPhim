import { useState } from "react";
import { Save, DollarSign, Clock, Percent, Gift } from "lucide-react";

export function AdminSettings() {
  const [settings, setSettings] = useState({
    gia_ve_co_ban: 75000,
    phu_thu_vip: 20000,
    thoi_gian_giu_ghe: 10,
    he_so_tich_diem: 1,
    giam_gia_sinh_nhat: 10,
  });

  const handleSave = () => {
    alert("Đã lưu cài đặt thành công!");
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Cài đặt hệ thống</h1>
        <p className="text-gray-400">Cấu hình và tùy chỉnh hệ thống</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pricing Settings */}
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-green-500/10 text-green-500 p-3 rounded-lg">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Cài đặt giá vé</h2>
              <p className="text-sm text-gray-400">Quản lý giá vé và phụ thu</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Giá vé cơ bản (₫)
              </label>
              <input
                type="number"
                value={settings.gia_ve_co_ban}
                onChange={(e) =>
                  setSettings({ ...settings, gia_ve_co_ban: Number(e.target.value) })
                }
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Giá vé mặc định cho ghế thường
              </p>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Phụ thu ghế VIP (₫)
              </label>
              <input
                type="number"
                value={settings.phu_thu_vip}
                onChange={(e) =>
                  setSettings({ ...settings, phu_thu_vip: Number(e.target.value) })
                }
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Số tiền cộng thêm cho ghế VIP
              </p>
            </div>
          </div>
        </div>

        {/* Booking Settings */}
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-blue-500/10 text-blue-500 p-3 rounded-lg">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Cài đặt đặt vé</h2>
              <p className="text-sm text-gray-400">Quản lý quy trình đặt vé</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Thời gian giữ ghế (phút)
              </label>
              <input
                type="number"
                value={settings.thoi_gian_giu_ghe}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    thoi_gian_giu_ghe: Number(e.target.value),
                  })
                }
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Thời gian khách hàng có thể giữ ghế trước khi thanh toán
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold">Cho phép đặt trước</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
              <p className="text-xs text-gray-400">
                Cho phép khách hàng đặt vé trước ngày chiếu
              </p>
            </div>
          </div>
        </div>

        {/* Loyalty Settings */}
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-purple-500/10 text-purple-500 p-3 rounded-lg">
              <Percent className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Tích điểm thành viên</h2>
              <p className="text-sm text-gray-400">Cấu hình chương trình khách hàng thân thiết</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Hệ số tích điểm cơ bản
              </label>
              <input
                type="number"
                step="0.1"
                value={settings.he_so_tich_diem}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    he_so_tich_diem: Number(e.target.value),
                  })
                }
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                1 điểm = 1.000₫ × Hệ số tích điểm
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Bronze (0 điểm)</span>
                <span className="text-white font-semibold">x1.0</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Silver (500 điểm)</span>
                <span className="text-white font-semibold">x1.2</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Gold (1000 điểm)</span>
                <span className="text-white font-semibold">x1.5</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Platinum (2000 điểm)</span>
                <span className="text-white font-semibold">x2.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Promotion Settings */}
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-red-500/10 text-red-500 p-3 rounded-lg">
              <Gift className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Khuyến mãi</h2>
              <p className="text-sm text-gray-400">Cấu hình các chương trình khuyến mãi</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Giảm giá sinh nhật (%)
              </label>
              <input
                type="number"
                value={settings.giam_gia_sinh_nhat}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    giam_gia_sinh_nhat: Number(e.target.value),
                  })
                }
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Tỷ lệ giảm giá cho khách hàng vào tháng sinh nhật
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold">Ưu đãi thành viên mới</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
              <p className="text-xs text-gray-400">
                Giảm 20% cho đơn hàng đầu tiên của thành viên mới
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center space-x-2"
        >
          <Save className="h-5 w-5" />
          <span>Lưu cài đặt</span>
        </button>
      </div>
    </div>
  );
}

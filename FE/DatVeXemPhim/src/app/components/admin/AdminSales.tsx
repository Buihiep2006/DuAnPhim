import { useState } from "react";
import { DollarSign, TrendingUp, Calendar, Download } from "lucide-react";
import { movies } from "../../data/mockData";

export function AdminSales() {
  const [dateRange, setDateRange] = useState("month");

  // Mock sales data
  const salesData = [
    { movie: "Avatar: The Way of Water", tickets: 345, revenue: 26000000 },
    { movie: "The Batman", tickets: 289, revenue: 21750000 },
    { movie: "John Wick: Chapter 4", tickets: 267, revenue: 25300000 },
    { movie: "Doraemon: Nobita và Vùng Đất Lý Tưởng", tickets: 198, revenue: 11880000 },
    { movie: "Kung Fu Panda 4", tickets: 135, revenue: 8100000 },
  ];

  const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
  const totalTickets = salesData.reduce((sum, item) => sum + item.tickets, 0);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Báo cáo doanh thu</h1>
          <p className="text-gray-400">Thống kê và phân tích doanh thu</p>
        </div>
        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2">
          <Download className="h-5 w-5" />
          <span>Xuất báo cáo</span>
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="bg-gray-900 rounded-lg p-6 mb-6">
        <div className="flex items-center space-x-4">
          <Calendar className="h-5 w-5 text-gray-400" />
          <div className="flex space-x-2">
            {["day", "week", "month", "year"].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  dateRange === range
                    ? "bg-red-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {range === "day"
                  ? "Hôm nay"
                  : range === "week"
                  ? "Tuần này"
                  : range === "month"
                  ? "Tháng này"
                  : "Năm nay"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500/10 text-green-500 p-3 rounded-lg">
              <DollarSign className="h-6 w-6" />
            </div>
            <span className="text-green-500 text-sm font-semibold">+12.5%</span>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Tổng doanh thu</h3>
          <p className="text-white text-2xl font-bold">
            {totalRevenue.toLocaleString("vi-VN")} ₫
          </p>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500/10 text-blue-500 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6" />
            </div>
            <span className="text-blue-500 text-sm font-semibold">+8.3%</span>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Vé đã bán</h3>
          <p className="text-white text-2xl font-bold">{totalTickets.toLocaleString()}</p>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-500/10 text-purple-500 p-3 rounded-lg">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Giá vé TB</h3>
          <p className="text-white text-2xl font-bold">
            {Math.round(totalRevenue / totalTickets).toLocaleString("vi-VN")} ₫
          </p>
        </div>
      </div>

      {/* Sales by Movie */}
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Doanh thu theo phim</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  Hạng
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  Tên phim
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  Số vé bán
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  Doanh thu
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  % Tổng DT
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {salesData.map((item, index) => {
                const percentage = ((item.revenue / totalRevenue) * 100).toFixed(1);
                return (
                  <tr key={item.movie} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-red-600 rounded-full">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-white">{item.movie}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-300">{item.tickets.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-green-500">
                        {item.revenue.toLocaleString("vi-VN")} ₫
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-red-600 h-full rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-gray-300 text-sm w-12">{percentage}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

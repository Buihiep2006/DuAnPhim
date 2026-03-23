import { TrendingUp, Users, Film, DollarSign, Ticket, ShoppingBag } from "lucide-react";
import { movies, showtimes } from "../../data/mockData";

export function AdminDashboard() {
  // Mock statistics
  const stats = [
    {
      name: "Doanh thu tháng này",
      value: "125,000,000 ₫",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      name: "Vé đã bán",
      value: "1,234",
      change: "+8.3%",
      icon: Ticket,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      name: "Khách hàng",
      value: "856",
      change: "+15.2%",
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      name: "Phim đang chiếu",
      value: movies.filter((m) => m.trang_thai === 1).length.toString(),
      change: "+2",
      icon: Film,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
  ];

  // Mock recent bookings
  const recentBookings = [
    {
      id: 1,
      customer: "Nguyễn Văn A",
      movie: "Avatar: The Way of Water",
      seats: "A5, A6",
      amount: 190000,
      time: "10 phút trước",
    },
    {
      id: 2,
      customer: "Trần Thị B",
      movie: "The Batman",
      seats: "C10",
      amount: 95000,
      time: "25 phút trước",
    },
    {
      id: 3,
      customer: "Lê Văn C",
      movie: "John Wick: Chapter 4",
      seats: "E5, E6, E7",
      amount: 285000,
      time: "1 giờ trước",
    },
  ];

  // Top movies
  const topMovies = movies
    .filter((m) => m.trang_thai === 1)
    .sort((a, b) => b.danh_gia_tb - a.danh_gia_tb)
    .slice(0, 5);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Tổng quan</h1>
        <p className="text-gray-400">Chào mừng đến với trang quản trị DatnCinema</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <span className="text-green-500 text-sm font-semibold">{stat.change}</span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">{stat.name}</h3>
            <p className="text-white text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Đơn hàng gần đây</h2>
            <button className="text-red-500 hover:text-red-400 text-sm font-semibold">
              Xem tất cả
            </button>
          </div>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-start justify-between p-4 bg-gray-800 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{booking.customer}</h3>
                  <p className="text-sm text-gray-400 mb-1">{booking.movie}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Ghế: {booking.seats}</span>
                    <span>{booking.time}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-red-500 font-bold">
                    {booking.amount.toLocaleString("vi-VN")} ₫
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Movies */}
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Phim được đánh giá cao</h2>
            <TrendingUp className="h-5 w-5 text-red-500" />
          </div>
          <div className="space-y-4">
            {topMovies.map((movie, index) => (
              <div key={movie.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{index + 1}</span>
                </div>
                <img
                  src={movie.poster_url}
                  alt={movie.ten_phim}
                  className="w-12 h-16 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{movie.ten_phim}</h3>
                  <p className="text-sm text-gray-400">{movie.the_loai.split(", ")[0]}</p>
                </div>
                <div className="flex items-center space-x-1 bg-yellow-500/20 px-2 py-1 rounded">
                  <span className="text-yellow-500 font-semibold text-sm">
                    {movie.danh_gia_tb}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

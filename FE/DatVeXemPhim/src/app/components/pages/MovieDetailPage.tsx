import { useParams, Link } from "react-router";
import { Play, Clock, Calendar, Star, User, Globe, Film } from "lucide-react";
import { movies, showtimes, cinemas, reviews } from "../../data/mockData";
import { useState } from "react";

export function MovieDetailPage() {
  const { id } = useParams();
  const movie = movies.find((m) => m.id === Number(id));
  const [selectedDate, setSelectedDate] = useState("2026-03-15");

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Không tìm thấy phim</h1>
          <Link to="/" className="text-red-500 hover:text-red-400">
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const movieShowtimes = showtimes.filter((s) => s.phim_id === movie.id);
  const movieReviews = reviews.filter((r) => r.phim_id === movie.id);

  // Group showtimes by cinema
  const showtimesByCinema = movieShowtimes.reduce((acc, showtime) => {
    const cinema = cinemas.find((c) => c.id === showtime.rap_id);
    if (cinema) {
      if (!acc[cinema.id]) {
        acc[cinema.id] = {
          cinema,
          showtimes: [],
        };
      }
      acc[cinema.id].showtimes.push(showtime);
    }
    return acc;
  }, {} as Record<number, { cinema: typeof cinemas[0]; showtimes: typeof showtimes }>);

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date("2026-03-15");
    date.setDate(date.getDate() + i);
    return date.toISOString().split("T")[0];
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={movie.poster_url}
            alt={movie.ten_phim}
            className="w-full h-full object-cover opacity-30 blur-sm scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-gray-950/50" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex items-end pb-8">
          <div className="flex flex-col md:flex-row gap-6 w-full">
            <img
              src={movie.poster_url}
              alt={movie.ten_phim}
              className="w-48 h-72 object-cover rounded-lg shadow-2xl"
            />

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold">
                  {movie.phan_loai_do_tuoi}
                </span>
                {movie.danh_gia_tb > 0 && (
                  <div className="flex items-center space-x-1 bg-yellow-500 text-gray-900 px-3 py-1 rounded">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-semibold">{movie.danh_gia_tb}</span>
                  </div>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {movie.ten_phim}
              </h1>
              <p className="text-lg text-gray-400 mb-4">{movie.ten_goc}</p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{movie.thoi_luong} phút</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{movie.ngay_khoi_chieu}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>{movie.ngon_ngu}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <a
                  href={movie.trailer_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                >
                  <Play className="h-5 w-5" />
                  <span>Xem Trailer</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Movie Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Synopsis */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Nội dung phim</h2>
              <p className="text-gray-300 leading-relaxed">{movie.mo_ta}</p>
            </section>

            {/* Showtimes */}
            {movie.trang_thai === 1 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-6">Lịch chiếu</h2>

                {/* Date selector */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
                  {dates.map((date) => {
                    const dateObj = new Date(date);
                    const day = dateObj.getDate();
                    const dayName = dateObj.toLocaleDateString("vi-VN", {
                      weekday: "short",
                    });
                    const isToday = date === "2026-03-15";

                    return (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`flex-shrink-0 px-4 py-3 rounded-lg transition-colors ${
                          selectedDate === date
                            ? "bg-red-600 text-white"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        <div className="text-xs opacity-70">{dayName}</div>
                        <div className="font-semibold">{day}</div>
                        {isToday && <div className="text-xs opacity-70">Hôm nay</div>}
                      </button>
                    );
                  })}
                </div>

                {/* Showtimes by cinema */}
                <div className="space-y-6">
                  {Object.values(showtimesByCinema).map(({ cinema, showtimes: cinemaShowtimes }) => (
                    <div key={cinema.id} className="bg-gray-900 rounded-lg p-6">
                      <h3 className="font-semibold text-white text-lg mb-2">
                        {cinema.ten_rap}
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">{cinema.dia_chi}</p>

                      <div className="flex flex-wrap gap-3">
                        {cinemaShowtimes
                          .filter((s) => s.ngay_chieu === selectedDate)
                          .map((showtime) => (
                            <Link
                              key={showtime.id}
                              to={`/seat-selection/${showtime.id}`}
                              className="bg-gray-800 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                            >
                              {showtime.gio_bat_dau}
                            </Link>
                          ))}
                      </div>
                    </div>
                  ))}

                  {Object.keys(showtimesByCinema).length === 0 && (
                    <p className="text-gray-400 text-center py-8">
                      Chưa có lịch chiếu cho phim này
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* Reviews */}
            {movieReviews.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-6">Đánh giá</h2>
                <div className="space-y-4">
                  {movieReviews.map((review) => (
                    <div key={review.id} className="bg-gray-900 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{review.nguoi_dung}</p>
                            <p className="text-sm text-gray-400">{review.ngay_danh_gia}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 bg-yellow-500 text-gray-900 px-2 py-1 rounded">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="font-semibold">{review.diem_so}</span>
                        </div>
                      </div>
                      <p className="text-gray-300">{review.noi_dung}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Thông tin chi tiết</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-400 mb-1">Đạo diễn</p>
                  <p className="text-white font-semibold">{movie.dao_dien}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Diễn viên</p>
                  <p className="text-white">{movie.dien_vien}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Thể loại</p>
                  <p className="text-white">{movie.the_loai}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Ngôn ngữ</p>
                  <p className="text-white">{movie.ngon_ngu}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Thời lượng</p>
                  <p className="text-white">{movie.thoi_luong} phút</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

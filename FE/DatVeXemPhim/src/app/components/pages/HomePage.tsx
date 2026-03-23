import { useState } from "react";
import { Link } from "react-router";
import { Play, Star, Calendar, Clock, Filter } from "lucide-react";
import { movies, cinemas, showtimes } from "../../data/mockData";

export function HomePage() {
  const [activeTab, setActiveTab] = useState<"now-showing" | "coming-soon">("now-showing");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [selectedArea, setSelectedArea] = useState<string>("all");

  const nowShowing = movies.filter((m) => m.trang_thai === 1);
  const comingSoon = movies.filter((m) => m.trang_thai === 2);
  const displayMovies = activeTab === "now-showing" ? nowShowing : comingSoon;

  // Get unique genres
  const genres = Array.from(
    new Set(movies.flatMap((m) => m.the_loai.split(", ")))
  );

  const areas = Array.from(new Set(cinemas.map((c) => c.khu_vuc)));

  const filteredMovies = displayMovies.filter((movie) => {
    const genreMatch = selectedGenre === "all" || movie.the_loai.includes(selectedGenre);
    return genreMatch;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={movies[0].poster_url}
            alt="Hero"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {movies[0].ten_phim}
            </h1>
            <p className="text-lg text-gray-300 mb-6 line-clamp-3">
              {movies[0].mo_ta}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to={`/movie/${movies[0].id}`}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <Play className="h-5 w-5" />
                <span>Đặt vé ngay</span>
              </Link>
              <a
                href={movies[0].trailer_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 backdrop-blur text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Xem Trailer
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Movies Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("now-showing")}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === "now-showing"
                  ? "bg-red-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Phim đang chiếu
            </button>
            <button
              onClick={() => setActiveTab("coming-soon")}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === "coming-soon"
                  ? "bg-red-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Phim sắp chiếu
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 items-center">
          <div className="flex items-center space-x-2 text-gray-400">
            <Filter className="h-5 w-5" />
            <span>Lọc:</span>
          </div>

          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500"
          >
            <option value="all">Tất cả thể loại</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>

          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500"
          >
            <option value="all">Tất cả khu vực</option>
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {/* Movie Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              className="group bg-gray-900 rounded-lg overflow-hidden hover:ring-2 hover:ring-red-500 transition-all"
            >
              <div className="relative aspect-[2/3] overflow-hidden">
                <img
                  src={movie.poster_url}
                  alt={movie.ten_phim}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm font-semibold">
                  {movie.phan_loai_do_tuoi}
                </div>
                {movie.danh_gia_tb > 0 && (
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur text-white px-2 py-1 rounded flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">{movie.danh_gia_tb}</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-white mb-2 line-clamp-1 group-hover:text-red-500 transition-colors">
                  {movie.ten_phim}
                </h3>
                <div className="space-y-1 text-sm text-gray-400">
                  <p className="line-clamp-1">{movie.the_loai}</p>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{movie.thoi_luong} phút</span>
                  </div>
                  {movie.trang_thai === 2 && (
                    <div className="flex items-center space-x-2 text-red-400">
                      <Calendar className="h-4 w-4" />
                      <span>Khởi chiếu {movie.ngay_khoi_chieu}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

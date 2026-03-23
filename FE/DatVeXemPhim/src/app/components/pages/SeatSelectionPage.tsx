import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Clock, Armchair } from "lucide-react";
import { showtimes, movies, cinemas, generateSeats, type Seat } from "../../data/mockData";

export function SeatSelectionPage() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds

  const showtime = showtimes.find((s) => s.id === Number(showtimeId));
  const movie = showtime ? movies.find((m) => m.id === showtime.phim_id) : null;
  const cinema = showtime ? cinemas.find((c) => c.id === showtime.rap_id) : null;

  useEffect(() => {
    // Generate seats for this showtime
    setSeats(generateSeats("medium"));
  }, [showtimeId]);

  useEffect(() => {
    // Countdown timer
    if (selectedSeats.length === 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          alert("Hết thời gian giữ ghế!");
          setSelectedSeats([]);
          return 600;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedSeats.length]);

  if (!showtime || !movie || !cinema) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Không tìm thấy suất chiếu</h1>
        </div>
      </div>
    );
  }

  const handleSeatClick = (seat: Seat) => {
    if (seat.trang_thai === "sold") return;

    setSeats((prevSeats) =>
      prevSeats.map((s) => {
        if (s.id === seat.id) {
          const newStatus = s.trang_thai === "selected" ? "available" : "selected";
          if (newStatus === "selected") {
            setSelectedSeats((prev) => [...prev, { ...s, trang_thai: "selected" }]);
          } else {
            setSelectedSeats((prev) => prev.filter((selectedSeat) => selectedSeat.id !== s.id));
          }
          return { ...s, trang_thai: newStatus };
        }
        return s;
      })
    );
  };

  const totalPrice = selectedSeats.reduce(
    (sum, seat) => sum + showtime.gia_ve_co_ban + seat.phu_thu,
    0
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.hang]) {
      acc[seat.hang] = [];
    }
    acc[seat.hang].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ghế!");
      return;
    }
    // Store selection in session storage
    sessionStorage.setItem(
      "selectedSeats",
      JSON.stringify({
        showtimeId,
        seats: selectedSeats,
        movie,
        cinema,
        showtime,
      })
    );
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">{movie.ten_phim}</h1>
              <p className="text-gray-400">
                {cinema.ten_rap} • {showtime.ngay_chieu} • {showtime.gio_bat_dau}
              </p>
            </div>
            {selectedSeats.length > 0 && (
              <div className="bg-red-600 text-white px-4 py-3 rounded-lg flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span className="font-semibold text-lg">{formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Screen */}
        <div className="mb-8">
          <div className="bg-gradient-to-b from-gray-700 to-gray-900 h-2 rounded-t-full mb-2" />
          <p className="text-center text-gray-500 text-sm">Màn hình</p>
        </div>

        {/* Seats */}
        <div className="mb-8 overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="space-y-2">
              {Object.entries(seatsByRow).map(([row, rowSeats]) => (
                <div key={row} className="flex items-center justify-center gap-2">
                  <span className="text-gray-500 font-semibold w-6 text-center">{row}</span>
                  <div className="flex gap-2">
                    {rowSeats.map((seat) => (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        disabled={seat.trang_thai === "sold"}
                        className={`w-8 h-8 rounded-t-lg transition-all flex items-center justify-center text-xs font-semibold ${
                          seat.trang_thai === "sold"
                            ? "bg-gray-700 cursor-not-allowed text-gray-500"
                            : seat.trang_thai === "selected"
                            ? "bg-red-600 text-white scale-110"
                            : seat.loai_ghe === "vip"
                            ? "bg-yellow-600 hover:bg-yellow-500 text-white"
                            : "bg-gray-600 hover:bg-gray-500 text-white"
                        }`}
                        title={`${row}${seat.so_ghe} - ${
                          seat.loai_ghe === "vip" ? "VIP" : "Thường"
                        }`}
                      >
                        {seat.so_ghe}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-600 rounded-t-lg" />
            <span className="text-gray-300 text-sm">Ghế thường</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-yellow-600 rounded-t-lg" />
            <span className="text-gray-300 text-sm">Ghế VIP</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-red-600 rounded-t-lg" />
            <span className="text-gray-300 text-sm">Đang chọn</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-700 rounded-t-lg" />
            <span className="text-gray-300 text-sm">Đã bán</span>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-gray-400 mb-2">Ghế đã chọn</p>
              <p className="text-white font-semibold text-lg">
                {selectedSeats.length > 0
                  ? selectedSeats.map((s) => `${s.hang}${s.so_ghe}`).join(", ")
                  : "Chưa chọn ghế"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 mb-2">Tổng tiền</p>
              <p className="text-red-500 font-bold text-2xl">
                {totalPrice.toLocaleString("vi-VN")} ₫
              </p>
            </div>
          </div>
          <button
            onClick={handleContinue}
            disabled={selectedSeats.length === 0}
            className="w-full mt-6 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
}

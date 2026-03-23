import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { CreditCard, Ticket, ShoppingBag, Tag, Check } from "lucide-react";
import { services, promotions } from "../../data/mockData";

export function CheckoutPage() {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<any>(null);
  const [selectedServices, setSelectedServices] = useState<
    Array<{ service: typeof services[0]; quantity: number }>
  >([]);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<typeof promotions[0] | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"vnpay" | "momo" | "card">("vnpay");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem("selectedSeats");
    if (data) {
      setBookingData(JSON.parse(data));
    } else {
      navigate("/");
    }
  }, [navigate]);

  if (!bookingData) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-white">Đang tải...</div>
    </div>;
  }

  const { movie, cinema, showtime, seats } = bookingData;

  const seatTotal = seats.reduce(
    (sum: number, seat: any) => sum + showtime.gia_ve_co_ban + seat.phu_thu,
    0
  );

  const serviceTotal = selectedServices.reduce(
    (sum, item) => sum + item.service.don_gia * item.quantity,
    0
  );

  const subtotal = seatTotal + serviceTotal;

  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.loai_giam_gia === "percent") {
      discount = Math.min(
        (subtotal * appliedPromo.gia_tri_giam) / 100,
        appliedPromo.giam_toi_da
      );
    } else {
      discount = appliedPromo.gia_tri_giam;
    }
  }

  const total = subtotal - discount;

  const handleServiceChange = (service: typeof services[0], delta: number) => {
    setSelectedServices((prev) => {
      const existing = prev.find((item) => item.service.id === service.id);
      if (existing) {
        const newQuantity = existing.quantity + delta;
        if (newQuantity <= 0) {
          return prev.filter((item) => item.service.id !== service.id);
        }
        return prev.map((item) =>
          item.service.id === service.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else if (delta > 0) {
        return [...prev, { service, quantity: 1 }];
      }
      return prev;
    });
  };

  const handleApplyPromo = () => {
    const promo = promotions.find(
      (p) => p.ma_khuyen_mai === promoCode.toUpperCase()
    );
    if (promo) {
      const now = new Date("2026-03-15");
      const start = new Date(promo.ngay_bat_dau);
      const end = new Date(promo.ngay_ket_thuc);

      if (now >= start && now <= end && promo.so_luong_con_lai > 0) {
        setAppliedPromo(promo);
        alert("Áp dụng mã giảm giá thành công!");
      } else {
        alert("Mã giảm giá đã hết hạn hoặc hết lượt sử dụng!");
      }
    } else {
      alert("Mã giảm giá không hợp lệ!");
    }
  };

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      alert("Thanh toán thành công! Vui lòng kiểm tra email để nhận vé.");
      sessionStorage.removeItem("selectedSeats");
      navigate("/profile");
    }, 2000);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Thanh toán</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Summary */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Ticket className="h-5 w-5" />
                <span>Thông tin đặt vé</span>
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Phim</span>
                  <span className="text-white font-semibold">{movie.ten_phim}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rạp</span>
                  <span className="text-white">{cinema.ten_rap}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Suất chiếu</span>
                  <span className="text-white">
                    {showtime.ngay_chieu} • {showtime.gio_bat_dau}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Ghế</span>
                  <span className="text-white font-semibold">
                    {seats.map((s: any) => `${s.hang}${s.so_ghe}`).join(", ")}
                  </span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5" />
                <span>Combo & Đồ ăn</span>
              </h2>
              <div className="space-y-4">
                {services.map((service) => {
                  const selected = selectedServices.find(
                    (item) => item.service.id === service.id
                  );
                  const quantity = selected?.quantity || 0;

                  return (
                    <div
                      key={service.id}
                      className="flex items-center space-x-4 bg-gray-800 rounded-lg p-4"
                    >
                      <img
                        src={service.hinh_anh_url}
                        alt={service.ten_dich_vu}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{service.ten_dich_vu}</h3>
                        <p className="text-sm text-gray-400">{service.mo_ta}</p>
                        <p className="text-red-500 font-semibold mt-1">
                          {service.don_gia.toLocaleString("vi-VN")} ₫
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleServiceChange(service, -1)}
                          className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="text-white font-semibold w-8 text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleServiceChange(service, 1)}
                          className="w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Promo Code */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Tag className="h-5 w-5" />
                <span>Mã giảm giá</span>
              </h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Nhập mã giảm giá"
                  className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500"
                />
                <button
                  onClick={handleApplyPromo}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Áp dụng
                </button>
              </div>
              {appliedPromo && (
                <div className="mt-3 bg-green-900/30 border border-green-700 rounded-lg p-3 flex items-center space-x-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-green-500 font-semibold">
                    Đã áp dụng: {appliedPromo.ten_khuyen_mai}
                  </span>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Phương thức thanh toán</span>
              </h2>
              <div className="space-y-3">
                {[
                  { id: "vnpay", name: "VNPay", logo: "💳" },
                  { id: "momo", name: "MoMo", logo: "📱" },
                  { id: "card", name: "Thẻ ngân hàng", logo: "💳" },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`w-full flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors ${
                      paymentMethod === method.id
                        ? "border-red-500 bg-red-900/20"
                        : "border-gray-700 bg-gray-800 hover:border-gray-600"
                    }`}
                  >
                    <span className="text-2xl">{method.logo}</span>
                    <span className="text-white font-semibold">{method.name}</span>
                    {paymentMethod === method.id && (
                      <Check className="h-5 w-5 text-red-500 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div className="bg-gray-900 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">Tổng đơn hàng</h2>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Tiền vé ({seats.length} ghế)</span>
                  <span className="text-white">{seatTotal.toLocaleString("vi-VN")} ₫</span>
                </div>
                {serviceTotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Combo & Đồ ăn</span>
                    <span className="text-white">
                      {serviceTotal.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Giảm giá</span>
                    <span>-{discount.toLocaleString("vi-VN")} ₫</span>
                  </div>
                )}
                <div className="border-t border-gray-700 pt-3 flex justify-between">
                  <span className="text-white font-semibold text-lg">Tổng cộng</span>
                  <span className="text-red-500 font-bold text-xl">
                    {total.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              </div>
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                {isProcessing ? "Đang xử lý..." : "Thanh toán"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

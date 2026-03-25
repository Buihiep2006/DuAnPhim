import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, ListGroup, Badge, Alert, Spinner } from 'react-bootstrap';
import { useBooking } from '../../contexts/BookingContext';
import { useAuth } from '../../contexts/AuthContext';

const PUBLIC_API = 'http://localhost:9999/api/public';
const CUSTOMER_API = 'http://localhost:9999/api/customer';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookingState, updateServiceQuantity, applyPromoCode, applyPoints, clearBooking } = useBooking();

  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [showtime, setShowtime] = useState<any>(null);
  const [roomSeats, setRoomSeats] = useState<any[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [usePoints, setUsePoints] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('VNPAY');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookingState.suat_chieu_id) {
      fetchData();
    } else {
      navigate('/');
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch Showtime
      const sRes = await fetch(`${PUBLIC_API}/suat-chieu/${bookingState.suat_chieu_id}`);
      const sJson = await sRes.json();
      if (sJson.success) {
        setShowtime(sJson.data);
        
        // Fetch Seats for this room
        const seatsRes = await fetch(`${PUBLIC_API}/ghe-ngoi/phong-chieu/${sJson.data.phongChieuId}`);
        const seatsJson = await seatsRes.json();
        if (seatsJson.success) setRoomSeats(seatsJson.data);
      }

      // Fetch Services
      const servicesRes = await fetch(`${PUBLIC_API}/dich-vu`);
      const servicesJson = await servicesRes.json();
      if (servicesJson.success) setServices(servicesJson.data);

      // Fetch Promotions
      const promoRes = await fetch(`${PUBLIC_API}/khuyen-mai`);
      const promoJson = await promoRes.json();
      if (promoJson.success) setPromotions(promoJson.data);

    } catch (err) {
      console.error('Error fetching checkout data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTicketTotal = () => {
    if (!showtime) return 0;
    return bookingState.selected_seats.reduce((total, seatId) => {
      const seat = roomSeats.find(s => s.id === seatId);
      return total + (showtime.giaVeCoBan || 0) + (seat?.phuThu || 0);
    }, 0);
  };

  const calculateServiceTotal = () => {
    return bookingState.selected_services.reduce((total, s) => {
      const dv = services.find(d => d.id === s.id);
      return total + (dv?.giaBan || 0) * s.quantity;
    }, 0);
  };

  const calculateSubtotal = () => {
    return calculateTicketTotal() + calculateServiceTotal();
  };

  const calculateDiscount = () => {
    if (promoCode) {
      const promo = promotions.find(k => k.maCode === promoCode);
      if (promo) {
        const discount = (calculateSubtotal() * (promo.phanTramGiam || 0)) / 100;
        return Math.min(discount, promo.giamToiDa || discount);
      }
    }
    return 0;
  };

  const calculatePointsDiscount = () => {
    if (usePoints && user) {
      return Math.min(user.diem_tich_luy * 1000, calculateSubtotal() * 0.1); 
    }
    return 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() - calculatePointsDiscount();
  };

  const formatCurrency = (amount: number) => {
    return (amount || 0).toLocaleString('vi-VN') + 'đ';
  };

  const handleServiceChange = (serviceId: string, quantity: number) => {
    updateServiceQuantity(serviceId, quantity);
  };

  const handlePayment = async () => {
    if (!user) {
      alert('Vui lòng đăng nhập để thanh toán');
      return;
    }

    try {
      const selectedPromo = promotions.find(k => k.maCode === promoCode);
      
      const payload = {
        suatChieuId: bookingState.suat_chieu_id,
        khuyenMaiId: selectedPromo?.id,
        gheNgoiIds: bookingState.selected_seats,
        services: bookingState.selected_services.map(s => {
          const dv = services.find(d => d.id === s.id);
          return {
            dichVuId: s.id,
            soLuong: s.quantity,
            donGia: dv?.giaBan || 0
          };
        }),
        tongTienBanDau: calculateSubtotal(),
        soTienGiam: calculateDiscount() + calculatePointsDiscount(),
        tongTienThanhToan: calculateTotal(),
        diemThuongSuDung: usePoints ? user.diem_tich_luy : 0
      };

      const res = await fetch(`${CUSTOMER_API}/hoa-don/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.success) {
        const selectedSeatsNames = bookingState.selected_seats.map(id => 
          roomSeats.find(s => s.id === id)?.maGhe || id
        );

        const selectedServicesNames = bookingState.selected_services.map(s => {
          const dv = services.find(d => d.id === s.id);
          return {
            ten: dv?.ten || 'Dịch vụ',
            soLuong: s.quantity,
            donGia: dv?.giaBan || 0,
            thanhTien: (dv?.giaBan || 0) * s.quantity
          };
        }).filter(s => s.soLuong > 0);

        const bookingInfo = {
          tenPhim: showtime.tenPhim,
          thoiGianBatDau: showtime.thoiGianBatDau,
          tenRap: showtime.tenRap,
          tenPhongChieu: showtime.tenPhongChieu,
          selectedSeatsNames: selectedSeatsNames,
          selectedServices: selectedServicesNames,
          soTienGiam: calculateDiscount() + calculatePointsDiscount(),
          chinhSachGiam: [
            { ten: 'Khuyến mãi', giam: calculateDiscount() },
            { ten: 'Điểm tích lũy', giam: calculatePointsDiscount() }
          ].filter(i => i.giam > 0)
        };

        clearBooking();
        navigate('/booking-success', { 
          state: { 
            invoice: json.data,
            bookingInfo: bookingInfo
          } 
        });
      } else {
        setError(json.message || 'Thanh toán thất bại');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Đã có lỗi xảy ra khi xử lý thanh toán');
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="danger" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">
        <i className="bi bi-credit-card me-2"></i>
        Thanh toán
      </h2>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      <Row>
        <Col lg={8}>
          {/* F&B Services */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-cup-straw me-2"></i>
                Chọn combo F&B
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                {services.map(service => {
                  const selected = bookingState.selected_services.find(s => s.id === service.id);
                  return (
                    <Col md={6} key={service.id} className="mb-3">
                      <Card className="h-100">
                        <Row className="g-0">
                          <Col xs={4}>
                            <img
                              src={service.hinhAnh || 'https://via.placeholder.com/100x100?text=Service'}
                              alt={service.ten}
                              className="img-fluid rounded-start"
                              style={{ height: '100%', objectFit: 'cover' }}
                            />
                          </Col>
                          <Col xs={8}>
                            <Card.Body className="p-2">
                              <Card.Title className="h6">{service.ten}</Card.Title>
                              <div className="text-danger fw-bold mb-2">
                                {formatCurrency(service.giaBan)}
                              </div>
                              <div className="d-flex gap-1">
                                <Button
                                  size="sm"
                                  variant="outline-secondary"
                                  onClick={() =>
                                    handleServiceChange(
                                      service.id,
                                      Math.max(0, (selected?.quantity || 0) - 1)
                                    )
                                  }
                                >
                                  -
                                </Button>
                                <Form.Control
                                  type="text"
                                  size="sm"
                                  value={selected?.quantity || 0}
                                  readOnly
                                  style={{ width: '50px', textAlign: 'center' }}
                                />
                                <Button
                                  size="sm"
                                  variant="outline-secondary"
                                  onClick={() =>
                                    handleServiceChange(service.id, (selected?.quantity || 0) + 1)
                                  }
                                >
                                  +
                                </Button>
                              </div>
                            </Card.Body>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Card.Body>
          </Card>

          {/* Promo Code */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-tag me-2"></i>
                Mã giảm giá
              </h5>
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    placeholder="Nhập mã giảm giá"
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value.toUpperCase())}
                  />
                  <Button variant="danger" onClick={() => applyPromoCode(promoCode)}>
                    Áp dụng
                  </Button>
                </div>
              </Form.Group>

              {promoCode && promotions.find(k => k.maCode === promoCode) && (
                <Alert variant="success" className="mt-3 mb-0">
                  <i className="bi bi-check-circle me-2"></i>
                  Áp dụng mã thành công! Giảm {formatCurrency(calculateDiscount())}
                </Alert>
              )}

              <div className="mt-3">
                <small className="text-muted">Mã khuyến mãi có sẵn:</small>
                <div className="d-flex gap-2 mt-2 flex-wrap">
                  {promotions.map(promo => (
                    <Badge
                      key={promo.id}
                      bg="light"
                      text="dark"
                      className="p-2 cursor-pointer"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setPromoCode(promo.maCode)}
                    >
                      {promo.maCode} - Giảm {promo.phanTramGiam}%
                    </Badge>
                  ))}
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Points */}
          {user && user.diem_tich_luy > 0 && (
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">
                  <i className="bi bi-star me-2"></i>
                  Sử dụng điểm tích lũy
                </h5>
              </Card.Header>
              <Card.Body>
                <Form.Check
                  type="checkbox"
                  label={`Sử dụng ${user.diem_tich_luy} điểm (${formatCurrency(
                    user.diem_tich_luy * 1000
                  )})`}
                  checked={usePoints}
                  onChange={e => {
                    setUsePoints(e.target.checked);
                    applyPoints(e.target.checked ? user.diem_tich_luy : 0);
                  }}
                />
              </Card.Body>
            </Card>
          )}

          {/* Payment Method */}
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-wallet2 me-2"></i>
                Phương thức thanh toán
              </h5>
            </Card.Header>
            <Card.Body>
              <Form.Check
                type="radio"
                label={
                  <span>
                    <i className="bi bi-phone me-2"></i>VNPAY
                  </span>
                }
                name="payment"
                checked={paymentMethod === 'VNPAY'}
                onChange={() => setPaymentMethod('VNPAY')}
                className="mb-2"
              />
              <Form.Check
                type="radio"
                label={
                  <span>
                    <i className="bi bi-wallet me-2"></i>MoMo
                  </span>
                }
                name="payment"
                checked={paymentMethod === 'MOMO'}
                onChange={() => setPaymentMethod('MOMO')}
                className="mb-2"
              />
              <Form.Check
                type="radio"
                label={
                  <span>
                    <i className="bi bi-credit-card me-2"></i>ZaloPay
                  </span>
                }
                name="payment"
                checked={paymentMethod === 'ZALOPAY'}
                onChange={() => setPaymentMethod('ZALOPAY')}
              />
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="sticky-top" style={{ top: '20px' }}>
            <Card.Header className="bg-danger text-white">
              <h5 className="mb-0">Thông tin đơn hàng</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <h6>{showtime?.tenPhim}</h6>
                <small className="text-muted">
                  {showtime && new Date(showtime.thoiGianBatDau).toLocaleString('vi-VN')}
                </small>
              </div>

              <ListGroup variant="flush" className="mb-3">
                <ListGroup.Item className="px-0">
                  <div className="d-flex justify-content-between">
                    <span>
                      Vé ({bookingState.selected_seats.length} ghế)
                    </span>
                    <span>{formatCurrency(calculateTicketTotal())}</span>
                  </div>
                </ListGroup.Item>

                {bookingState.selected_services.length > 0 && (
                  <ListGroup.Item className="px-0">
                    <div className="d-flex justify-content-between">
                      <span>Dịch vụ F&B</span>
                      <span>{formatCurrency(calculateServiceTotal())}</span>
                    </div>
                  </ListGroup.Item>
                )}

                {calculateDiscount() > 0 && (
                  <ListGroup.Item className="px-0">
                    <div className="d-flex justify-content-between text-success">
                      <span>Giảm giá</span>
                      <span>-{formatCurrency(calculateDiscount())}</span>
                    </div>
                  </ListGroup.Item>
                )}

                {calculatePointsDiscount() > 0 && (
                  <ListGroup.Item className="px-0">
                    <div className="d-flex justify-content-between text-success">
                      <span>Điểm tích lũy</span>
                      <span>-{formatCurrency(calculatePointsDiscount())}</span>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>

              <div className="d-flex justify-content-between mb-3">
                <span className="h5">Tổng tiền:</span>
                <span className="h4 text-danger fw-bold">{formatCurrency(calculateTotal())}</span>
              </div>

              <Button variant="danger" size="lg" className="w-100" onClick={handlePayment}>
                <i className="bi bi-check-circle me-2"></i>
                Thanh toán
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, ListGroup, Badge, Alert } from 'react-bootstrap';
import { dichVuData, khuyenMaiData, suatChieuData, phimData, gheNgoiData } from '../../../data/mockData';
import { useBooking } from '../../contexts/BookingContext';
import { useAuth } from '../../contexts/AuthContext';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookingState, addService, updateServiceQuantity, applyPromoCode, applyPoints, clearBooking } = useBooking();

  const [selectedServices, setSelectedServices] = useState<{ id: string; quantity: number }[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [usePoints, setUsePoints] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('VNPAY');

  const showtime = suatChieuData.find(s => s.id === bookingState.suat_chieu_id);
  const movie = phimData.find(m => m.id === showtime?.phim_id);

  const calculateTicketTotal = () => {
    return bookingState.selected_seats.reduce((total, seatId) => {
      const seat = gheNgoiData.find(s => s.id === seatId);
      return total + (showtime?.gia_ve_co_ban || 0);
    }, 0);
  };

  const calculateServiceTotal = () => {
    return selectedServices.reduce((total, service) => {
      const dichVu = dichVuData.find(d => d.id === service.id);
      return total + (dichVu?.gia_ban || 0) * service.quantity;
    }, 0);
  };

  const calculateSubtotal = () => {
    return calculateTicketTotal() + calculateServiceTotal();
  };

  const calculateDiscount = () => {
    // Mock discount calculation
    if (promoCode) {
      const promo = khuyenMaiData.find(k => k.ma_code === promoCode);
      if (promo) {
        const discount = (calculateSubtotal() * promo.phan_tram_giam) / 100;
        return Math.min(discount, promo.giam_toi_da);
      }
    }
    return 0;
  };

  const calculatePointsDiscount = () => {
    if (usePoints && user) {
      return Math.min(user.diem_tich_luy * 1000, calculateSubtotal() * 0.1); // 1 point = 1000đ, max 10%
    }
    return 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() - calculatePointsDiscount();
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + 'đ';
  };

  const handleServiceChange = (serviceId: string, quantity: number) => {
    const existing = selectedServices.find(s => s.id === serviceId);
    if (existing) {
      if (quantity === 0) {
        setSelectedServices(selectedServices.filter(s => s.id !== serviceId));
      } else {
        setSelectedServices(
          selectedServices.map(s => (s.id === serviceId ? { ...s, quantity } : s))
        );
      }
    } else {
      setSelectedServices([...selectedServices, { id: serviceId, quantity }]);
    }
    updateServiceQuantity(serviceId, quantity);
  };

  const handlePayment = () => {
    // Mock payment
    alert('Thanh toán thành công! Mã vé đã được gửi vào email.');
    clearBooking();
    navigate('/profile');
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">
        <i className="bi bi-credit-card me-2"></i>
        Thanh toán
      </h2>

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
                {dichVuData.slice(0, 6).map(service => {
                  const selected = selectedServices.find(s => s.id === service.id);
                  return (
                    <Col md={6} key={service.id} className="mb-3">
                      <Card className="h-100">
                        <Row className="g-0">
                          <Col xs={4}>
                            <img
                              src={service.hinh_anh || ''}
                              alt={service.ten}
                              className="img-fluid rounded-start"
                              style={{ height: '100%', objectFit: 'cover' }}
                            />
                          </Col>
                          <Col xs={8}>
                            <Card.Body className="p-2">
                              <Card.Title className="h6">{service.ten}</Card.Title>
                              <div className="text-danger fw-bold mb-2">
                                {formatCurrency(service.gia_ban)}
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

              {promoCode && khuyenMaiData.find(k => k.ma_code === promoCode) && (
                <Alert variant="success" className="mt-3 mb-0">
                  <i className="bi bi-check-circle me-2"></i>
                  Áp dụng mã thành công! Giảm {formatCurrency(calculateDiscount())}
                </Alert>
              )}

              <div className="mt-3">
                <small className="text-muted">Mã khuyến mãi có sẵn:</small>
                <div className="d-flex gap-2 mt-2 flex-wrap">
                  {khuyenMaiData.map(promo => (
                    <Badge
                      key={promo.id}
                      bg="light"
                      text="dark"
                      className="p-2 cursor-pointer"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setPromoCode(promo.ma_code)}
                    >
                      {promo.ma_code} - Giảm {promo.phan_tram_giam}%
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
                <h6>{movie?.ten}</h6>
                <small className="text-muted">
                  {showtime?.thoi_gian_bat_dau.toLocaleString('vi-VN')}
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

                {selectedServices.length > 0 && (
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
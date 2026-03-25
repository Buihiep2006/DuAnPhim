import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Row, Col, Badge } from 'react-bootstrap';
import confetti from 'canvas-confetti';

declare global {
  interface Window {
    confetti: any;
  }
}

const BookingSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { invoice, bookingInfo } = (location.state as any) || {};

  useEffect(() => {
    if (!invoice) {
      navigate('/');
      return;
    }

    // Fire confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, [invoice, navigate]);

  if (!invoice) return null;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${invoice.maHoaDon || invoice.id}`;

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <div className="display-1 text-success mb-3">
          <i className="bi bi-check-circle-fill"></i>
        </div>
        <h1 className="fw-bold">Đặt vé thành công!</h1>
        <p className="lead text-muted">Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi.</p>
      </div>

      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="bg-danger p-3 text-white text-center">
              <h5 className="mb-0 fw-bold">VÉ XEM PHIM ĐIỆN TỬ</h5>
            </div>
            <Card.Body className="p-4">
              <div className="d-flex flex-column align-items-center mb-4">
                <div className="bg-white p-2 border shadow-sm rounded mb-2">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code Ticket" 
                    className="img-fluid"
                    style={{ width: '180px', height: '180px' }}
                  />
                </div>
                <div className="text-muted small">Mã hóa đơn: <span className="fw-bold">{invoice.maHoaDon}</span></div>
              </div>

              <div className="border-top border-bottom py-3 mb-4">
                <h4 className="fw-bold text-center text-primary mb-3">
                  {bookingInfo?.tenPhim || 'Thông tin phim'}
                </h4>
                <Row className="g-3">
                  <Col xs={6}>
                    <div className="text-muted small">Suất chiếu</div>
                    <div className="fw-bold">
                      {bookingInfo?.thoiGianBatDau ? new Date(bookingInfo.thoiGianBatDau).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}) : 'N/A'}
                    </div>
                  </Col>
                  <Col xs={6} className="text-end">
                    <div className="text-muted small">Ngày chiếu</div>
                    <div className="fw-bold">
                      {bookingInfo?.thoiGianBatDau ? new Date(bookingInfo.thoiGianBatDau).toLocaleDateString('vi-VN') : 'N/A'}
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="text-muted small">Rạp</div>
                    <div className="fw-bold">{bookingInfo?.tenRap || 'Cinema'}</div>
                  </Col>
                  <Col xs={6} className="text-end">
                    <div className="text-muted small">Phòng</div>
                    <div className="fw-bold">{bookingInfo?.tenPhongChieu || 'P1'}</div>
                  </Col>
                  <Col xs={12}>
                    <div className="text-muted small">Ghế ngồi ({bookingInfo?.selectedSeatsNames?.length || 0} ghế)</div>
                    <div className="d-flex gap-1 flex-wrap mt-1">
                      {bookingInfo?.selectedSeatsNames?.map((s: string) => (
                        <Badge key={s} bg="info" className="px-2 py-1">{s}</Badge>
                      )) || <Badge bg="info">Đã chọn</Badge>}
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Dịch vụ đã mua */}
              {bookingInfo?.selectedServices && bookingInfo.selectedServices.length > 0 && (
                <div className="mb-4">
                  <div className="text-muted small mb-2 text-uppercase fw-bold">Dịch vụ đã mua</div>
                  <div className="bg-light p-3 rounded">
                    {bookingInfo.selectedServices.map((s: any, idx: number) => (
                      <div key={idx} className="d-flex justify-content-between mb-1 small">
                        <span>{s.ten} x {s.soLuong}</span>
                        <span>{(s.thanhTien).toLocaleString('vi-VN')}đ</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Chi tiết chi phí */}
              <div className="mb-4">
                <div className="text-muted small mb-2 text-uppercase fw-bold">Chi tiết thanh toán</div>
                {bookingInfo?.chinhSachGiam && bookingInfo.chinhSachGiam.length > 0 && (
                   <div className="mb-2">
                     {bookingInfo.chinhSachGiam.map((item: any, idx: number) => (
                       <div key={idx} className="d-flex justify-content-between text-success small">
                         <span>{item.ten}:</span>
                         <span>-{(item.giam).toLocaleString('vi-VN')}đ</span>
                       </div>
                     ))}
                   </div>
                )}
                <div className="d-flex justify-content-between align-items-center">
                  <div className="fw-bold">Tổng cộng thanh toán:</div>
                  <div className="h4 mb-0 fw-bold text-danger">
                    {(invoice.tongTienThanhToan || 0).toLocaleString('vi-VN')}đ
                  </div>
                </div>
              </div>

              <div className="alert alert-warning small mb-0 border-0 shadow-sm">
                <i className="bi bi-info-circle me-2"></i>
                Vui lòng đưa mã QR này cho nhân viên tại quầy để nhận vé.
              </div>
            </Card.Body>
            <div className="card-footer bg-white border-0 p-3 pt-0 text-center pb-4">
              <hr className="mb-4 mt-0 opacity-10" />
              <div className="d-grid gap-2 d-md-block">
                <Button onClick={() => navigate('/')} variant="outline-danger" className="me-md-2 px-4">
                  <i className="bi bi-house-door me-1"></i> Quay về trang chủ
                </Button>
                <Button onClick={() => navigate('/profile')} variant="danger" className="px-4">
                  <i className="bi bi-clock-history me-1"></i> Lịch sử đặt vé
                </Button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingSuccessPage;

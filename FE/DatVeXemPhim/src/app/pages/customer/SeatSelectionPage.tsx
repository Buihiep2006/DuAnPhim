import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Badge, Alert, Spinner } from 'react-bootstrap';
import { useBooking } from '../../contexts/BookingContext';
import { GheNgoiWithDetails } from '../../../types/database.types';

const API = 'http://localhost:9999/api/admin';

export default function SeatSelectionPage() {
  const { showtimeId } = useParams<{ showtimeId: string }>();
  const navigate = useNavigate();
  const { bookingState, addSeat, removeSeat, clearSeats, setShowtime, remainingTime, startTimer } = useBooking();

  const [loading, setLoading] = useState(true);
  const [showtime, setLocalShowtime] = useState<any>(null);
  const [roomSeats, setRoomSeats] = useState<any[]>([]);
  const [soldSeats, setSoldSeats] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  useEffect(() => {
    if (showtimeId) {
      fetchInitialData();
    }
  }, [showtimeId]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const sRes = await fetch(`${API}/suat-chieu/${showtimeId}`);
      const sJson = await sRes.json();
      
      if (sJson.success && sJson.data) {
        const s = sJson.data;
        setLocalShowtime(s);
        setShowtime(s.id);
        startTimer(10);

        // Fetch seats for this room
        const seatsRes = await fetch(`${API}/ghe-ngoi/phong-chieu/${s.phongChieuId}`);
        const seatsJson = await seatsRes.json();
        if (seatsJson.success) setRoomSeats(seatsJson.data);

        // Fetch sold seats
        const soldRes = await fetch(`${API}/ve-ban/suat-chieu/${showtimeId}`);
        const soldJson = await soldRes.json();
        if (soldJson.success) {
          setSoldSeats(soldJson.data.map((v: any) => v.gheNgoiId));
        }
      }
    } catch (error) {
      console.error('Error fetching seat selection data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="danger" />
      </Container>
    );
  }

  if (!showtime) {
    return (
      <Container className="py-5 text-center">
        <h3>Không tìm thấy suất chiếu</h3>
        <Button variant="danger" onClick={() => navigate('/')}>
          Về trang chủ
        </Button>
      </Container>
    );
  }

  // Group seats by row
  const seatsByRow = roomSeats.reduce((acc, seat) => {
    const row = seat.hangGhe || 'Unknown';
    if (!acc[row]) {
      acc[row] = [];
    }
    acc[row].push(seat);
    return acc;
  }, {} as Record<string, typeof roomSeats>);

  const rows = Object.keys(seatsByRow).sort();

  const handleSeatClick = (seatId: string) => {
    if (soldSeats.includes(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
      removeSeat(seatId);
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
      addSeat(seatId);
    }
  };

  const getSeatClass = (seatId: string, loaiGheTen: string) => {
    if (soldSeats.includes(seatId)) return 'seat sold';
    if (selectedSeats.includes(seatId)) return 'seat selected';

    if (loaiGheTen === 'VIP') return 'seat available vip';
    if (loaiGheTen === 'COUPLE') return 'seat available couple';

    return 'seat available';
  };

  const calculateTotal = () => {
    let total = 0;
    selectedSeats.forEach(seatId => {
      const seat = roomSeats.find(s => s.id === seatId);
      if (seat) {
        total += (showtime.giaVeCoBan || 0) + (seat.phuThu || 0);
      }
    });
    return total;
  };

  const formatCurrency = (amount: number) => {
    return (amount || 0).toLocaleString('vi-VN') + 'đ';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleContinue = () => {
    navigate('/checkout');
  };

  return (
    <Container className="py-4">
      <Row>
        <Col lg={8}>
          <Card>
            <Card.Header className="bg-dark text-white">
              <Row className="align-items-center">
                <Col>
                  <h5 className="mb-0">Chọn ghế ngồi</h5>
                  <small>{showtime.tenRapChieu} - {showtime.tenPhongChieu}</small>
                </Col>
                <Col xs="auto">
                  {remainingTime > 0 && (
                    <Badge bg="danger" className="fs-6">
                      <i className="bi bi-clock me-2"></i>
                      {formatTime(remainingTime)}
                    </Badge>
                  )}
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              {/* Screen */}
              <div className="text-center mb-4">
                <div className="screen" style={{ maxWidth: '80%' }}></div>
                <small className="text-muted">Màn hình</small>
              </div>

              {/* Seats */}
              <div className="text-center">
                {rows.map(row => (
                  <div key={row} className="mb-2">
                    <Badge bg="secondary" className="me-2" style={{ width: '30px' }}>
                      {row}
                    </Badge>
                    {(seatsByRow[row] as any[])
                      .sort((a, b) => a.soThuTu - b.soThuTu)
                      .map(seat => (
                        <div
                          key={seat.id}
                          className={getSeatClass(seat.id, seat.loaiGheTen)}
                          onClick={() => handleSeatClick(seat.id)}
                          title={seat.maGhe}
                        >
                          {seat.soThuTu}
                        </div>
                      ))}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-4 d-flex justify-content-center gap-4 flex-wrap">
                <div className="d-flex align-items-center">
                  <div className="seat available me-2"></div>
                  <small>Ghế trống</small>
                </div>
                <div className="d-flex align-items-center">
                  <div className="seat selected me-2"></div>
                  <small>Ghế đang chọn</small>
                </div>
                <div className="d-flex align-items-center">
                  <div className="seat sold me-2"></div>
                  <small>Ghế đã bán</small>
                </div>
                <div className="d-flex align-items-center">
                  <div className="seat available vip me-2"></div>
                  <small>Ghế VIP (+30k)</small>
                </div>
                <div className="d-flex align-items-center">
                  <div className="seat available couple me-2"></div>
                  <small>Ghế đôi (+50k)</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="sticky-top" style={{ top: '20px' }}>
            <Card.Header className="bg-danger text-white">
              <h5 className="mb-0">Thông tin đặt vé</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <img
                  src={showtime.hinhAnhPoster || 'https://via.placeholder.com/300x450?text=No+Poster'}
                  alt={showtime.tenPhim}
                  className="img-fluid rounded mb-2"
                />
                <h6>{showtime.tenPhim}</h6>
                <div className="small text-muted">
                  <div>{showtime.tenRapChieu}</div>
                  <div>{showtime.tenPhongChieu}</div>
                  <div>
                    {new Date(showtime.thoiGianBatDau).toLocaleDateString('vi-VN')} -{' '}
                    {new Date(showtime.thoiGianBatDau).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>

              <hr />

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Ghế đã chọn:</span>
                  <span className="fw-bold">
                    {selectedSeats.length === 0
                      ? 'Chưa chọn'
                      : selectedSeats
                          .map(id => roomSeats.find(s => s.id === id)?.maGhe)
                          .join(', ')}
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Số lượng:</span>
                  <span className="fw-bold">{selectedSeats.length} ghế</span>
                </div>
              </div>

              <hr />

              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span className="h5">Tổng tiền:</span>
                  <span className="h5 text-danger fw-bold">
                    {formatCurrency(calculateTotal())}
                  </span>
                </div>
              </div>

              {selectedSeats.length === 0 && (
                <Alert variant="warning" className="small mb-3">
                  <i className="bi bi-info-circle me-2"></i>
                  Vui lòng chọn ghế
                </Alert>
              )}

              <Button
                variant="danger"
                size="lg"
                className="w-100"
                disabled={selectedSeats.length === 0}
                onClick={handleContinue}
              >
                <i className="bi bi-arrow-right-circle me-2"></i>
                Tiếp tục
              </Button>

              <Button
                variant="outline-secondary"
                className="w-100 mt-2"
                onClick={() => {
                  setSelectedSeats([]);
                  clearSeats();
                }}
              >
                Hủy chọn
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
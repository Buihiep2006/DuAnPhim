import React, { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Form, InputGroup, 
  Badge, Modal, Alert 
} from 'react-bootstrap';

interface Showtime {
  id: string;
  ma: string;
  phim_id: string;
  ten_phim: string;
  phong_chieu_id: string;
  ten_phong: string;
  ten_rap: string;
  thoi_gian_bat_dau: string;
  thoi_gian_ket_thuc: string;
  gia_ve_co_ban: number;
  trang_thai: number;
}

const AdminShowtimes: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCinema, setSelectedCinema] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showConflictAlert, setShowConflictAlert] = useState(false);

  // Mock data
  const mockShowtimes: Showtime[] = [
    {
      id: '1',
      ma: 'SC001',
      phim_id: '1',
      ten_phim: 'Avatar: The Way of Water',
      phong_chieu_id: '1',
      ten_phong: 'Phòng 1',
      ten_rap: 'CGV Vincom',
      thoi_gian_bat_dau: '2024-03-22 09:00',
      thoi_gian_ket_thuc: '2024-03-22 12:12',
      gia_ve_co_ban: 80000,
      trang_thai: 1
    },
    {
      id: '2',
      ma: 'SC002',
      phim_id: '1',
      ten_phim: 'Avatar: The Way of Water',
      phong_chieu_id: '1',
      ten_phong: 'Phòng 1',
      ten_rap: 'CGV Vincom',
      thoi_gian_bat_dau: '2024-03-22 13:00',
      thoi_gian_ket_thuc: '2024-03-22 16:12',
      gia_ve_co_ban: 90000,
      trang_thai: 1
    },
    {
      id: '3',
      ma: 'SC003',
      phim_id: '2',
      ten_phim: 'The Batman',
      phong_chieu_id: '2',
      ten_phong: 'Phòng 2',
      ten_rap: 'CGV Vincom',
      thoi_gian_bat_dau: '2024-03-22 10:30',
      thoi_gian_ket_thuc: '2024-03-22 13:26',
      gia_ve_co_ban: 85000,
      trang_thai: 1
    },
    {
      id: '4',
      ma: 'SC004',
      phim_id: '3',
      ten_phim: 'Doraemon: Nobita và Vùng Đất Lý Tưởng',
      phong_chieu_id: '3',
      ten_phong: 'Phòng 3',
      ten_rap: 'CGV Vincom',
      thoi_gian_bat_dau: '2024-03-22 09:30',
      thoi_gian_ket_thuc: '2024-03-22 11:18',
      gia_ve_co_ban: 70000,
      trang_thai: 1
    },
    {
      id: '5',
      ma: 'SC005',
      phim_id: '1',
      ten_phim: 'Avatar: The Way of Water',
      phong_chieu_id: '4',
      ten_phong: 'Phòng IMAX',
      ten_rap: 'Lotte Cinema',
      thoi_gian_bat_dau: '2024-03-22 18:00',
      thoi_gian_ket_thuc: '2024-03-22 21:12',
      gia_ve_co_ban: 120000,
      trang_thai: 1
    }
  ];

  const [showtimes] = useState<Showtime[]>(mockShowtimes);

  const cinemas = [
    { id: 'all', ten: 'Tất cả rạp' },
    { id: '1', ten: 'CGV Vincom' },
    { id: '2', ten: 'Lotte Cinema' },
    { id: '3', ten: 'Galaxy Cinema' }
  ];

  const rooms = [
    { id: '1', ten: 'Phòng 1', rap_id: '1' },
    { id: '2', ten: 'Phòng 2', rap_id: '1' },
    { id: '3', ten: 'Phòng 3', rap_id: '1' },
    { id: '4', ten: 'Phòng IMAX', rap_id: '2' }
  ];

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0: return <Badge bg="secondary">Đã hủy</Badge>;
      case 1: return <Badge bg="primary">Đã lên lịch</Badge>;
      case 2: return <Badge bg="success">Đang chiếu</Badge>;
      case 3: return <Badge bg="secondary">Đã kết thúc</Badge>;
      default: return <Badge bg="secondary">Không xác định</Badge>;
    }
  };

  const handleAddShowtime = () => {
    setShowModal(true);
  };

  const handleDeleteShowtime = (showtimeId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa suất chiếu này?')) {
      console.log('Delete showtime:', showtimeId);
    }
  };

  const checkConflict = () => {
    // Simple conflict detection logic
    setShowConflictAlert(true);
    setTimeout(() => setShowConflictAlert(false), 5000);
  };

  // Group showtimes by room
  const groupedShowtimes = showtimes.reduce((acc, showtime) => {
    const key = `${showtime.ten_rap} - ${showtime.ten_phong}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(showtime);
    return acc;
  }, {} as Record<string, Showtime[]>);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 fw-bold">Quản lý Lịch chiếu</h2>
          <p className="text-muted mb-0">Quản lý suất chiếu và lịch trình phim</p>
        </div>
        <Button variant="danger" onClick={handleAddShowtime}>
          <i className="bi bi-plus-circle me-2"></i>
          Thêm suất chiếu
        </Button>
      </div>

      {showConflictAlert && (
        <Alert variant="warning" dismissible onClose={() => setShowConflictAlert(false)}>
          <Alert.Heading>
            <i className="bi bi-exclamation-triangle me-2"></i>
            Phát hiện xung đột lịch chiếu!
          </Alert.Heading>
          <p className="mb-0">
            Phòng 1 có 2 suất chiếu trùng thời gian. Vui lòng kiểm tra lại.
          </p>
        </Alert>
      )}

      {/* Stats Cards */}
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Tổng suất chiếu hôm nay</p>
                  <h4 className="mb-0 fw-bold">{showtimes.length}</h4>
                </div>
                <div className="bg-primary bg-opacity-10 rounded p-2">
                  <i className="bi bi-calendar-event fs-5 text-primary"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Đang chiếu</p>
                  <h4 className="mb-0 fw-bold">{showtimes.filter(s => s.trang_thai === 2).length}</h4>
                </div>
                <div className="bg-success bg-opacity-10 rounded p-2">
                  <i className="bi bi-play-circle fs-5 text-success"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Đã lên lịch</p>
                  <h4 className="mb-0 fw-bold">{showtimes.filter(s => s.trang_thai === 1).length}</h4>
                </div>
                <div className="bg-info bg-opacity-10 rounded p-2">
                  <i className="bi bi-clock-history fs-5 text-info"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Phòng chiếu hoạt động</p>
                  <h4 className="mb-0 fw-bold">{rooms.length}</h4>
                </div>
                <div className="bg-warning bg-opacity-10 rounded p-2">
                  <i className="bi bi-door-open fs-5 text-warning"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3 align-items-center">
            <Col md={3}>
              <Form.Label className="mb-0 small">Ngày chiếu</Form.Label>
              <Form.Control 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Label className="mb-0 small">Rạp chiếu</Form.Label>
              <Form.Select 
                value={selectedCinema}
                onChange={(e) => setSelectedCinema(e.target.value)}
              >
                {cinemas.map(cinema => (
                  <option key={cinema.id} value={cinema.id}>{cinema.ten}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Label className="mb-0 small">Phòng chiếu</Form.Label>
              <Form.Select>
                <option>Tất cả phòng</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>{room.ten}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Label className="mb-0 small">&nbsp;</Form.Label>
              <Button variant="outline-danger" className="w-100" onClick={checkConflict}>
                <i className="bi bi-exclamation-triangle me-2"></i>
                Kiểm tra xung đột
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Timeline View by Room */}
      {Object.entries(groupedShowtimes).map(([roomKey, roomShowtimes]) => (
        <Card key={roomKey} className="border-0 shadow-sm mb-3">
          <Card.Header className="bg-white border-bottom">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-semibold">
                <i className="bi bi-door-open me-2"></i>
                {roomKey}
              </h6>
              <Badge bg="light" text="dark">{roomShowtimes.length} suất chiếu</Badge>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th style={{ width: '80px' }}>Mã</th>
                    <th>Phim</th>
                    <th className="text-center">Giờ bắt đầu</th>
                    <th className="text-center">Giờ kết thúc</th>
                    <th className="text-end">Giá vé</th>
                    <th className="text-center">Trạng thái</th>
                    <th className="text-center" style={{ width: '120px' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {roomShowtimes
                    .sort((a, b) => a.thoi_gian_bat_dau.localeCompare(b.thoi_gian_bat_dau))
                    .map((showtime) => (
                    <tr key={showtime.id}>
                      <td>
                        <span className="badge bg-light text-dark border">{showtime.ma}</span>
                      </td>
                      <td>
                        <div className="fw-semibold">{showtime.ten_phim}</div>
                      </td>
                      <td className="text-center">
                        <Badge bg="success">
                          <i className="bi bi-clock me-1"></i>
                          {showtime.thoi_gian_bat_dau.split(' ')[1]}
                        </Badge>
                      </td>
                      <td className="text-center">
                        <Badge bg="danger">
                          <i className="bi bi-clock me-1"></i>
                          {showtime.thoi_gian_ket_thuc.split(' ')[1]}
                        </Badge>
                      </td>
                      <td className="text-end fw-semibold">
                        {showtime.gia_ve_co_ban.toLocaleString('vi-VN')} ₫
                      </td>
                      <td className="text-center">{getStatusBadge(showtime.trang_thai)}</td>
                      <td className="text-center">
                        <Button variant="outline-primary" size="sm" className="me-1">
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button variant="outline-info" size="sm" className="me-1">
                          <i className="bi bi-eye"></i>
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteShowtime(showtime.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      ))}

      {/* Add Showtime Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Thêm suất chiếu mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Chọn phim</Form.Label>
                  <Form.Select>
                    <option>-- Chọn phim --</option>
                    <option>Avatar: The Way of Water</option>
                    <option>The Batman</option>
                    <option>Doraemon: Nobita và Vùng Đất Lý Tưởng</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Rạp chiếu</Form.Label>
                  <Form.Select>
                    <option>-- Chọn rạp --</option>
                    <option>CGV Vincom</option>
                    <option>Lotte Cinema</option>
                    <option>Galaxy Cinema</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phòng chiếu</Form.Label>
                  <Form.Select>
                    <option>-- Chọn phòng --</option>
                    <option>Phòng 1</option>
                    <option>Phòng 2</option>
                    <option>Phòng 3</option>
                    <option>Phòng IMAX</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ngày chiếu</Form.Label>
                  <Form.Control type="date" />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giờ bắt đầu</Form.Label>
                  <Form.Control type="time" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giá vé cơ bản</Form.Label>
                  <InputGroup>
                    <Form.Control type="number" placeholder="80000" />
                    <InputGroup.Text>₫</InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>

            <Alert variant="info" className="mb-0">
              <i className="bi bi-info-circle me-2"></i>
              Thời gian kết thúc sẽ được tính tự động dựa trên thời lượng phim (192 phút) + 15 phút dọn dẹp.
            </Alert>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="danger">
            <i className="bi bi-check-circle me-2"></i>
            Tạo suất chiếu
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminShowtimes;

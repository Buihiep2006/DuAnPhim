import React, { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Form, InputGroup, 
  Badge, Modal, Tabs, Tab, Alert 
} from 'react-bootstrap';

interface Cinema {
  id: string;
  ma: string;
  ten: string;
  dia_chi: string;
  khu_vuc: string;
  mo_ta: string;
  trang_thai: number;
  so_phong: number;
}

interface Room {
  id: string;
  rap_chieu_id: string;
  ma: string;
  ten: string;
  suc_chua: number;
  loai_may_chieu: string;
  trang_thai: number;
  so_ghe: number;
}

const AdminCinemas: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cinemas' | 'rooms' | 'seats'>('cinemas');
  const [showCinemaModal, setShowCinemaModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showSeatMapModal, setShowSeatMapModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Mock data
  const mockCinemas: Cinema[] = [
    {
      id: '1',
      ma: 'CGV-001',
      ten: 'CGV Vincom Center',
      dia_chi: '72 Lê Thánh Tôn, Quận 1, TP.HCM',
      khu_vuc: 'Quận 1',
      mo_ta: 'Rạp chiếu phim hiện đại tại trung tâm TP.HCM',
      trang_thai: 1,
      so_phong: 8
    },
    {
      id: '2',
      ma: 'LOT-001',
      ten: 'Lotte Cinema Cộng Hòa',
      dia_chi: '180 Cộng Hòa, Tân Bình, TP.HCM',
      khu_vuc: 'Tân Bình',
      mo_ta: 'Hệ thống rạp chiếu phim Lotte Cinema',
      trang_thai: 1,
      so_phong: 10
    },
    {
      id: '3',
      ma: 'GAL-001',
      ten: 'Galaxy Cinema Nguyễn Du',
      dia_chi: '116 Nguyễn Du, Quận 1, TP.HCM',
      khu_vuc: 'Quận 1',
      mo_ta: 'Rạp chiếu phim Galaxy Cinema',
      trang_thai: 1,
      so_phong: 6
    }
  ];

  const mockRooms: Room[] = [
    {
      id: '1',
      rap_chieu_id: '1',
      ma: 'P1',
      ten: 'Phòng 1',
      suc_chua: 120,
      loai_may_chieu: '2D',
      trang_thai: 1,
      so_ghe: 120
    },
    {
      id: '2',
      rap_chieu_id: '1',
      ma: 'P2',
      ten: 'Phòng 2',
      suc_chua: 150,
      loai_may_chieu: '3D',
      trang_thai: 1,
      so_ghe: 150
    },
    {
      id: '3',
      rap_chieu_id: '1',
      ma: 'IMAX',
      ten: 'Phòng IMAX',
      suc_chua: 200,
      loai_may_chieu: 'IMAX',
      trang_thai: 1,
      so_ghe: 200
    },
    {
      id: '4',
      rap_chieu_id: '2',
      ma: 'P1',
      ten: 'Phòng 1',
      suc_chua: 100,
      loai_may_chieu: '2D',
      trang_thai: 1,
      so_ghe: 100
    }
  ];

  const [cinemas] = useState<Cinema[]>(mockCinemas);
  const [rooms] = useState<Room[]>(mockRooms);

  // Seat map generator
  const generateSeatMap = (rows: number, cols: number) => {
    const rowLabels = 'ABCDEFGHIJ';
    const seats = [];
    
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 1; j <= cols; j++) {
        const isVIP = i >= 5; // Last 5 rows are VIP
        const isAisle = j === Math.floor(cols / 2); // Middle aisle
        row.push({
          id: `${rowLabels[i]}${j}`,
          row: rowLabels[i],
          col: j,
          type: isVIP ? 'VIP' : 'Thường',
          status: 'available',
          isAisle
        });
      }
      seats.push(row);
    }
    return seats;
  };

  const [seatMap] = useState(generateSeatMap(10, 12));

  const handleViewSeatMap = (room: Room) => {
    setSelectedRoom(room);
    setShowSeatMapModal(true);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 fw-bold">Quản lý Rạp & Phòng chiếu</h2>
          <p className="text-muted mb-0">Quản lý hệ thống rạp chiếu và sơ đồ ghế</p>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Tổng số rạp</p>
                  <h4 className="mb-0 fw-bold">{cinemas.length}</h4>
                </div>
                <div className="bg-primary bg-opacity-10 rounded p-2">
                  <i className="bi bi-building fs-5 text-primary"></i>
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
                  <p className="text-muted mb-1 small">Tổng phòng chiếu</p>
                  <h4 className="mb-0 fw-bold">{rooms.length}</h4>
                </div>
                <div className="bg-success bg-opacity-10 rounded p-2">
                  <i className="bi bi-door-open fs-5 text-success"></i>
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
                  <p className="text-muted mb-1 small">Tổng ghế ngồi</p>
                  <h4 className="mb-0 fw-bold">{rooms.reduce((sum, r) => sum + r.so_ghe, 0)}</h4>
                </div>
                <div className="bg-warning bg-opacity-10 rounded p-2">
                  <i className="bi bi-chair fs-5 text-warning"></i>
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
                  <p className="text-muted mb-1 small">Phòng IMAX/4DX</p>
                  <h4 className="mb-0 fw-bold">
                    {rooms.filter(r => ['IMAX', '4DX'].includes(r.loai_may_chieu)).length}
                  </h4>
                </div>
                <div className="bg-danger bg-opacity-10 rounded p-2">
                  <i className="bi bi-badge-3d fs-5 text-danger"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs */}
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k as 'cinemas' | 'rooms' | 'seats')}
            className="mb-3"
          >
            {/* Cinemas Tab */}
            <Tab eventKey="cinemas" title={<><i className="bi bi-building me-2"></i>Rạp chiếu</>}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <InputGroup style={{ width: '400px' }}>
                  <InputGroup.Text>
                    <i className="bi bi-search"></i>
                  </InputGroup.Text>
                  <Form.Control placeholder="Tìm kiếm rạp..." />
                </InputGroup>
                <Button variant="danger" onClick={() => setShowCinemaModal(true)}>
                  <i className="bi bi-plus-circle me-2"></i>
                  Thêm rạp mới
                </Button>
              </div>

              <Table hover responsive>
                <thead className="bg-light">
                  <tr>
                    <th>Mã</th>
                    <th>Tên rạp</th>
                    <th>Địa chỉ</th>
                    <th>Khu vực</th>
                    <th className="text-center">Số phòng</th>
                    <th className="text-center">Trạng thái</th>
                    <th className="text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {cinemas.map((cinema) => (
                    <tr key={cinema.id}>
                      <td><Badge bg="light" text="dark" className="border">{cinema.ma}</Badge></td>
                      <td className="fw-semibold">{cinema.ten}</td>
                      <td>{cinema.dia_chi}</td>
                      <td><Badge bg="info">{cinema.khu_vuc}</Badge></td>
                      <td className="text-center">
                        <Badge bg="primary">{cinema.so_phong} phòng</Badge>
                      </td>
                      <td className="text-center">
                        <Badge bg={cinema.trang_thai === 1 ? 'success' : 'secondary'}>
                          {cinema.trang_thai === 1 ? 'Hoạt động' : 'Ngừng hoạt động'}
                        </Badge>
                      </td>
                      <td className="text-center">
                        <Button variant="outline-primary" size="sm" className="me-1">
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button variant="outline-info" size="sm" className="me-1">
                          <i className="bi bi-eye"></i>
                        </Button>
                        <Button variant="outline-danger" size="sm">
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>

            {/* Rooms Tab */}
            <Tab eventKey="rooms" title={<><i className="bi bi-door-open me-2"></i>Phòng chiếu</>}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex gap-2">
                  <Form.Select style={{ width: '200px' }}>
                    <option>Tất cả rạp</option>
                    {cinemas.map(c => (
                      <option key={c.id} value={c.id}>{c.ten}</option>
                    ))}
                  </Form.Select>
                  <Form.Select style={{ width: '200px' }}>
                    <option>Tất cả loại</option>
                    <option>2D</option>
                    <option>3D</option>
                    <option>IMAX</option>
                    <option>4DX</option>
                  </Form.Select>
                </div>
                <Button variant="danger" onClick={() => setShowRoomModal(true)}>
                  <i className="bi bi-plus-circle me-2"></i>
                  Thêm phòng chiếu
                </Button>
              </div>

              <Table hover responsive>
                <thead className="bg-light">
                  <tr>
                    <th>Mã</th>
                    <th>Tên phòng</th>
                    <th>Rạp</th>
                    <th className="text-center">Loại máy chiếu</th>
                    <th className="text-center">Sức chứa</th>
                    <th className="text-center">Số ghế</th>
                    <th className="text-center">Trạng thái</th>
                    <th className="text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => {
                    const cinema = cinemas.find(c => c.id === room.rap_chieu_id);
                    return (
                      <tr key={room.id}>
                        <td><Badge bg="light" text="dark" className="border">{room.ma}</Badge></td>
                        <td className="fw-semibold">{room.ten}</td>
                        <td>{cinema?.ten}</td>
                        <td className="text-center">
                          <Badge bg={
                            room.loai_may_chieu === 'IMAX' ? 'danger' :
                            room.loai_may_chieu === '4DX' ? 'warning' :
                            room.loai_may_chieu === '3D' ? 'info' : 'secondary'
                          }>
                            {room.loai_may_chieu}
                          </Badge>
                        </td>
                        <td className="text-center">{room.suc_chua} người</td>
                        <td className="text-center">
                          <Badge bg="primary">{room.so_ghe} ghế</Badge>
                        </td>
                        <td className="text-center">
                          <Badge bg={room.trang_thai === 1 ? 'success' : 'secondary'}>
                            {room.trang_thai === 1 ? 'Hoạt động' : 'Bảo trì'}
                          </Badge>
                        </td>
                        <td className="text-center">
                          <Button 
                            variant="outline-success" 
                            size="sm" 
                            className="me-1"
                            onClick={() => handleViewSeatMap(room)}
                          >
                            <i className="bi bi-grid-3x3"></i>
                          </Button>
                          <Button variant="outline-primary" size="sm" className="me-1">
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button variant="outline-danger" size="sm">
                            <i className="bi bi-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Tab>

            {/* Seat Types Tab */}
            <Tab eventKey="seats" title={<><i className="bi bi-chair me-2"></i>Loại ghế</>}>
              <Alert variant="info">
                <i className="bi bi-info-circle me-2"></i>
                Quản lý các loại ghế và mức phụ thu cho từng loại
              </Alert>

              <Table hover>
                <thead className="bg-light">
                  <tr>
                    <th>Mã loại ghế</th>
                    <th>Tên loại ghế</th>
                    <th className="text-end">Phụ thu</th>
                    <th>Mô tả</th>
                    <th className="text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><Badge bg="light" text="dark" className="border">STANDARD</Badge></td>
                    <td className="fw-semibold">Ghế thường</td>
                    <td className="text-end">0 ₫</td>
                    <td>Ghế ngồi tiêu chuẩn</td>
                    <td className="text-center">
                      <Button variant="outline-primary" size="sm" className="me-1">
                        <i className="bi bi-pencil"></i>
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td><Badge bg="warning">VIP</Badge></td>
                    <td className="fw-semibold">Ghế VIP</td>
                    <td className="text-end">20,000 ₫</td>
                    <td>Ghế VIP cao cấp, rộng rãi hơn</td>
                    <td className="text-center">
                      <Button variant="outline-primary" size="sm" className="me-1">
                        <i className="bi bi-pencil"></i>
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td><Badge bg="danger">COUPLE</Badge></td>
                    <td className="fw-semibold">Ghế đôi</td>
                    <td className="text-end">30,000 ₫</td>
                    <td>Ghế đôi cho 2 người, không có tay vịn giữa</td>
                    <td className="text-center">
                      <Button variant="outline-primary" size="sm" className="me-1">
                        <i className="bi bi-pencil"></i>
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      {/* Seat Map Modal */}
      <Modal show={showSeatMapModal} onHide={() => setShowSeatMapModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            Sơ đồ ghế - {selectedRoom?.ten}
            <Badge bg="info" className="ms-2">{selectedRoom?.loai_may_chieu}</Badge>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <div className="bg-secondary text-white py-2 px-4 d-inline-block rounded">
              <i className="bi bi-tv me-2"></i>
              MÀN HÌNH
            </div>
          </div>

          <div className="d-flex justify-content-center mb-3">
            <div className="d-flex gap-4">
              <div><i className="bi bi-square text-secondary me-2"></i>Ghế thường</div>
              <div><i className="bi bi-square text-warning me-2"></i>Ghế VIP</div>
              <div><i className="bi bi-square text-success me-2"></i>Đã chọn</div>
              <div><i className="bi bi-square text-danger me-2"></i>Đã đặt</div>
              <div><i className="bi bi-square text-muted me-2"></i>Hỏng</div>
            </div>
          </div>

          <div className="seat-map-container p-4 bg-light rounded">
            {seatMap.map((row, rowIndex) => (
              <div key={rowIndex} className="d-flex justify-content-center mb-2">
                <div className="text-muted me-3 fw-semibold" style={{ width: 30 }}>
                  {row[0].row}
                </div>
                {row.map((seat, colIndex) => (
                  <React.Fragment key={colIndex}>
                    {seat.isAisle && <div style={{ width: 20 }}></div>}
                    <button
                      className={`btn btn-sm me-1 ${
                        seat.type === 'VIP' ? 'btn-warning' : 'btn-outline-secondary'
                      }`}
                      style={{ 
                        width: 35, 
                        height: 35,
                        padding: 0,
                        fontSize: '10px'
                      }}
                      title={seat.id}
                    >
                      {seat.col}
                    </button>
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-4 text-center text-muted">
            <small>Click vào ghế để chỉnh sửa trạng thái hoặc loại ghế</small>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSeatMapModal(false)}>
            Đóng
          </Button>
          <Button variant="danger">
            <i className="bi bi-save me-2"></i>
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Cinema Modal */}
      <Modal show={showCinemaModal} onHide={() => setShowCinemaModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm rạp chiếu mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Mã rạp</Form.Label>
              <Form.Control type="text" placeholder="CGV-001" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tên rạp</Form.Label>
              <Form.Control type="text" placeholder="CGV Vincom..." />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control type="text" placeholder="72 Lê Thánh Tôn..." />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Khu vực</Form.Label>
              <Form.Select>
                <option>Quận 1</option>
                <option>Quận 2</option>
                <option>Quận 3</option>
                <option>Tân Bình</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCinemaModal(false)}>
            Hủy
          </Button>
          <Button variant="danger">Thêm rạp</Button>
        </Modal.Footer>
      </Modal>

      {/* Add Room Modal */}
      <Modal show={showRoomModal} onHide={() => setShowRoomModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm phòng chiếu mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Rạp chiếu</Form.Label>
              <Form.Select>
                {cinemas.map(c => (
                  <option key={c.id} value={c.id}>{c.ten}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mã phòng</Form.Label>
              <Form.Control type="text" placeholder="P1" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tên phòng</Form.Label>
              <Form.Control type="text" placeholder="Phòng 1" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Loại máy chiếu</Form.Label>
              <Form.Select>
                <option>2D</option>
                <option>3D</option>
                <option>IMAX</option>
                <option>4DX</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Sức chứa</Form.Label>
              <Form.Control type="number" placeholder="120" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRoomModal(false)}>
            Hủy
          </Button>
          <Button variant="danger">Thêm phòng</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminCinemas;

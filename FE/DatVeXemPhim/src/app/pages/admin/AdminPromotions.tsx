import React, { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Form, InputGroup, 
  Badge, Modal, ProgressBar 
} from 'react-bootstrap';

interface Promotion {
  id: string;
  ma_code: string;
  ten: string;
  phan_tram_giam: number;
  giam_toi_da: number;
  so_luong: number;
  so_luong_da_dung: number;
  thoi_gian_bat_dau: string;
  thoi_gian_ket_thuc: string;
  mo_ta: string;
  trang_thai: number;
  hang_thanh_vien: string | null;
}

const AdminPromotions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const mockPromotions: Promotion[] = [
    {
      id: '1',
      ma_code: 'NEWUSER2024',
      ten: 'Ưu đãi thành viên mới',
      phan_tram_giam: 20,
      giam_toi_da: 50000,
      so_luong: 1000,
      so_luong_da_dung: 245,
      thoi_gian_bat_dau: '2024-01-01',
      thoi_gian_ket_thuc: '2024-12-31',
      mo_ta: 'Giảm 20% cho thành viên mới, tối đa 50.000đ',
      trang_thai: 1,
      hang_thanh_vien: null
    },
    {
      id: '2',
      ma_code: 'GOLDVIP',
      ten: 'Ưu đãi Gold VIP',
      phan_tram_giam: 15,
      giam_toi_da: 100000,
      so_luong: 500,
      so_luong_da_dung: 120,
      thoi_gian_bat_dau: '2024-01-01',
      thoi_gian_ket_thuc: '2024-06-30',
      mo_ta: 'Giảm 15% cho thành viên Gold',
      trang_thai: 1,
      hang_thanh_vien: 'Gold'
    },
    {
      id: '3',
      ma_code: 'WEEKEND50',
      ten: 'Cuối tuần vui vẻ',
      phan_tram_giam: 10,
      giam_toi_da: 30000,
      so_luong: 2000,
      so_luong_da_dung: 1850,
      thoi_gian_bat_dau: '2024-03-01',
      thoi_gian_ket_thuc: '2024-03-31',
      mo_ta: 'Giảm 10% cho vé cuối tuần',
      trang_thai: 1,
      hang_thanh_vien: null
    },
    {
      id: '4',
      ma_code: 'BIRTHDAY',
      ten: 'Sinh nhật vui vẻ',
      phan_tram_giam: 25,
      giam_toi_da: 75000,
      so_luong: 100,
      so_luong_da_dung: 68,
      thoi_gian_bat_dau: '2024-01-01',
      thoi_gian_ket_thuc: '2024-12-31',
      mo_ta: 'Giảm 25% trong tháng sinh nhật',
      trang_thai: 1,
      hang_thanh_vien: null
    },
    {
      id: '5',
      ma_code: 'STUDENT2024',
      ten: 'Ưu đãi sinh viên',
      phan_tram_giam: 15,
      giam_toi_da: 40000,
      so_luong: 500,
      so_luong_da_dung: 500,
      thoi_gian_bat_dau: '2024-01-01',
      thoi_gian_ket_thuc: '2024-02-28',
      mo_ta: 'Giảm 15% cho sinh viên',
      trang_thai: 0,
      hang_thanh_vien: null
    }
  ];

  const [promotions] = useState<Promotion[]>(mockPromotions);

  const filteredPromotions = promotions.filter(promo => {
    const matchesSearch = 
      promo.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.ma_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || promo.trang_thai.toString() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getUsagePercent = (used: number, total: number) => {
    return (used / total) * 100;
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 fw-bold">Quản lý Khuyến mãi</h2>
          <p className="text-muted mb-0">Quản lý mã giảm giá và chương trình khuyến mãi</p>
        </div>
        <Button variant="danger" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-circle me-2"></i>
          Tạo khuyến mãi
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Tổng khuyến mãi</p>
                  <h4 className="mb-0 fw-bold">{promotions.length}</h4>
                </div>
                <div className="bg-primary bg-opacity-10 rounded p-2">
                  <i className="bi bi-tag fs-5 text-primary"></i>
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
                  <p className="text-muted mb-1 small">Đang hoạt động</p>
                  <h4 className="mb-0 fw-bold">
                    {promotions.filter(p => p.trang_thai === 1).length}
                  </h4>
                </div>
                <div className="bg-success bg-opacity-10 rounded p-2">
                  <i className="bi bi-check-circle fs-5 text-success"></i>
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
                  <p className="text-muted mb-1 small">Tổng mã đã dùng</p>
                  <h4 className="mb-0 fw-bold">
                    {promotions.reduce((sum, p) => sum + p.so_luong_da_dung, 0)}
                  </h4>
                </div>
                <div className="bg-warning bg-opacity-10 rounded p-2">
                  <i className="bi bi-graph-up fs-5 text-warning"></i>
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
                  <p className="text-muted mb-1 small">Tổng giảm giá</p>
                  <h4 className="mb-0 fw-bold">125M</h4>
                </div>
                <div className="bg-danger bg-opacity-10 rounded p-2">
                  <i className="bi bi-currency-dollar fs-5 text-danger"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Tìm kiếm khuyến mãi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="1">Đang hoạt động</option>
                <option value="0">Đã kết thúc</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Promotions Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Mã khuyến mãi</th>
                  <th>Tên chương trình</th>
                  <th className="text-center">Giảm giá</th>
                  <th className="text-center">Số lượng</th>
                  <th>Thời gian</th>
                  <th className="text-center">Đối tượng</th>
                  <th className="text-center">Trạng thái</th>
                  <th className="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredPromotions.map((promo) => (
                  <tr key={promo.id}>
                    <td>
                      <Badge bg="danger" className="font-monospace">
                        {promo.ma_code}
                      </Badge>
                    </td>
                    <td>
                      <div className="fw-semibold">{promo.ten}</div>
                      <small className="text-muted">{promo.mo_ta}</small>
                    </td>
                    <td className="text-center">
                      <div className="fw-bold text-danger">{promo.phan_tram_giam}%</div>
                      <small className="text-muted">
                        Tối đa {(promo.giam_toi_da / 1000).toFixed(0)}K
                      </small>
                    </td>
                    <td className="text-center">
                      <div className="mb-1">
                        <Badge bg="primary">
                          {promo.so_luong_da_dung} / {promo.so_luong}
                        </Badge>
                      </div>
                      <ProgressBar 
                        now={getUsagePercent(promo.so_luong_da_dung, promo.so_luong)}
                        variant={
                          getUsagePercent(promo.so_luong_da_dung, promo.so_luong) >= 90 ? 'danger' :
                          getUsagePercent(promo.so_luong_da_dung, promo.so_luong) >= 50 ? 'warning' : 'success'
                        }
                        style={{ height: 6 }}
                      />
                    </td>
                    <td>
                      <div className="small">
                        <div>
                          <i className="bi bi-calendar-check me-1 text-success"></i>
                          {promo.thoi_gian_bat_dau}
                        </div>
                        <div>
                          <i className="bi bi-calendar-x me-1 text-danger"></i>
                          {promo.thoi_gian_ket_thuc}
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      {promo.hang_thanh_vien ? (
                        <Badge bg="warning" text="dark">{promo.hang_thanh_vien}</Badge>
                      ) : (
                        <Badge bg="light" text="dark" className="border">Tất cả</Badge>
                      )}
                    </td>
                    <td className="text-center">
                      {isExpired(promo.thoi_gian_ket_thuc) ? (
                        <Badge bg="secondary">Đã hết hạn</Badge>
                      ) : promo.so_luong_da_dung >= promo.so_luong ? (
                        <Badge bg="warning">Hết lượt</Badge>
                      ) : promo.trang_thai === 1 ? (
                        <Badge bg="success">Đang hoạt động</Badge>
                      ) : (
                        <Badge bg="secondary">Đã tắt</Badge>
                      )}
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
          </div>
        </Card.Body>
      </Card>

      {/* Add Promotion Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Tạo khuyến mãi mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mã khuyến mãi</Form.Label>
                  <Form.Control type="text" placeholder="NEWUSER2024" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên chương trình</Form.Label>
                  <Form.Control type="text" placeholder="Ưu đãi thành viên mới" />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phần trăm giảm (%)</Form.Label>
                  <Form.Control type="number" placeholder="20" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giảm tối đa (VND)</Form.Label>
                  <InputGroup>
                    <Form.Control type="number" placeholder="50000" />
                    <InputGroup.Text>₫</InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Số lượng mã</Form.Label>
                  <Form.Control type="number" placeholder="1000" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Đối tượng áp dụng</Form.Label>
                  <Form.Select>
                    <option>Tất cả thành viên</option>
                    <option>Bronze</option>
                    <option>Silver</option>
                    <option>Gold</option>
                    <option>Platinum</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ngày bắt đầu</Form.Label>
                  <Form.Control type="date" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ngày kết thúc</Form.Label>
                  <Form.Control type="date" />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Mô tả chi tiết..." />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="danger">Tạo khuyến mãi</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminPromotions;

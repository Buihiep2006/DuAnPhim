import React, { useState } from 'react';
import { 
  Row, Col, Card, Button, Form, InputGroup, 
  Badge, Modal 
} from 'react-bootstrap';

interface Service {
  id: string;
  ma: string;
  ten: string;
  loai_dich_vu: string;
  gia_ban: number;
  hinh_anh: string;
  mo_ta: string;
  trang_thai: number;
}

const AdminServices: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const mockServices: Service[] = [
    {
      id: '1',
      ma: 'CB001',
      ten: 'Combo 1 - Bắp nước vừa',
      loai_dich_vu: 'Combo',
      gia_ban: 85000,
      hinh_anh: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400',
      mo_ta: '1 bắp rang bơ vừa + 1 nước ngọt vừa',
      trang_thai: 1
    },
    {
      id: '2',
      ma: 'CB002',
      ten: 'Combo 2 - Bắp nước lớn',
      loai_dich_vu: 'Combo',
      gia_ban: 115000,
      hinh_anh: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=400',
      mo_ta: '1 bắp rang bơ lớn + 2 nước ngọt lớn',
      trang_thai: 1
    },
    {
      id: '3',
      ma: 'BAP001',
      ten: 'Bắp rang bơ vừa',
      loai_dich_vu: 'Bắp',
      gia_ban: 45000,
      hinh_anh: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400',
      mo_ta: 'Bắp rang bơ size vừa',
      trang_thai: 1
    },
    {
      id: '4',
      ma: 'NUOC001',
      ten: 'Coca Cola',
      loai_dich_vu: 'Nước',
      gia_ban: 30000,
      hinh_anh: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
      mo_ta: 'Coca Cola size vừa',
      trang_thai: 1
    },
    {
      id: '5',
      ma: 'NUOC002',
      ten: 'Pepsi',
      loai_dich_vu: 'Nước',
      gia_ban: 30000,
      hinh_anh: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400',
      mo_ta: 'Pepsi size vừa',
      trang_thai: 1
    },
    {
      id: '6',
      ma: 'SN001',
      ten: 'Khoai tây chiên',
      loai_dich_vu: 'Snack',
      gia_ban: 35000,
      hinh_anh: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400',
      mo_ta: 'Khoai tây chiên giòn',
      trang_thai: 1
    }
  ];

  const [services] = useState<Service[]>(mockServices);

  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.ma.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || service.loai_dich_vu === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Combo': return 'danger';
      case 'Bắp': return 'warning';
      case 'Nước': return 'info';
      case 'Snack': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 fw-bold">Quản lý Dịch vụ F&B</h2>
          <p className="text-muted mb-0">Quản lý combo bắp nước và các dịch vụ</p>
        </div>
        <Button variant="danger" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-circle me-2"></i>
          Thêm dịch vụ
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Tổng dịch vụ</p>
                  <h4 className="mb-0 fw-bold">{services.length}</h4>
                </div>
                <div className="bg-primary bg-opacity-10 rounded p-2">
                  <i className="bi bi-cup-straw fs-5 text-primary"></i>
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
                  <p className="text-muted mb-1 small">Combo</p>
                  <h4 className="mb-0 fw-bold">
                    {services.filter(s => s.loai_dich_vu === 'Combo').length}
                  </h4>
                </div>
                <div className="bg-danger bg-opacity-10 rounded p-2">
                  <i className="bi bi-box fs-5 text-danger"></i>
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
                  <p className="text-muted mb-1 small">Bắp & Nước</p>
                  <h4 className="mb-0 fw-bold">
                    {services.filter(s => ['Bắp', 'Nước'].includes(s.loai_dich_vu)).length}
                  </h4>
                </div>
                <div className="bg-warning bg-opacity-10 rounded p-2">
                  <i className="bi bi-bucket fs-5 text-warning"></i>
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
                  <p className="text-muted mb-1 small">Doanh thu F&B</p>
                  <h4 className="mb-0 fw-bold">45M</h4>
                </div>
                <div className="bg-success bg-opacity-10 rounded p-2">
                  <i className="bi bi-currency-dollar fs-5 text-success"></i>
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
                  placeholder="Tìm kiếm dịch vụ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">Tất cả loại</option>
                <option value="Combo">Combo</option>
                <option value="Bắp">Bắp rang</option>
                <option value="Nước">Nước giải khát</option>
                <option value="Snack">Snack</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Services Grid */}
      <Row className="g-4">
        {filteredServices.map((service) => (
          <Col key={service.id} md={4} lg={3}>
            <Card className="border-0 shadow-sm h-100">
              <div 
                style={{ 
                  height: 200, 
                  backgroundImage: `url(${service.hinh_anh})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}
              >
                <Badge 
                  bg={getTypeColor(service.loai_dich_vu)}
                  style={{ position: 'absolute', top: 10, right: 10 }}
                >
                  {service.loai_dich_vu}
                </Badge>
              </div>
              <Card.Body>
                <div className="mb-2">
                  <Badge bg="light" text="dark" className="border me-2">{service.ma}</Badge>
                  <Badge bg={service.trang_thai === 1 ? 'success' : 'secondary'}>
                    {service.trang_thai === 1 ? 'Còn hàng' : 'Hết hàng'}
                  </Badge>
                </div>
                <h6 className="fw-semibold mb-2">{service.ten}</h6>
                <p className="text-muted small mb-3">{service.mo_ta}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-danger fw-bold fs-5">
                      {service.gia_ban.toLocaleString('vi-VN')} ₫
                    </div>
                  </div>
                  <div>
                    <Button variant="outline-primary" size="sm" className="me-1">
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button variant="outline-danger" size="sm">
                      <i className="bi bi-trash"></i>
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Add Service Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm dịch vụ mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Mã dịch vụ</Form.Label>
              <Form.Control type="text" placeholder="CB001" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tên dịch vụ</Form.Label>
              <Form.Control type="text" placeholder="Combo 1 - Bắp nước..." />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Loại dịch vụ</Form.Label>
              <Form.Select>
                <option>Combo</option>
                <option>Bắp</option>
                <option>Nước</option>
                <option>Snack</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Giá bán</Form.Label>
              <InputGroup>
                <Form.Control type="number" placeholder="85000" />
                <InputGroup.Text>₫</InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL hình ảnh</Form.Label>
              <Form.Control type="text" placeholder="https://..." />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="danger">Thêm dịch vụ</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminServices;

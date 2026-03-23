import React, { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Form, InputGroup, 
  Badge, Modal, ProgressBar 
} from 'react-bootstrap';

interface User {
  id: string;
  ma: string;
  ho_ten: string;
  email: string;
  so_dien_thoai: string;
  ngay_sinh: string;
  gioi_tinh: number;
  vai_tro: string;
  hang_thanh_vien: string;
  diem_tich_luy: number;
  trang_thai: number;
  ngay_tao: string;
}

const AdminUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Mock data
  const mockUsers: User[] = [
    {
      id: '1',
      ma: 'KH001',
      ho_ten: 'Nguyễn Văn A',
      email: 'nguyenvana@gmail.com',
      so_dien_thoai: '0901234567',
      ngay_sinh: '1990-05-15',
      gioi_tinh: 0,
      vai_tro: 'KHACH_HANG',
      hang_thanh_vien: 'Gold',
      diem_tich_luy: 2500,
      trang_thai: 1,
      ngay_tao: '2023-01-15'
    },
    {
      id: '2',
      ma: 'KH002',
      ho_ten: 'Trần Thị B',
      email: 'tranthib@gmail.com',
      so_dien_thoai: '0912345678',
      ngay_sinh: '1995-08-20',
      gioi_tinh: 1,
      vai_tro: 'KHACH_HANG',
      hang_thanh_vien: 'Silver',
      diem_tich_luy: 1200,
      trang_thai: 1,
      ngay_tao: '2023-03-20'
    },
    {
      id: '3',
      ma: 'NV001',
      ho_ten: 'Lê Văn C',
      email: 'levanc@datn.com',
      so_dien_thoai: '0923456789',
      ngay_sinh: '1988-12-10',
      gioi_tinh: 0,
      vai_tro: 'NHAN_VIEN',
      hang_thanh_vien: 'Platinum',
      diem_tich_luy: 5000,
      trang_thai: 1,
      ngay_tao: '2022-06-01'
    },
    {
      id: '4',
      ma: 'KH003',
      ho_ten: 'Phạm Thị D',
      email: 'phamthid@gmail.com',
      so_dien_thoai: '0934567890',
      ngay_sinh: '1992-03-25',
      gioi_tinh: 1,
      vai_tro: 'KHACH_HANG',
      hang_thanh_vien: 'Bronze',
      diem_tich_luy: 500,
      trang_thai: 1,
      ngay_tao: '2024-01-10'
    },
    {
      id: '5',
      ma: 'QL001',
      ho_ten: 'Hoàng Văn E',
      email: 'hoangvane@datn.com',
      so_dien_thoai: '0945678901',
      ngay_sinh: '1985-07-18',
      gioi_tinh: 0,
      vai_tro: 'QUAN_LY',
      hang_thanh_vien: 'Platinum',
      diem_tich_luy: 10000,
      trang_thai: 1,
      ngay_tao: '2021-01-05'
    }
  ];

  const [users] = useState<User[]>(mockUsers);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN': return <Badge bg="danger">Admin</Badge>;
      case 'QUAN_LY': return <Badge bg="warning">Quản lý</Badge>;
      case 'NHAN_VIEN': return <Badge bg="info">Nhân viên</Badge>;
      case 'KHACH_HANG': return <Badge bg="secondary">Khách hàng</Badge>;
      default: return <Badge bg="secondary">Không xác định</Badge>;
    }
  };

  const getMemberTierBadge = (tier: string) => {
    switch (tier) {
      case 'Platinum': return <Badge bg="dark">Platinum</Badge>;
      case 'Gold': return <Badge bg="warning" text="dark">Gold</Badge>;
      case 'Silver': return <Badge bg="light" text="dark" className="border">Silver</Badge>;
      case 'Bronze': return <Badge bg="danger">Bronze</Badge>;
      default: return <Badge bg="secondary">Chưa có</Badge>;
    }
  };

  const getMemberProgress = (points: number) => {
    // Thresholds: Bronze 0, Silver 1000, Gold 2000, Platinum 5000
    if (points >= 5000) return { variant: 'dark', percent: 100, nextTier: 'MAX' };
    if (points >= 2000) return { variant: 'warning', percent: (points - 2000) / 30, nextTier: 'Platinum' };
    if (points >= 1000) return { variant: 'info', percent: (points - 1000) / 10, nextTier: 'Gold' };
    return { variant: 'danger', percent: points / 10, nextTier: 'Silver' };
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      console.log('Delete user:', userId);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.ho_ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.ma.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.vai_tro === filterRole;
    const matchesStatus = filterStatus === 'all' || user.trang_thai.toString() === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 fw-bold">Quản lý Người dùng</h2>
          <p className="text-muted mb-0">Quản lý tài khoản và phân quyền người dùng</p>
        </div>
        <Button variant="danger">
          <i className="bi bi-plus-circle me-2"></i>
          Thêm người dùng
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Tổng người dùng</p>
                  <h4 className="mb-0 fw-bold">{users.length}</h4>
                </div>
                <div className="bg-primary bg-opacity-10 rounded p-2">
                  <i className="bi bi-people fs-5 text-primary"></i>
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
                  <p className="text-muted mb-1 small">Khách hàng</p>
                  <h4 className="mb-0 fw-bold">
                    {users.filter(u => u.vai_tro === 'KHACH_HANG').length}
                  </h4>
                </div>
                <div className="bg-success bg-opacity-10 rounded p-2">
                  <i className="bi bi-person fs-5 text-success"></i>
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
                  <p className="text-muted mb-1 small">Nhân viên</p>
                  <h4 className="mb-0 fw-bold">
                    {users.filter(u => ['NHAN_VIEN', 'QUAN_LY'].includes(u.vai_tro)).length}
                  </h4>
                </div>
                <div className="bg-warning bg-opacity-10 rounded p-2">
                  <i className="bi bi-person-badge fs-5 text-warning"></i>
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
                  <p className="text-muted mb-1 small">Thành viên Platinum</p>
                  <h4 className="mb-0 fw-bold">
                    {users.filter(u => u.hang_thanh_vien === 'Platinum').length}
                  </h4>
                </div>
                <div className="bg-dark bg-opacity-10 rounded p-2">
                  <i className="bi bi-star fs-5 text-dark"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters & Search */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={5}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Tìm kiếm theo tên, email, mã người dùng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select 
                value={filterRole} 
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">Tất cả vai trò</option>
                <option value="KHACH_HANG">Khách hàng</option>
                <option value="NHAN_VIEN">Nhân viên</option>
                <option value="QUAN_LY">Quản lý</option>
                <option value="ADMIN">Admin</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="1">Đang hoạt động</option>
                <option value="0">Đã khóa</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Button variant="outline-secondary" className="w-100">
                <i className="bi bi-download me-2"></i>
                Xuất Excel
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Users Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th style={{ width: '80px' }}>Mã</th>
                  <th>Người dùng</th>
                  <th>Liên hệ</th>
                  <th className="text-center">Vai trò</th>
                  <th className="text-center">Hạng thành viên</th>
                  <th className="text-center">Điểm tích lũy</th>
                  <th className="text-center">Trạng thái</th>
                  <th className="text-center" style={{ width: '150px' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <span className="badge bg-light text-dark border">{user.ma}</span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div 
                          className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                          style={{ width: 40, height: 40 }}
                        >
                          <i className="bi bi-person-fill"></i>
                        </div>
                        <div>
                          <div className="fw-semibold">{user.ho_ten}</div>
                          <small className="text-muted">
                            {user.gioi_tinh === 0 ? 'Nam' : user.gioi_tinh === 1 ? 'Nữ' : 'Khác'} • 
                            Đăng ký {user.ngay_tao}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="small">
                        <div><i className="bi bi-envelope me-1"></i>{user.email}</div>
                        <div className="text-muted">
                          <i className="bi bi-phone me-1"></i>{user.so_dien_thoai}
                        </div>
                      </div>
                    </td>
                    <td className="text-center">{getRoleBadge(user.vai_tro)}</td>
                    <td className="text-center">{getMemberTierBadge(user.hang_thanh_vien)}</td>
                    <td className="text-center">
                      <div className="fw-semibold">{user.diem_tich_luy.toLocaleString('vi-VN')}</div>
                      <div style={{ width: 100, margin: '0 auto' }}>
                        <ProgressBar 
                          now={getMemberProgress(user.diem_tich_luy).percent} 
                          variant={getMemberProgress(user.diem_tich_luy).variant}
                          style={{ height: 4 }}
                        />
                      </div>
                    </td>
                    <td className="text-center">
                      <Badge bg={user.trang_thai === 1 ? 'success' : 'danger'}>
                        {user.trang_thai === 1 ? 'Hoạt động' : 'Đã khóa'}
                      </Badge>
                    </td>
                    <td className="text-center">
                      <Button 
                        variant="outline-info" 
                        size="sm" 
                        className="me-1"
                        onClick={() => handleViewUser(user)}
                      >
                        <i className="bi bi-eye"></i>
                      </Button>
                      <Button variant="outline-primary" size="sm" className="me-1">
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
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
        <Card.Footer className="bg-white">
          <div className="text-muted small">
            Hiển thị {filteredUsers.length} / {users.length} người dùng
          </div>
        </Card.Footer>
      </Card>

      {/* User Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <Row className="mb-4">
                <Col md={12} className="text-center">
                  <div 
                    className="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: 80, height: 80 }}
                  >
                    <i className="bi bi-person-fill fs-1"></i>
                  </div>
                  <h4 className="fw-bold">{selectedUser.ho_ten}</h4>
                  <div className="mb-2">
                    {getRoleBadge(selectedUser.vai_tro)}
                    {' '}
                    {getMemberTierBadge(selectedUser.hang_thanh_vien)}
                  </div>
                </Col>
              </Row>

              <Row className="g-3">
                <Col md={6}>
                  <Card className="border">
                    <Card.Body>
                      <small className="text-muted">Mã người dùng</small>
                      <div className="fw-semibold">{selectedUser.ma}</div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border">
                    <Card.Body>
                      <small className="text-muted">Email</small>
                      <div className="fw-semibold">{selectedUser.email}</div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border">
                    <Card.Body>
                      <small className="text-muted">Số điện thoại</small>
                      <div className="fw-semibold">{selectedUser.so_dien_thoai}</div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border">
                    <Card.Body>
                      <small className="text-muted">Ngày sinh</small>
                      <div className="fw-semibold">{selectedUser.ngay_sinh}</div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border">
                    <Card.Body>
                      <small className="text-muted">Điểm tích lũy</small>
                      <div className="fw-semibold fs-4 text-warning">
                        {selectedUser.diem_tich_luy.toLocaleString('vi-VN')} điểm
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border">
                    <Card.Body>
                      <small className="text-muted">Ngày đăng ký</small>
                      <div className="fw-semibold">{selectedUser.ngay_tao}</div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <div className="mt-4">
                <h6 className="fw-semibold mb-3">Lịch sử giao dịch gần đây</h6>
                <Table bordered size="sm">
                  <thead className="bg-light">
                    <tr>
                      <th>Ngày</th>
                      <th>Mô tả</th>
                      <th className="text-end">Số tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>22/03/2024</td>
                      <td>Đặt vé Avatar 3 - 2 vé</td>
                      <td className="text-end">180,000 ₫</td>
                    </tr>
                    <tr>
                      <td>15/03/2024</td>
                      <td>Đặt vé The Batman - 1 vé</td>
                      <td className="text-end">90,000 ₫</td>
                    </tr>
                    <tr>
                      <td>10/03/2024</td>
                      <td>Mua combo bắp nước</td>
                      <td className="text-end">85,000 ₫</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
          <Button variant="danger">
            <i className="bi bi-pencil me-2"></i>
            Chỉnh sửa
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminUsers;

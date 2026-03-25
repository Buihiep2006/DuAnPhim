import React from 'react';
import { Container, Row, Col, Card, Badge, ListGroup, Nav, Tab, Button, Form, Table, Spinner, Modal } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { hangThanhVienData } from '../../../data/mockData';

interface BookingHistory {
  id: string;
  maHoaDon: string;
  thoiGianTao: string;
  tongTienThanhToan: number;
  trangThai: number;
  tenPhim: string;
  thoiGianBatDau: string;
  tenRap: string;
  tenPhong: string;
  danhSachGhe: string[];
  danhSachDichVu: string[];
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [history, setHistory] = React.useState<BookingHistory[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showModal, setShowModal] = React.useState(false);
  const [selectedBooking, setSelectedBooking] = React.useState<BookingHistory | null>(null);

  React.useEffect(() => {
    if (user?.id) {
      setError(null);
      fetch('http://localhost:9999/api/customer/hoa-don/history')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setHistory(data.data);
          } else {
            setError(data.message || 'Lỗi lấy lịch sử đặt vé');
          }
        })
        .catch(err => {
          console.error(err);
          setError('Không thể kết nối đến máy chủ');
        })
        .finally(() => setLoading(false));
    }
  }, [user?.id]);

  const handleCancel = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy vé này? Thao tác này không thể hoàn tác.')) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:9999/api/customer/hoa-don/${id}/cancel`, {
        method: 'PUT'
      });
      const data = await res.json();
      if (data.success) {
        alert('Hủy vé thành công!');
        setShowModal(false);
        // Refresh history
        const updatedHistory = history.map(item => 
          item.id === id ? { ...item, trangThai: 2 } : item
        );
        setHistory(updatedHistory);
      } else {
        alert(data.message || 'Lỗi khi hủy vé');
      }
    } catch (err) {
      console.error(err);
      alert('Không thể kết nối đến máy chủ để hủy vé');
    }
  };

  if (!user) {
    return null;
  }

  const hangThanhVien = hangThanhVienData.find(h => h.id === user.hang_thanh_vien_id || h.id === (user as any).hangThanhVienId);
  const userDiem = user.diem_tich_luy ?? (user as any).diemTichLuy ?? 0;
  const nextHang = hangThanhVienData.find(h => h.diem_toi_thieu > userDiem);

  const formatCurrency = (amount: number) => {
    return (amount || 0).toLocaleString('vi-VN') + 'đ';
  };

  const displayName = user.ho_ten || (user as any).hoTen || 'Thành viên';

  return (
    <Container className="py-4">
      <Row>
        <Col md={4}>
          <Card>
            <Card.Body className="text-center">
              <div className="mb-3">
                {user.hinh_anh_dai_dien ? (
                  <img
                    src={user.hinh_anh_dai_dien}
                    alt={displayName}
                    className="rounded-circle"
                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center mx-auto"
                    style={{ width: '120px', height: '120px', fontSize: '3rem' }}
                  >
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <h5>{displayName}</h5>
              <p className="text-muted">{user.email}</p>

              {hangThanhVien && (
                <Badge bg="warning" text="dark" className="mb-3">
                  <i className="bi bi-star-fill me-1"></i>
                  {hangThanhVien.ten}
                </Badge>
              )}

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <small>Điểm tích lũy:</small>
                  <strong className="text-danger">{userDiem} điểm</strong>
                </div>
                {nextHang && (
                  <>
                    <div className="progress" style={{ height: '8px' }}>
                      <div
                        className="progress-bar bg-danger"
                        style={{
                          width: `${
                            (userDiem /
                              (nextHang.diem_toi_thieu - (hangThanhVien?.diem_toi_thieu || 0))) *
                            100
                          }%`
                        }}
                      ></div>
                    </div>
                    <small className="text-muted">
                      Cần thêm {nextHang.diem_toi_thieu - userDiem} điểm để lên hạng{' '}
                      {nextHang.ten}
                    </small>
                  </>
                )}
              </div>

              <Button variant="outline-danger" size="sm" className="w-100">
                Chỉnh sửa hồ sơ
              </Button>
            </Card.Body>
          </Card>

          <Card className="mt-3">
            <Card.Header>
              <h6 className="mb-0">Ưu đãi của bạn</h6>
            </Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <i className="bi bi-gift text-danger me-2"></i>
                Điểm tích lũy quy đổi: {formatCurrency(userDiem * 1000)}
              </ListGroup.Item>
              {hangThanhVien && hangThanhVien.ma !== 'BRONZE' && (
                <ListGroup.Item>
                  <i className="bi bi-percent text-warning me-2"></i>
                  Giảm giá thành viên {hangThanhVien.ten}
                </ListGroup.Item>
              )}
              <ListGroup.Item>
                <i className="bi bi-star text-info me-2"></i>
                Tích điểm mọi giao dịch
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>

        <Col md={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Thông tin tài khoản</h5>
            </Card.Header>
            <Card.Body>
              <Tab.Container defaultActiveKey="history">
                <Nav variant="tabs" className="mb-3">
                  <Nav.Item>
                    <Nav.Link eventKey="history">Lịch sử đặt vé</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="info">Thông tin cá nhân</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="settings">Cài đặt</Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content>
                  <Tab.Pane eventKey="history">
                    {loading ? (
                      <div className="text-center py-5">
                        <Spinner animation="border" variant="danger" />
                        <p className="mt-2">Đang tải lịch sử...</p>
                      </div>
                    ) : error ? (
                      <div className="text-center py-5 text-danger">
                        <i className="bi bi-exclamation-triangle" style={{ fontSize: '3rem' }}></i>
                        <p className="mt-3">{error}</p>
                        <Button variant="outline-danger" onClick={() => window.location.reload()}>
                          Thử lại
                        </Button>
                      </div>
                    ) : history.length === 0 ? (
                      <div className="text-center py-5">
                        <i className="bi bi-ticket-perforated text-muted" style={{ fontSize: '3rem' }}></i>
                        <p className="text-muted mt-3">Chưa có lịch sử đặt vé</p>
                        <Button variant="danger" href="/">
                          Đặt vé ngay
                        </Button>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <Table hover>
                          <thead>
                            <tr>
                              <th>Mã HD</th>
                              <th>Phim</th>
                              <th>Rạp / Phòng</th>
                              <th>Ghế</th>
                              <th>Thời gian</th>
                               <th>Tổng tiền</th>
                              <th className="text-center">Trạng thái</th>
                              <th className="text-center">Hành động</th>
                            </tr>
                          </thead>
                          <tbody>
                            {history.map(item => (
                              <tr key={item.id} className="align-middle">
                                <td><small className="fw-bold">{item.maHoaDon}</small></td>
                                <td>
                                  <div className="fw-bold">{item.tenPhim}</div>
                                  <small className="text-muted">
                                    {new Date(item.thoiGianBatDau).toLocaleString('vi-VN')}
                                  </small>
                                </td>
                                <td>
                                  <div>{item.tenRap}</div>
                                  <small>{item.tenPhong}</small>
                                </td>
                                <td>{item.danhSachGhe?.join(', ')}</td>
                                <td className="small">{new Date(item.thoiGianTao).toLocaleDateString('vi-VN')}</td>
                                <td className="text-end fw-bold">
                                  {item.tongTienThanhToan?.toLocaleString('vi-VN')}đ
                                </td>
                                <td className="text-center">
                                  <Badge bg={item.trangThai === 1 ? 'success' : 'secondary'}>
                                    {item.trangThai === 1 ? 'Thành công' : 'Đã hủy'}
                                  </Badge>
                                </td>
                                <td className="text-center">
                                  <div className="d-flex gap-2 justify-content-center">
                                    <Button 
                                      variant="outline-primary" 
                                      size="sm"
                                      title="Xem chi tiết"
                                      onClick={() => {
                                        setSelectedBooking(item);
                                        setShowModal(true);
                                      }}
                                    >
                                      <i className="bi bi-eye"></i>
                                    </Button>
                                    {item.trangThai === 1 && (
                                      <Button 
                                        variant="outline-danger" 
                                        size="sm"
                                        title="Hủy vé"
                                        onClick={() => handleCancel(item.id)}
                                      >
                                        <i className="bi bi-trash"></i>
                                      </Button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                  </Tab.Pane>

                  <Tab.Pane eventKey="info">
                    <Form>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Họ tên</Form.Label>
                            <Form.Control type="text" defaultValue={displayName} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" defaultValue={user.email} disabled />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control type="tel" defaultValue={user.so_dien_thoai || (user as any).soDienThoai || ''} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Ngày sinh</Form.Label>
                            <Form.Control
                              type="date"
                              defaultValue={
                                (user.ngay_sinh || (user as any).ngaySinh)
                                  ? new Date(user.ngay_sinh || (user as any).ngaySinh).toISOString().split('T')[0]
                                  : ''
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>Giới tính</Form.Label>
                        <div>
                          <Form.Check
                            inline
                            type="radio"
                            label="Nam"
                            name="gender"
                            defaultChecked={(user.gioi_tinh ?? (user as any).gioiTinh) === 0}
                          />
                          <Form.Check
                            inline
                            type="radio"
                            label="Nữ"
                            name="gender"
                            defaultChecked={(user.gioi_tinh ?? (user as any).gioiTinh) === 1}
                          />
                          <Form.Check
                            inline
                            type="radio"
                            label="Khác"
                            name="gender"
                            defaultChecked={(user.gioi_tinh ?? (user as any).gioiTinh) === 2}
                          />
                        </div>
                      </Form.Group>

                      <Button variant="danger">Cập nhật thông tin</Button>
                    </Form>
                  </Tab.Pane>

                  <Tab.Pane eventKey="settings">
                    <div className="mb-4">
                      <h6>Đổi mật khẩu</h6>
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Label>Mật khẩu hiện tại</Form.Label>
                          <Form.Control type="password" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Mật khẩu mới</Form.Label>
                          <Form.Control type="password" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                          <Form.Control type="password" />
                        </Form.Group>
                        <Button variant="danger">Đổi mật khẩu</Button>
                      </Form>
                    </div>

                    <hr />

                    <div>
                      <h6>Tài khoản</h6>
                      <Button variant="outline-danger" onClick={logout}>
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Đăng xuất
                      </Button>
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Booking Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Chi tiết vé đặt</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedBooking && (
            <Row>
              <Col md={5} className="text-center border-end">
                <div className="bg-white p-3 border mb-3 d-inline-block">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${selectedBooking.maHoaDon}`} 
                    alt="QR Code" 
                    className="img-fluid"
                    style={{ width: '180px' }}
                  />
                </div>
                <h5>Mã vé: {selectedBooking.maHoaDon}</h5>
                <Badge bg={selectedBooking.trangThai === 1 ? 'success' : 'secondary'} className="px-3 py-2 mb-3">
                  {selectedBooking.trangThai === 1 ? 'Đã thanh toán' : 'Đã hủy / Hết hạn'}
                </Badge>
                <div className="alert alert-info py-2 small">
                  <i className="bi bi-info-circle me-2"></i>
                  Đưa mã này cho nhân viên soát vé
                </div>
              </Col>
              <Col md={7} className="ps-md-4">
                <h4 className="text-primary fw-bold mb-3">{selectedBooking.tenPhim}</h4>
                
                <div className="mb-4">
                  <h6 className="text-muted text-uppercase small fw-bold">Thông tin suất chiếu</h6>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Rạp / Phòng:</span>
                    <span className="fw-bold">{selectedBooking.tenRap} - {selectedBooking.tenPhong}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Thời gian:</span>
                    <span className="fw-bold">
                      {new Date(selectedBooking.thoiGianBatDau).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Ghế ngồi:</span>
                    <span className="fw-bold text-danger text-end" style={{ maxWidth: '180px' }}>
                      {selectedBooking.danhSachGhe?.join(', ')}
                    </span>
                  </div>
                </div>

                {selectedBooking.danhSachDichVu && selectedBooking.danhSachDichVu.length > 0 && (
                  <div className="mb-4">
                    <h6 className="text-muted text-uppercase small fw-bold">Dịch vụ (F&B)</h6>
                    <ul className="list-unstyled mb-0">
                      {selectedBooking.danhSachDichVu.map((dv, idx) => (
                        <li key={idx} className="d-flex justify-content-between small">
                          <span>• {dv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <hr />
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Tổng tiền thanh toán:</span>
                  <span className="h4 mb-0 fw-bold text-danger">
                    {selectedBooking.tongTienThanhToan?.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                <div className="text-muted small mt-2">
                  Đặt ngày: {new Date(selectedBooking.thoiGianTao).toLocaleString('vi-VN')}
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedBooking?.trangThai === 1 && (
            <Button variant="outline-danger" className="me-auto" onClick={() => handleCancel(selectedBooking.id)}>
              Hủy vé này
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
          <Button variant="danger" onClick={() => window.print()} className="d-none d-md-block">
            <i className="bi bi-printer me-2"></i>In vé
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

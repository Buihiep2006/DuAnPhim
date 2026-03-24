import React from 'react';
import { Container, Row, Col, Card, Badge, ListGroup, Nav, Tab, Button, Form, Table, Spinner } from 'react-bootstrap';
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

  React.useEffect(() => {
    if (user?.id) {
      setError(null);
      fetch(`http://localhost:9999/api/admin/hoa-don/khach-hang/${user.id}`)
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
                            </tr>
                          </thead>
                          <tbody>
                            {history.map(item => (
                              <tr key={item.id}>
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
                                <td>{new Date(item.thoiGianTao).toLocaleDateString('vi-VN')}</td>
                                <td className="text-danger fw-bold">
                                  {item.tongTienThanhToan?.toLocaleString('vi-VN')}đ
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
    </Container>
  );
}

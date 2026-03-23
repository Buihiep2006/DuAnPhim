import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { GioiTinh } from '../../../types/database.types';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    ho_ten: '',
    email: '',
    mat_khau: '',
    confirm_password: '',
    so_dien_thoai: '',
    ngay_sinh: '',
    gioi_tinh: GioiTinh.NAM
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'gioi_tinh' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.mat_khau !== formData.confirm_password) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (formData.mat_khau.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);

    try {
      const success = await register({
        ho_ten: formData.ho_ten,
        email: formData.email,
        so_dien_thoai: formData.so_dien_thoai,
        ngay_sinh: formData.ngay_sinh ? new Date(formData.ngay_sinh) : null,
        gioi_tinh: formData.gioi_tinh
      });

      if (success) {
        navigate('/');
      } else {
        setError('Đăng ký thất bại. Email có thể đã được sử dụng.');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold">
                    <span className="text-danger">DATN</span> Cinema
                  </h2>
                  <p className="text-muted">Đăng ký tài khoản mới</p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Họ và tên *</Form.Label>
                    <Form.Control
                      type="text"
                      name="ho_ten"
                      placeholder="Nhập họ và tên"
                      value={formData.ho_ten}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="email@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Số điện thoại</Form.Label>
                        <Form.Control
                          type="tel"
                          name="so_dien_thoai"
                          placeholder="0123456789"
                          value={formData.so_dien_thoai}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Mật khẩu *</Form.Label>
                        <Form.Control
                          type="password"
                          name="mat_khau"
                          placeholder="Ít nhất 6 ký tự"
                          value={formData.mat_khau}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Xác nhận mật khẩu *</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirm_password"
                          placeholder="Nhập lại mật khẩu"
                          value={formData.confirm_password}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Ngày sinh</Form.Label>
                        <Form.Control
                          type="date"
                          name="ngay_sinh"
                          value={formData.ngay_sinh}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Giới tính</Form.Label>
                        <Form.Select
                          name="gioi_tinh"
                          value={formData.gioi_tinh}
                          onChange={handleChange}
                        >
                          <option value={GioiTinh.NAM}>Nam</option>
                          <option value={GioiTinh.NU}>Nữ</option>
                          <option value={GioiTinh.KHAC}>Khác</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label={
                        <>
                          Tôi đồng ý với{' '}
                          <Link to="/terms" className="text-danger">
                            Điều khoản dịch vụ
                          </Link>{' '}
                          và{' '}
                          <Link to="/privacy" className="text-danger">
                            Chính sách bảo mật
                          </Link>
                        </>
                      }
                      required
                    />
                  </Form.Group>

                  <Button
                    variant="danger"
                    type="submit"
                    className="w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                  </Button>

                  <div className="text-center">
                    <span className="text-muted">Đã có tài khoản? </span>
                    <Link to="/login" className="text-danger text-decoration-none">
                      Đăng nhập ngay
                    </Link>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            <div className="text-center mt-3">
              <Link to="/" className="text-muted text-decoration-none">
                <i className="bi bi-arrow-left me-2"></i>
                Quay lại trang chủ
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
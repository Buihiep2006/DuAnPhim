import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await loginAdmin(email, password);
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError('Email hoặc mật khẩu không đúng');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow-lg">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <i className="bi bi-shield-lock text-danger" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h2 className="fw-bold">
                    <span className="text-danger">DATN</span> Admin
                  </h2>
                  <p className="text-muted">Đăng nhập vào hệ thống quản lý</p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email quản trị</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-person"></i>
                      </span>
                      <Form.Control
                        type="email"
                        placeholder="admin@datncinema.vn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Mật khẩu</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-lock"></i>
                      </span>
                      <Form.Control
                        type="password"
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Check type="checkbox" label="Ghi nhớ đăng nhập" className="mb-4" />

                  <Button
                    variant="danger"
                    type="submit"
                    className="w-100"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Đang đăng nhập...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Đăng nhập
                      </>
                    )}
                  </Button>
                </Form>

                <hr className="my-4" />

                <div className="text-center">
                  <small className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Chỉ dành cho quản trị viên hệ thống
                  </small>
                </div>
              </Card.Body>
            </Card>

            <div className="text-center mt-3">
              <Link to="/" className="text-light text-decoration-none">
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
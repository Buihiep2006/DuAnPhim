import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
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
    <div className="bg-light min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold">
                    <span className="text-danger">DATN</span> Cinema
                  </h2>
                  <p className="text-muted">Đăng nhập vào tài khoản</p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Nhập email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Mật khẩu</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Form.Check type="checkbox" label="Ghi nhớ đăng nhập" />
                    <Link to="/forgot-password" className="text-decoration-none small">
                      Quên mật khẩu?
                    </Link>
                  </div>

                  <Button
                    variant="danger"
                    type="submit"
                    className="w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </Button>

                  <div className="text-center">
                    <span className="text-muted">Chưa có tài khoản? </span>
                    <Link to="/register" className="text-danger text-decoration-none">
                      Đăng ký ngay
                    </Link>
                  </div>
                </Form>

                <hr className="my-4" />

                <div className="text-center">
                  <p className="text-muted small mb-2">Hoặc đăng nhập bằng</p>
                  <div className="d-flex gap-2">
                    <Button variant="outline-primary" className="flex-grow-1">
                      <i className="bi bi-facebook me-2"></i>
                      Facebook
                    </Button>
                    <Button variant="outline-danger" className="flex-grow-1">
                      <i className="bi bi-google me-2"></i>
                      Google
                    </Button>
                  </div>
                </div>
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
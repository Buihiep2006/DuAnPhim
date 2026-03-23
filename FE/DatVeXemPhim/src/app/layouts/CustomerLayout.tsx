import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';

export default function CustomerLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const { bookingState } = useBooking();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold">
            <span style={{ color: '#e50914' }}>DATN</span> Cinema
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">
                Trang chủ
              </Nav.Link>
              <Nav.Link as={Link} to="/?tab=showing">
                Phim đang chiếu
              </Nav.Link>
              <Nav.Link as={Link} to="/?tab=upcoming">
                Phim sắp chiếu
              </Nav.Link>
            </Nav>
            <Nav>
              {isAuthenticated && user ? (
                <NavDropdown
                  title={
                    <>
                      {user.hinh_anh_dai_dien ? (
                        <img
                          src={user.hinh_anh_dai_dien}
                          alt={user.ho_ten}
                          className="rounded-circle me-2"
                          style={{ width: 30, height: 30, objectFit: 'cover' }}
                        />
                      ) : (
                        <i className="bi bi-person-circle me-2"></i>
                      )}
                      {user.ho_ten}
                      {user.diem_tich_luy > 0 && (
                        <Badge bg="warning" text="dark" className="ms-2">
                          {user.diem_tich_luy} điểm
                        </Badge>
                      )}
                    </>
                  }
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/profile">
                    <i className="bi bi-person me-2"></i>
                    Thông tin cá nhân
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/profile?tab=history">
                    <i className="bi bi-clock-history me-2"></i>
                    Lịch sử đặt vé
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Đăng xuất
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Đăng nhập
                  </Nav.Link>
                  <Nav.Link as={Link} to="/register">
                    <i className="bi bi-person-plus me-1"></i>
                    Đăng ký
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Cart Notification */}
      {bookingState.selected_seats.length > 0 && (
        <div className="bg-warning text-dark py-2">
          <Container>
            <div className="d-flex justify-content-between align-items-center">
              <span>
                <i className="bi bi-cart3 me-2"></i>
                Bạn đang có {bookingState.selected_seats.length} ghế trong giỏ hàng
              </span>
              <Link to="/checkout" className="btn btn-sm btn-dark">
                Thanh toán
              </Link>
            </div>
          </Container>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-dark text-light py-4 mt-5">
        <Container>
          <div className="row">
            <div className="col-md-4 mb-3">
              <h5 className="text-danger">DATN Cinema</h5>
              <p className="small">
                Hệ thống rạp chiếu phim hiện đại với công nghệ âm thanh và hình ảnh tiên tiến nhất.
              </p>
            </div>
            <div className="col-md-4 mb-3">
              <h6>Liên kết</h6>
              <ul className="list-unstyled small">
                <li>
                  <Link to="/" className="text-light text-decoration-none">
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link to="/?tab=showing" className="text-light text-decoration-none">
                    Phim đang chiếu
                  </Link>
                </li>
                <li>
                  <Link to="/?tab=upcoming" className="text-light text-decoration-none">
                    Phim sắp chiếu
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-md-4 mb-3">
              <h6>Liên hệ</h6>
              <p className="small mb-1">
                <i className="bi bi-telephone me-2"></i>
                Hotline: 1900 xxxx
              </p>
              <p className="small mb-1">
                <i className="bi bi-envelope me-2"></i>
                Email: support@datncinema.vn
              </p>
              <div className="mt-2">
                <a href="#" className="text-light me-3">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" className="text-light me-3">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#" className="text-light me-3">
                  <i className="bi bi-youtube"></i>
                </a>
              </div>
            </div>
          </div>
          <hr className="border-secondary" />
          <div className="text-center small">
            <p className="mb-0">&copy; 2026 DATN Cinema. All rights reserved.</p>
          </div>
        </Container>
      </footer>

      {/* Bootstrap Icons CDN */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
      />
    </div>
  );
}
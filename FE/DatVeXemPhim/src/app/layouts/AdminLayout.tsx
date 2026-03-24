import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Toaster } from 'sonner';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Toaster position="top-right" richColors />
      {/* Modern Sidebar */}
      <div 
        className="bg-dark text-light shadow-lg" 
        style={{ 
          width: 280, 
          minHeight: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          overflowY: 'auto',
          zIndex: 1000
        }}
      >
        <div className="p-4 border-bottom border-secondary">
          <h4 className="mb-0 fw-bold d-flex align-items-center">
            <span className="text-danger me-2">
              <i className="bi bi-film"></i>
            </span>
            <span className="text-white">DATN</span>
            <span className="text-muted ms-2 fs-6">Admin</span>
          </h4>
        </div>
        
        <Nav className="flex-column p-3">
          <Nav.Link
            as={Link}
            to="/admin/dashboard"
            className={`text-light mb-2 rounded px-3 py-2 d-flex align-items-center ${
              isActive('/admin/dashboard') ? 'bg-danger' : 'nav-link-hover'
            }`}
            style={{ transition: 'all 0.3s' }}
          >
            <i className="bi bi-speedometer2 me-3 fs-5"></i>
            <span>Dashboard</span>
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/admin/movies"
            className={`text-light mb-2 rounded px-3 py-2 d-flex align-items-center ${
              isActive('/admin/movies') ? 'bg-danger' : 'nav-link-hover'
            }`}
            style={{ transition: 'all 0.3s' }}
          >
            <i className="bi bi-film me-3 fs-5"></i>
            <span>Phim</span>
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/admin/categories"
            className={`text-light mb-2 rounded px-3 py-2 d-flex align-items-center ${
              isActive('/admin/categories') ? 'bg-danger' : 'nav-link-hover'
            }`}
            style={{ transition: 'all 0.3s' }}
          >
            <i className="bi bi-tags me-3 fs-5"></i>
            <span>Danh mục phim</span>
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/admin/showtimes"
            className={`text-light mb-2 rounded px-3 py-2 d-flex align-items-center ${
              isActive('/admin/showtimes') ? 'bg-danger' : 'nav-link-hover'
            }`}
            style={{ transition: 'all 0.3s' }}
          >
            <i className="bi bi-calendar-event me-3 fs-5"></i>
            <span>Lịch chiếu</span>
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/admin/cinemas"
            className={`text-light mb-2 rounded px-3 py-2 d-flex align-items-center ${
              isActive('/admin/cinemas') ? 'bg-danger' : 'nav-link-hover'
            }`}
            style={{ transition: 'all 0.3s' }}
          >
            <i className="bi bi-building me-3 fs-5"></i>
            <span>Rạp & Phòng chiếu</span>
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/admin/services"
            className={`text-light mb-2 rounded px-3 py-2 d-flex align-items-center ${
              isActive('/admin/services') ? 'bg-danger' : 'nav-link-hover'
            }`}
            style={{ transition: 'all 0.3s' }}
          >
            <i className="bi bi-cup-straw me-3 fs-5"></i>
            <span>Dịch vụ F&B</span>
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/admin/promotions"
            className={`text-light mb-2 rounded px-3 py-2 d-flex align-items-center ${
              isActive('/admin/promotions') ? 'bg-danger' : 'nav-link-hover'
            }`}
            style={{ transition: 'all 0.3s' }}
          >
            <i className="bi bi-tag me-3 fs-5"></i>
            <span>Khuyến mãi</span>
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/admin/customers"
            className={`text-light mb-2 rounded px-3 py-2 d-flex align-items-center ${
              isActive('/admin/customers') ? 'bg-danger' : 'nav-link-hover'
            }`}
            style={{ transition: 'all 0.3s' }}
          >
            <i className="bi bi-person me-3 fs-5"></i>
            <span>Khách hàng</span>
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/admin/employees"
            className={`text-light mb-2 rounded px-3 py-2 d-flex align-items-center ${
              isActive('/admin/employees') ? 'bg-danger' : 'nav-link-hover'
            }`}
            style={{ transition: 'all 0.3s' }}
          >
            <i className="bi bi-person-badge me-3 fs-5"></i>
            <span>Nhân viên</span>
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/admin/invoices"
            className={`text-light mb-2 rounded px-3 py-2 d-flex align-items-center ${
              isActive('/admin/invoices') ? 'bg-danger' : 'nav-link-hover'
            }`}
            style={{ transition: 'all 0.3s' }}
          >
            <i className="bi bi-receipt me-3 fs-5"></i>
            <span>Hóa đơn</span>
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/admin/reports"
            className={`text-light mb-2 rounded px-3 py-2 d-flex align-items-center ${
              isActive('/admin/reports') ? 'bg-danger' : 'nav-link-hover'
            }`}
            style={{ transition: 'all 0.3s' }}
          >
            <i className="bi bi-bar-chart me-3 fs-5"></i>
            <span>Báo cáo</span>
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/admin/settings"
            className={`text-light mb-2 rounded px-3 py-2 d-flex align-items-center ${
              isActive('/admin/settings') ? 'bg-danger' : 'nav-link-hover'
            }`}
            style={{ transition: 'all 0.3s' }}
          >
            <i className="bi bi-gear me-3 fs-5"></i>
            <span>Cài đặt</span>
          </Nav.Link>
        </Nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1" style={{ marginLeft: 280 }}>
        {/* Modern Top Navbar */}
        <Navbar bg="white" className="border-bottom shadow-sm" style={{ height: 70 }}>
          <Container fluid className="px-4">
            <div className="d-flex align-items-center">
              <h5 className="mb-0 text-muted">
                {(location.pathname.split('/').pop() || 'dashboard').charAt(0).toUpperCase() + 
                 (location.pathname.split('/').pop() || 'dashboard').slice(1)}
              </h5>
            </div>
            <Nav className="ms-auto d-flex align-items-center">
              <div className="me-3">
                <i className="bi bi-bell fs-5 text-muted" style={{ cursor: 'pointer' }}></i>
              </div>
              <NavDropdown
                title={
                  <span className="d-flex align-items-center">
                    <div 
                      className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                      style={{ width: 36, height: 36 }}
                    >
                      <i className="bi bi-person-fill"></i>
                    </div>
                    <span className="fw-semibold">{user?.ho_ten || 'Admin'}</span>
                  </span>
                }
                align="end"
              >
                <NavDropdown.Item as={Link} to="/">
                  <i className="bi bi-house me-2"></i>
                  Về trang chủ
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Đăng xuất
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Container>
        </Navbar>

        {/* Page Content */}
        <div className="p-4" style={{ minHeight: 'calc(100vh - 70px)' }}>
          <Outlet />
        </div>
      </div>

      {/* Bootstrap Icons & Custom Styles */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
      />
      <style>{`
        .nav-link-hover:hover {
          background-color: rgba(220, 53, 69, 0.1) !important;
        }
      `}</style>
    </div>
  );
}
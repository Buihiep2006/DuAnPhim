import React, { useState } from 'react';
import { Row, Col, Card, Table, Badge, ProgressBar } from 'react-bootstrap';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const AdminDashboard: React.FC = () => {
  // Mock data for charts
  const revenueData = [
    { month: 'T1', revenue: 125000000, tickets: 1200 },
    { month: 'T2', revenue: 158000000, tickets: 1580 },
    { month: 'T3', revenue: 172000000, tickets: 1650 },
    { month: 'T4', revenue: 145000000, tickets: 1420 },
    { month: 'T5', revenue: 198000000, tickets: 1890 },
    { month: 'T6', revenue: 215000000, tickets: 2100 },
  ];

  const movieStats = [
    { name: 'Đang chiếu', value: 12, color: '#28a745' },
    { name: 'Sắp chiếu', value: 8, color: '#ffc107' },
    { name: 'Kết thúc', value: 15, color: '#6c757d' },
  ];

  const topMovies = [
    { id: 1, title: 'Avatar 3', tickets: 2850, revenue: 285000000, rating: 9.2 },
    { id: 2, title: 'Fast & Furious 11', tickets: 2340, revenue: 234000000, rating: 8.8 },
    { id: 3, title: 'Doraemon: Nobita và...', tickets: 1980, revenue: 198000000, rating: 8.5 },
    { id: 4, title: 'Conan: Tàu ngầm sắt', tickets: 1750, revenue: 175000000, rating: 9.0 },
    { id: 5, title: 'One Piece Film Red', tickets: 1620, revenue: 162000000, rating: 8.9 },
  ];

  const recentActivities = [
    { id: 1, user: 'Nguyễn Văn A', action: 'Đặt vé Avatar 3', time: '5 phút trước', type: 'booking' },
    { id: 2, user: 'Admin', action: 'Thêm phim mới', time: '15 phút trước', type: 'movie' },
    { id: 3, user: 'Trần Thị B', action: 'Hủy đặt vé', time: '25 phút trước', type: 'cancel' },
    { id: 4, user: 'Admin', action: 'Cập nhật lịch chiếu', time: '1 giờ trước', type: 'showtime' },
    { id: 5, user: 'Lê Văn C', action: 'Thanh toán thành công', time: '2 giờ trước', type: 'payment' },
  ];

  const stats = {
    totalRevenue: 1013000000,
    revenueGrowth: 12.5,
    totalTickets: 9840,
    ticketGrowth: 8.3,
    totalUsers: 5420,
    userGrowth: 15.2,
    activeMovies: 12,
    movieGrowth: -5.0,
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking': return 'bi-ticket-perforated';
      case 'movie': return 'bi-film';
      case 'cancel': return 'bi-x-circle';
      case 'showtime': return 'bi-calendar-event';
      case 'payment': return 'bi-cash-coin';
      default: return 'bi-info-circle';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'booking': return 'success';
      case 'movie': return 'primary';
      case 'cancel': return 'danger';
      case 'showtime': return 'warning';
      case 'payment': return 'info';
      default: return 'secondary';
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 fw-bold">Dashboard</h2>
          <p className="text-muted mb-0">Tổng quan hệ thống đặt vé xem phim</p>
        </div>
        <div className="text-muted">
          <i className="bi bi-calendar3 me-2"></i>
          Cập nhật lúc: {new Date().toLocaleString('vi-VN')}
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Doanh thu tháng này</p>
                  <h3 className="mb-2 fw-bold">{(stats.totalRevenue / 1000000).toFixed(0)}M</h3>
                  <div className="d-flex align-items-center">
                    <i className={`bi bi-arrow-${stats.revenueGrowth > 0 ? 'up' : 'down'} me-1 text-${stats.revenueGrowth > 0 ? 'success' : 'danger'}`}></i>
                    <small className={`text-${stats.revenueGrowth > 0 ? 'success' : 'danger'}`}>
                      {Math.abs(stats.revenueGrowth)}% so với tháng trước
                    </small>
                  </div>
                </div>
                <div className="bg-success bg-opacity-10 rounded p-3">
                  <i className="bi bi-currency-dollar fs-4 text-success"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Vé đã bán</p>
                  <h3 className="mb-2 fw-bold">{stats.totalTickets.toLocaleString('vi-VN')}</h3>
                  <div className="d-flex align-items-center">
                    <i className={`bi bi-arrow-${stats.ticketGrowth > 0 ? 'up' : 'down'} me-1 text-${stats.ticketGrowth > 0 ? 'success' : 'danger'}`}></i>
                    <small className={`text-${stats.ticketGrowth > 0 ? 'success' : 'danger'}`}>
                      {Math.abs(stats.ticketGrowth)}% so với tháng trước
                    </small>
                  </div>
                </div>
                <div className="bg-primary bg-opacity-10 rounded p-3">
                  <i className="bi bi-ticket-perforated fs-4 text-primary"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Người dùng</p>
                  <h3 className="mb-2 fw-bold">{stats.totalUsers.toLocaleString('vi-VN')}</h3>
                  <div className="d-flex align-items-center">
                    <i className={`bi bi-arrow-${stats.userGrowth > 0 ? 'up' : 'down'} me-1 text-${stats.userGrowth > 0 ? 'success' : 'danger'}`}></i>
                    <small className={`text-${stats.userGrowth > 0 ? 'success' : 'danger'}`}>
                      {Math.abs(stats.userGrowth)}% so với tháng trước
                    </small>
                  </div>
                </div>
                <div className="bg-warning bg-opacity-10 rounded p-3">
                  <i className="bi bi-people fs-4 text-warning"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Phim đang chiếu</p>
                  <h3 className="mb-2 fw-bold">{stats.activeMovies}</h3>
                  <div className="d-flex align-items-center">
                    <i className={`bi bi-arrow-${stats.movieGrowth > 0 ? 'up' : 'down'} me-1 text-${stats.movieGrowth > 0 ? 'success' : 'danger'}`}></i>
                    <small className={`text-${stats.movieGrowth > 0 ? 'success' : 'danger'}`}>
                      {Math.abs(stats.movieGrowth)}% so với tháng trước
                    </small>
                  </div>
                </div>
                <div className="bg-danger bg-opacity-10 rounded p-3">
                  <i className="bi bi-film fs-4 text-danger"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row className="g-4 mb-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 fw-semibold">Doanh thu 6 tháng gần đây</h5>
                <Badge bg="success">+12.5%</Badge>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any) => `${(value / 1000000).toFixed(0)}M VND`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#dc3545" 
                    strokeWidth={3}
                    name="Doanh thu"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="mb-3 fw-semibold">Phân loại phim</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={movieStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {movieStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tables Row */}
      <Row className="g-4">
        <Col lg={7}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="mb-3 fw-semibold">Top 5 phim bán chạy nhất</h5>
              <Table hover responsive className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Phim</th>
                    <th className="text-center">Vé đã bán</th>
                    <th className="text-end">Doanh thu</th>
                    <th className="text-center">Đánh giá</th>
                  </tr>
                </thead>
                <tbody>
                  {topMovies.map((movie) => (
                    <tr key={movie.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-danger bg-opacity-10 rounded p-2 me-2">
                            <i className="bi bi-film text-danger"></i>
                          </div>
                          <span className="fw-semibold">{movie.title}</span>
                        </div>
                      </td>
                      <td className="text-center">
                        <Badge bg="primary">{movie.tickets.toLocaleString('vi-VN')}</Badge>
                      </td>
                      <td className="text-end fw-semibold">
                        {(movie.revenue / 1000000).toFixed(0)}M
                      </td>
                      <td className="text-center">
                        <div className="d-flex align-items-center justify-content-center">
                          <i className="bi bi-star-fill text-warning me-1"></i>
                          <span className="fw-semibold">{movie.rating}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="mb-3 fw-semibold">Hoạt động gần đây</h5>
              <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="d-flex align-items-start mb-3 pb-3 border-bottom">
                    <div className={`bg-${getActivityColor(activity.type)} bg-opacity-10 rounded p-2 me-3`}>
                      <i className={`bi ${getActivityIcon(activity.type)} text-${getActivityColor(activity.type)}`}></i>
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-semibold">{activity.user}</div>
                      <div className="text-muted small">{activity.action}</div>
                      <div className="text-muted small">
                        <i className="bi bi-clock me-1"></i>
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;

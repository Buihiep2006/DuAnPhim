import React, { useState } from 'react';
import { 
  Row, Col, Card, Table, Form, Badge, Button, Tabs, Tab 
} from 'react-bootstrap';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const AdminReports: React.FC = () => {
  const [dateRange, setDateRange] = useState('7days');
  const [selectedTab, setSelectedTab] = useState<'revenue' | 'movies' | 'cinemas'>('revenue');

  // Mock data
  const revenueByDate = [
    { date: '16/03', tickets: 450, revenue: 45000000 },
    { date: '17/03', tickets: 520, revenue: 52000000 },
    { date: '18/03', tickets: 480, revenue: 48000000 },
    { date: '19/03', tickets: 610, revenue: 61000000 },
    { date: '20/03', tickets: 580, revenue: 58000000 },
    { date: '21/03', tickets: 720, revenue: 72000000 },
    { date: '22/03', tickets: 650, revenue: 65000000 }
  ];

  const revenueByMovie = [
    { ten_phim: 'Avatar 3', revenue: 285000000, tickets: 2850, percentage: 35 },
    { ten_phim: 'Fast & Furious 11', revenue: 234000000, tickets: 2340, percentage: 28 },
    { ten_phim: 'Doraemon', revenue: 198000000, tickets: 1980, percentage: 24 },
    { ten_phim: 'Conan', revenue: 175000000, tickets: 1750, percentage: 21 },
    { ten_phim: 'One Piece', revenue: 162000000, tickets: 1620, percentage: 20 }
  ];

  const revenueByCinema = [
    { ten_rap: 'CGV Vincom', revenue: 320000000, tickets: 3200 },
    { ten_rap: 'Lotte Cinema', revenue: 285000000, tickets: 2850 },
    { ten_rap: 'Galaxy Cinema', revenue: 245000000, tickets: 2450 },
    { ten_rap: 'BHD Star', revenue: 180000000, tickets: 1800 }
  ];

  const categoryRevenue = [
    { name: 'Vé phim', value: 650000000, color: '#dc3545' },
    { name: 'F&B', value: 250000000, color: '#ffc107' },
    { name: 'Khác', value: 50000000, color: '#6c757d' }
  ];

  const topCustomers = [
    { id: 1, name: 'Nguyễn Văn A', spent: 5850000, tickets: 24, tier: 'Platinum' },
    { id: 2, name: 'Trần Thị B', spent: 4320000, tickets: 18, tier: 'Gold' },
    { id: 3, name: 'Lê Văn C', spent: 3750000, tickets: 15, tier: 'Gold' },
    { id: 4, name: 'Phạm Thị D', spent: 2980000, tickets: 12, tier: 'Silver' },
    { id: 5, name: 'Hoàng Văn E', spent: 2540000, tickets: 10, tier: 'Silver' }
  ];

  const stats = {
    totalRevenue: 401000000,
    totalTickets: 4010,
    avgTicketPrice: 100000,
    fbRevenue: 125000000,
    growth: 15.5
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 fw-bold">Báo cáo & Thống kê</h2>
          <p className="text-muted mb-0">Phân tích doanh thu và hiệu suất kinh doanh</p>
        </div>
        <div className="d-flex gap-2">
          <Form.Select style={{ width: '200px' }} value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="today">Hôm nay</option>
            <option value="7days">7 ngày qua</option>
            <option value="30days">30 ngày qua</option>
            <option value="thismonth">Tháng này</option>
            <option value="lastmonth">Tháng trước</option>
          </Form.Select>
          <Button variant="outline-danger">
            <i className="bi bi-download me-2"></i>
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Tổng doanh thu</p>
                  <h4 className="mb-2 fw-bold">{(stats.totalRevenue / 1000000).toFixed(0)}M</h4>
                  <Badge bg="success">
                    <i className="bi bi-arrow-up me-1"></i>
                    +{stats.growth}%
                  </Badge>
                </div>
                <div className="bg-success bg-opacity-10 rounded p-2">
                  <i className="bi bi-currency-dollar fs-5 text-success"></i>
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
                  <p className="text-muted mb-1 small">Tổng vé bán</p>
                  <h4 className="mb-2 fw-bold">{stats.totalTickets.toLocaleString('vi-VN')}</h4>
                  <Badge bg="primary">
                    <i className="bi bi-arrow-up me-1"></i>
                    +8.2%
                  </Badge>
                </div>
                <div className="bg-primary bg-opacity-10 rounded p-2">
                  <i className="bi bi-ticket-perforated fs-5 text-primary"></i>
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
                  <p className="text-muted mb-1 small">Giá vé trung bình</p>
                  <h4 className="mb-2 fw-bold">{(stats.avgTicketPrice / 1000).toFixed(0)}K</h4>
                  <Badge bg="info">
                    <i className="bi bi-arrow-up me-1"></i>
                    +2.5%
                  </Badge>
                </div>
                <div className="bg-info bg-opacity-10 rounded p-2">
                  <i className="bi bi-cash fs-5 text-info"></i>
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
                  <h4 className="mb-2 fw-bold">{(stats.fbRevenue / 1000000).toFixed(0)}M</h4>
                  <Badge bg="warning">
                    <i className="bi bi-arrow-up me-1"></i>
                    +12.3%
                  </Badge>
                </div>
                <div className="bg-warning bg-opacity-10 rounded p-2">
                  <i className="bi bi-cup-straw fs-5 text-warning"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row className="g-4 mb-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="mb-3 fw-semibold">Biểu đồ doanh thu theo ngày</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueByDate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any) => `${(value / 1000000).toFixed(1)}M VND`}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#dc3545" name="Doanh thu" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="mb-3 fw-semibold">Cơ cấu doanh thu</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryRevenue}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryRevenue.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `${(value / 1000000).toFixed(0)}M VND`} />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs for detailed reports */}
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Tabs
            activeKey={selectedTab}
            onSelect={(k) => setSelectedTab(k as 'revenue' | 'movies' | 'cinemas')}
            className="mb-3"
          >
            <Tab eventKey="revenue" title={<><i className="bi bi-graph-up me-2"></i>Top phim</>}>
              <Table hover responsive>
                <thead className="bg-light">
                  <tr>
                    <th>#</th>
                    <th>Tên phim</th>
                    <th className="text-end">Doanh thu</th>
                    <th className="text-center">Vé bán</th>
                    <th className="text-center">Tỷ lệ</th>
                  </tr>
                </thead>
                <tbody>
                  {revenueByMovie.map((movie, index) => (
                    <tr key={index}>
                      <td>
                        <Badge bg={index === 0 ? 'warning' : index === 1 ? 'light' : 'secondary'}>
                          {index + 1}
                        </Badge>
                      </td>
                      <td className="fw-semibold">{movie.ten_phim}</td>
                      <td className="text-end fw-semibold">
                        {(movie.revenue / 1000000).toFixed(0)}M VND
                      </td>
                      <td className="text-center">
                        <Badge bg="primary">{movie.tickets.toLocaleString('vi-VN')}</Badge>
                      </td>
                      <td className="text-center">
                        <div className="d-flex align-items-center justify-content-center">
                          <div style={{ width: 100 }} className="me-2">
                            <div className="bg-light rounded" style={{ height: 8, overflow: 'hidden' }}>
                              <div 
                                className="bg-danger h-100"
                                style={{ width: `${movie.percentage * 5}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="small">{movie.percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>

            <Tab eventKey="movies" title={<><i className="bi bi-building me-2"></i>Theo rạp</>}>
              <Table hover responsive>
                <thead className="bg-light">
                  <tr>
                    <th>Rạp chiếu</th>
                    <th className="text-end">Doanh thu</th>
                    <th className="text-center">Vé bán</th>
                    <th className="text-end">Doanh thu TB/vé</th>
                  </tr>
                </thead>
                <tbody>
                  {revenueByCinema.map((cinema, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-danger bg-opacity-10 rounded p-2 me-2">
                            <i className="bi bi-building text-danger"></i>
                          </div>
                          <span className="fw-semibold">{cinema.ten_rap}</span>
                        </div>
                      </td>
                      <td className="text-end fw-semibold">
                        {(cinema.revenue / 1000000).toFixed(0)}M VND
                      </td>
                      <td className="text-center">
                        <Badge bg="primary">{cinema.tickets.toLocaleString('vi-VN')}</Badge>
                      </td>
                      <td className="text-end">
                        {((cinema.revenue / cinema.tickets) / 1000).toFixed(0)}K
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>

            <Tab eventKey="cinemas" title={<><i className="bi bi-people me-2"></i>Top khách hàng</>}>
              <Table hover responsive>
                <thead className="bg-light">
                  <tr>
                    <th>#</th>
                    <th>Khách hàng</th>
                    <th className="text-center">Hạng</th>
                    <th className="text-center">Số vé đã mua</th>
                    <th className="text-end">Tổng chi tiêu</th>
                  </tr>
                </thead>
                <tbody>
                  {topCustomers.map((customer, index) => (
                    <tr key={customer.id}>
                      <td>
                        <Badge bg={index === 0 ? 'warning' : index === 1 ? 'light' : 'secondary'}>
                          {index + 1}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div 
                            className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                            style={{ width: 32, height: 32 }}
                          >
                            <i className="bi bi-person-fill"></i>
                          </div>
                          <span className="fw-semibold">{customer.name}</span>
                        </div>
                      </td>
                      <td className="text-center">
                        <Badge bg={
                          customer.tier === 'Platinum' ? 'dark' :
                          customer.tier === 'Gold' ? 'warning' : 'light'
                        } text={customer.tier === 'Silver' ? 'dark' : 'white'}>
                          {customer.tier}
                        </Badge>
                      </td>
                      <td className="text-center">
                        <Badge bg="primary">{customer.tickets} vé</Badge>
                      </td>
                      <td className="text-end fw-semibold">
                        {(customer.spent / 1000000).toFixed(2)}M VND
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminReports;

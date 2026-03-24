import React, { useState } from 'react';
import { 
  Row, Col, Card, Table, Form, Badge, Button, Tabs, Tab 
} from 'react-bootstrap';
import { 
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const API = 'http://localhost:9999/api/admin';

const AdminReports: React.FC = () => {
  const [dateRange, setDateRange] = useState('7days');
  const [selectedTab, setSelectedTab] = useState<'revenue' | 'movies' | 'cinemas'>('revenue');
  const [loading, setLoading] = useState(true);

  const [revenueByDate, setRevenueByDate] = useState<any[]>([]);
  const [revenueByMovie, setRevenueByMovie] = useState<any[]>([]);
  const [revenueByCinema, setRevenueByCinema] = useState<any[]>([]);
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTickets: 0,
    avgTicketPrice: 0,
    fbRevenue: 0,
    growth: 0
  });

  React.useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [phimRes, khRes, hdRes, rapRes] = await Promise.all([
        fetch(`${API}/phim`),
        fetch(`${API}/khach-hang`),
        fetch(`${API}/hoa-don`),
        fetch(`${API}/rap-chieu`)
      ]);
      
      const [phimJson, khJson, hdJson, rapJson] = await Promise.all([
        phimRes.json(), khRes.json(), hdRes.json(), rapRes.json()
      ]);

      const movies = phimJson.data || [];
      const invoices = hdJson.data || [];
      const cinemas = rapJson.data || [];

      const paidInvoices = invoices.filter((i: any) => i.trangThai === 1);
      
      // Calculate Stats
      const totalRev = paidInvoices.reduce((sum: number, inv: any) => sum + (inv.tongTienThanhToan || 0), 0);
      const totalTix = paidInvoices.length;
      
      setStats({
        totalRevenue: totalRev,
        totalTickets: totalTix,
        avgTicketPrice: totalTix > 0 ? totalRev / totalTix : 0,
        fbRevenue: totalRev * 0.2, // mock F&B share since we don't have ChiTietHoaDonDichVu in this view yet
        growth: 12.5
      });

      // Revenue By Date (Last 7 days)
      const dateChart = [];
      for(let i=6; i>=0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        const dayInvoices = paidInvoices.filter((inv: any) => {
          const invDate = new Date(inv.thoiGianTao);
          return invDate.getDate() === d.getDate() && invDate.getMonth() === d.getMonth();
        });
        dateChart.push({
          date: dateStr,
          tickets: dayInvoices.length,
          revenue: dayInvoices.reduce((sum: number, inv: any) => sum + (inv.tongTienThanhToan || 0), 0)
        });
      }
      setRevenueByDate(dateChart);

      // Top Customers
      const customerStatsMap = new Map();
      paidInvoices.forEach((inv: any) => {
        const cid = inv.khachHangId;
        const current = customerStatsMap.get(cid) || { spent: 0, tickets: 0, name: inv.tenKhachHang || 'Khách hàng' };
        customerStatsMap.set(cid, {
          ...current,
          spent: current.spent + (inv.tongTienThanhToan || 0),
          tickets: current.tickets + 1
        });
      });

      const topCust = Array.from(customerStatsMap.entries())
        .map(([id, data]: [string, any]) => ({
          id,
          name: data.name,
          spent: data.spent,
          tickets: data.tickets,
          tier: data.spent > 5000000 ? 'Platinum' : data.spent > 2000000 ? 'Gold' : 'Silver'
        }))
        .sort((a, b) => b.spent - a.spent)
        .slice(0, 5);
      
      setTopCustomers(topCust);

      // Revenue By Movie (Since we don't have ChiTietHoaDon link here, we'll just show Movie List)
      setRevenueByMovie(movies.slice(0, 5).map((m: any, idx: number) => ({
        ten_phim: m.ten,
        revenue: totalRev * (0.4 - idx * 0.05), // fallback mock distribution
        tickets: Math.floor(totalTix * (0.4 - idx * 0.05)),
        percentage: Math.floor((0.4 - idx * 0.05) * 100)
      })));

      setRevenueByCinema(cinemas.map((r: any) => ({
        ten_rap: r.ten,
        revenue: totalRev / (cinemas.length || 1),
        tickets: Math.floor(totalTix / (cinemas.length || 1))
      })));

      // Category Revenue (Mock breakdown until ChiTietHoaDonDichVu is available)
      const catRev = [
        { name: 'Vé phim', value: totalRev * 0.8, color: '#dc3545' },
        { name: 'F&B', value: totalRev * 0.2, color: '#ffc107' }
      ];
      setCategoryRevenue(catRev);

    } catch (e) {
      console.error('Error fetching report data:', e);
    } finally {
      setLoading(false);
    }
  };

  const [categoryRevenue, setCategoryRevenue] = useState<any[]>([]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 fw-bold">Báo cáo & Thống kê</h2>
          <p className="text-muted mb-0">Phân tích doanh thu và hiệu suất kinh doanh</p>
        </div>
        {loading && (
          <div className="spinner-border text-danger mx-3" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        )}
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

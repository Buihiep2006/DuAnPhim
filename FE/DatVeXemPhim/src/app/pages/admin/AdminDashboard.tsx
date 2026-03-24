import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Badge } from 'react-bootstrap';
import { 
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const API = 'http://localhost:9999/api/admin';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTickets: 0,
    totalUsers: 0,
    activeMovies: 0
  });

  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [topMovies, setTopMovies] = useState<any[]>([]);
  const [movieStats, setMovieStats] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [phimRes, khRes, hdRes] = await Promise.all([
        fetch(`${API}/phim`),
        fetch(`${API}/khach-hang`),
        fetch(`${API}/hoa-don`)
      ]);
      
      const [phimJson, khJson, hdJson] = await Promise.all([
        phimRes.json(), khRes.json(), hdRes.json()
      ]);

      const movies = phimJson.data || [];
      const customers = khJson.data || [];
      const invoices = hdJson.data || [];

      // Calculate Stats
      const paidInvoices = invoices.filter((i: any) => i.trangThai === 1);
      const today = new Date();
      
      const computedMovieStatus = movies.map((m: any) => {
        let status = 0; // Sắp chiếu
        if (m.ngayCongChieu && new Date(m.ngayCongChieu) <= today && (!m.ngayKetThuc || new Date(m.ngayKetThuc) >= today)) status = 1; // Đang chiếu
        if (m.ngayKetThuc && new Date(m.ngayKetThuc) < today) status = 2; // Đã kết thúc
        return { ...m, computedStatus: status };
      });

      const activeMoviesCount = computedMovieStatus.filter((m: any) => m.computedStatus === 1).length;
      const totalRev = paidInvoices.reduce((sum: number, inv: any) => sum + (inv.tongTienThanhToan || 0), 0);
      
      setStats({
        totalRevenue: totalRev,
        totalTickets: paidInvoices.length, // approximation: 1 invoice = ~1 ticket/booking
        totalUsers: customers.length,
        activeMovies: activeMoviesCount
      });

      // Recent Activities (Latest 5 invoices)
      const sortedInvoices = [...invoices].sort((a, b) => new Date(b.thoiGianTao).getTime() - new Date(a.thoiGianTao).getTime()).slice(0, 5);
      setRecentActivities(sortedInvoices.map((inv: any, idx: number) => ({
        id: inv.id || idx,
        user: inv.tenKhachHang || 'Khách hàng',
        action: inv.trangThai === 1 ? 'Thanh toán thành công' : inv.trangThai === 0 ? 'Chờ thanh toán' : 'Hủy vé',
        time: inv.thoiGianTao ? new Date(inv.thoiGianTao).toLocaleString('vi-VN') : 'N/A',
        type: inv.trangThai === 1 ? 'payment' : inv.trangThai === 0 ? 'booking' : 'cancel'
      })));

      // Pie Chart Data
      setMovieStats([
        { name: 'Sắp chiếu', value: computedMovieStatus.filter((m: any) => m.computedStatus === 0).length, color: '#ffc107' },
        { name: 'Đang chiếu', value: activeMoviesCount, color: '#28a745' },
        { name: 'Kết thúc', value: computedMovieStatus.filter((m: any) => m.computedStatus === 2).length, color: '#6c757d' }
      ].filter(item => item.value > 0));

      // Top Movies (Mock computation, as we don't have direct ticket-to-movie mapping right now without ChiTietHoaDon)
      // Displaying first 5 movies
      setTopMovies(computedMovieStatus.slice(0, 5).map((m: any, idx: number) => ({
        id: m.id,
        title: m.ten,
        tickets: Math.floor(Math.random() * 100) + 10, // still a bit of mock data just to not crash the view
        revenue: Math.floor(Math.random() * 10000000) + 1000000,
        rating: 4.5 + (0.1 * idx)
      })));

      // Revenue Data (group by month, real aggregation)
      const revData = [];
      const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
      const todayDate = new Date();
      
      for(let i=5; i>=0; i--) {
        const d = new Date(todayDate.getFullYear(), todayDate.getMonth() - i, 1);
        const mIdx = d.getMonth();
        const year = d.getFullYear();
        
        const monthInvoices = paidInvoices.filter((inv: any) => {
          const invDate = new Date(inv.thoiGianTao);
          return invDate.getMonth() === mIdx && invDate.getFullYear() === year;
        });
        
        const mRev = monthInvoices.reduce((sum: number, inv: any) => sum + (inv.tongTienThanhToan || 0), 0);
        revData.push({ 
          month: months[mIdx], 
          revenue: mRev, 
          tickets: monthInvoices.length 
        });
      }
      setRevenueData(revData);

    } catch (e) {
      console.error('Error fetching dashboard data:', e);
    }
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
      case 'booking': return 'warning';
      case 'payment': return 'success';
      case 'cancel': return 'danger';
      case 'movie': return 'primary';
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

      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Tổng doanh thu</p>
                  <h3 className="mb-2 fw-bold">{(stats.totalRevenue / 1000000).toFixed(1)}M</h3>
                </div>
                <div className="bg-success bg-opacity-10 rounded p-3"><i className="bi bi-currency-dollar fs-4 text-success"></i></div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Hóa đơn đã thanh toán</p>
                  <h3 className="mb-2 fw-bold">{stats.totalTickets.toLocaleString('vi-VN')}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 rounded p-3"><i className="bi bi-receipt fs-4 text-primary"></i></div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Khách hàng</p>
                  <h3 className="mb-2 fw-bold">{stats.totalUsers.toLocaleString('vi-VN')}</h3>
                </div>
                <div className="bg-warning bg-opacity-10 rounded p-3"><i className="bi bi-people fs-4 text-warning"></i></div>
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
                </div>
                <div className="bg-danger bg-opacity-10 rounded p-3"><i className="bi bi-film fs-4 text-danger"></i></div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="mb-3 fw-semibold">Doanh thu 6 tháng gần đây</h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => `${(value / 1000000).toFixed(1)}M VND`} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#dc3545" strokeWidth={3} name="Doanh thu" />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="mb-3 fw-semibold">Trạng thái Phim</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={movieStats} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {movieStats.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={7}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="mb-3 fw-semibold">Danh sách Phim</h5>
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="bg-light">
                    <tr><th>Phim</th><th className="text-center">Trạng thái tham khảo</th></tr>
                  </thead>
                  <tbody>
                    {topMovies.map((movie) => (
                      <tr key={movie.id}>
                        <td><div className="d-flex align-items-center"><div className="bg-danger bg-opacity-10 rounded p-2 me-2"><i className="bi bi-film text-danger"></i></div><span className="fw-semibold">{movie.title}</span></div></td>
                        <td className="text-center"><Badge bg="info">Trong thư viện</Badge></td>
                      </tr>
                    ))}
                    {topMovies.length === 0 && <tr><td colSpan={2} className="text-center text-muted">Chưa có dữ liệu</td></tr>}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="mb-3 fw-semibold">Hoạt động Hóa đơn gần đây</h5>
              <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="d-flex align-items-start mb-3 pb-3 border-bottom">
                    <div className={`bg-${getActivityColor(activity.type)} bg-opacity-10 rounded p-2 me-3`}><i className={`bi ${getActivityIcon(activity.type)} text-${getActivityColor(activity.type)}`}></i></div>
                    <div className="flex-grow-1"><div className="fw-semibold">{activity.user}</div><div className="text-muted small">{activity.action}</div><div className="text-muted small"><i className="bi bi-clock me-1"></i>{activity.time}</div></div>
                  </div>
                ))}
                {recentActivities.length === 0 && <div className="text-center text-muted">Chưa có hoạt động</div>}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;

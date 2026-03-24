import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Form, InputGroup, Badge, Modal, Pagination } from 'react-bootstrap';

interface Invoice {
  id: string; maHoaDon: string; khachHangId: string; nhanVienId: string; khuyenMaiId: string;
  tongTienBanDau: number; soTienGiam: number; tongTienThanhToan: number;
  diemThuongSuDung: number; diemThuongNhanDuoc: number;
  thoiGianTao: string; thoiGianHetHanGiuGhe: string; trangThai: number;
  tenKhachHang?: string; tenNhanVien?: string;
}

const AdminInvoices: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<Invoice | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const API = 'http://localhost:9999/api/admin';

  useEffect(() => {
    fetchInvoices();
    fetch(`${API}/khach-hang`).then(r => r.json()).then(r => setCustomers(r.data || [])).catch(console.error);
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await fetch(`${API}/hoa-don`);
      const json = await res.json();
      if (json.success && json.data) {
        setInvoices(json.data.map((h: any) => ({
          id: h.id, maHoaDon: h.maHoaDon || '', khachHangId: h.khachHangId || '',
          nhanVienId: h.nhanVienId || '', khuyenMaiId: h.khuyenMaiId || '',
          tongTienBanDau: h.tongTienBanDau || 0, soTienGiam: h.soTienGiam || 0,
          tongTienThanhToan: h.tongTienThanhToan || 0,
          diemThuongSuDung: h.diemThuongSuDung || 0, diemThuongNhanDuoc: h.diemThuongNhanDuoc || 0,
          thoiGianTao: h.thoiGianTao || '', thoiGianHetHanGiuGhe: h.thoiGianHetHanGiuGhe || '',
          trangThai: h.trangThai ?? 0,
          tenKhachHang: h.tenKhachHang || '', tenNhanVien: h.tenNhanVien || ''
        })));
      }
    } catch (e) { console.error(e); }
  };

  const getCustomerName = (id: string) => customers.find(c => c.id === id)?.hoTen || id?.substring(0, 8) || 'N/A';

  const getStatusBadge = (s: number) => {
    switch (s) {
      case 0: return <Badge bg="warning">Chờ thanh toán</Badge>;
      case 1: return <Badge bg="success">Đã thanh toán</Badge>;
      case 2: return <Badge bg="danger">Đã hủy</Badge>;
      case 3: return <Badge bg="secondary">Hết hạn</Badge>;
      default: return <Badge bg="secondary">Không rõ</Badge>;
    }
  };

  const formatMoney = (v: number) => (v || 0).toLocaleString('vi-VN') + ' ₫';
  const formatDate = (d: string) => d ? new Date(d).toLocaleString('vi-VN') : 'N/A';

  const handleView = (inv: Invoice) => { setSelected(inv); setShowModal(true); };

  const filtered = invoices.filter(inv => {
    const s = (inv.maHoaDon || '').toLowerCase().includes(searchTerm.toLowerCase());
    if (filterStatus === 'all') return s;
    return s && inv.trangThai.toString() === filterStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paged = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterStatus]);

  const renderPag = () => {
    if (totalPages <= 1) return null;
    const items = []; for (let i = 1; i <= totalPages; i++) items.push(<Pagination.Item key={i} active={i === currentPage} onClick={() => setCurrentPage(i)}>{i}</Pagination.Item>);
    return <Pagination className="mb-0"><Pagination.Prev disabled={currentPage===1} onClick={()=>setCurrentPage(p=>p-1)}/>{items}<Pagination.Next disabled={currentPage===totalPages} onClick={()=>setCurrentPage(p=>p+1)}/></Pagination>;
  };

  const totalRevenue = invoices.filter(i => i.trangThai === 1).reduce((s, i) => s + (i.tongTienThanhToan || 0), 0);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div><h2 className="mb-1 fw-bold">Quản lý Hóa đơn</h2><p className="text-muted mb-0">Theo dõi và quản lý tất cả hóa đơn</p></div>
      </div>

      <Row className="g-3 mb-4">
        {[
          { label: 'Tổng hóa đơn', count: invoices.length.toString(), icon: 'bi-receipt', color: 'primary' },
          { label: 'Đã thanh toán', count: invoices.filter(i=>i.trangThai===1).length.toString(), icon: 'bi-check-circle', color: 'success' },
          { label: 'Chờ thanh toán', count: invoices.filter(i=>i.trangThai===0).length.toString(), icon: 'bi-clock', color: 'warning' },
          { label: 'Doanh thu', count: formatMoney(totalRevenue), icon: 'bi-cash-stack', color: 'danger' },
        ].map((s, i) => (
          <Col md={3} key={i}><Card className="border-0 shadow-sm"><Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div><p className="text-muted mb-1 small">{s.label}</p><h4 className="mb-0 fw-bold" style={{fontSize: s.label === 'Doanh thu' ? '1.1rem' : undefined}}>{s.count}</h4></div>
              <div className={`bg-${s.color} bg-opacity-10 rounded p-2`}><i className={`bi ${s.icon} fs-5 text-${s.color}`}></i></div>
            </div>
          </Card.Body></Card></Col>
        ))}
      </Row>

      <Card className="border-0 shadow-sm mb-4"><Card.Body><Row className="g-3">
        <Col md={8}><InputGroup><InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
          <Form.Control placeholder="Tìm theo mã hóa đơn..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/></InputGroup></Col>
        <Col md={4}><Form.Select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
          <option value="all">Tất cả trạng thái</option><option value="0">Chờ thanh toán</option><option value="1">Đã thanh toán</option><option value="2">Đã hủy</option><option value="3">Hết hạn</option>
        </Form.Select></Col>
      </Row></Card.Body></Card>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0"><div className="table-responsive"><Table hover className="mb-0">
          <thead className="bg-light"><tr>
            <th className="text-center" style={{ width: '120px' }}>Mã HĐ</th><th className="text-start">Khách hàng</th><th className="text-end">Tổng tiền</th><th className="text-end">Giảm giá</th>
            <th className="text-end">Thanh toán</th><th className="text-center">Thời gian</th><th className="text-center">Trạng thái</th>
            <th className="text-center text-nowrap" style={{width:'80px'}}>Chi tiết</th>
          </tr></thead>
          <tbody>
            {paged.map(inv=>(
              <tr key={inv.id}>
                <td className="text-center"><span className="badge bg-light text-dark border">{inv.maHoaDon}</span></td>
                <td className="text-start"><div className="fw-semibold small">{inv.tenKhachHang || getCustomerName(inv.khachHangId)}</div></td>
                <td className="text-end">{formatMoney(inv.tongTienBanDau)}</td>
                <td className="text-end text-danger">{inv.soTienGiam > 0 ? '-' + formatMoney(inv.soTienGiam) : '—'}</td>
                <td className="text-end fw-bold text-success">{formatMoney(inv.tongTienThanhToan)}</td>
                <td className="text-center small">{formatDate(inv.thoiGianTao)}</td>
                <td className="text-center">{getStatusBadge(inv.trangThai)}</td>
                <td className="text-center text-nowrap">
                  <Button variant="outline-info" size="sm" onClick={()=>handleView(inv)}><i className="bi bi-eye"></i></Button>
                </td>
              </tr>
            ))}
            {paged.length===0&&<tr><td colSpan={8} className="text-center text-muted py-4">Không có dữ liệu</td></tr>}
          </tbody>
        </Table></div></Card.Body>
        <Card.Footer className="bg-white"><div className="d-flex justify-content-between align-items-center">
          <div className="text-muted small">Hiển thị {Math.min((currentPage-1)*itemsPerPage+1,filtered.length)}-{Math.min(currentPage*itemsPerPage,filtered.length)} / {filtered.length}</div>
          {renderPag()}
        </div></Card.Footer>
      </Card>

      <Modal show={showModal} onHide={()=>setShowModal(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>Chi tiết hóa đơn</Modal.Title></Modal.Header>
        <Modal.Body>{selected&&(
          <div>
            <div className="text-center mb-4">
              <h5 className="fw-bold">Hóa đơn #{selected.maHoaDon}</h5>
              {getStatusBadge(selected.trangThai)}
            </div>
            <Row className="g-3">
              {[
                ['Mã hóa đơn', selected.maHoaDon],
                ['Khách hàng', selected.tenKhachHang || getCustomerName(selected.khachHangId)],
                ['Thời gian tạo', formatDate(selected.thoiGianTao)],
                ['Hết hạn giữ ghế', formatDate(selected.thoiGianHetHanGiuGhe)],
              ].map(([l,v],i)=>(
                <Col md={6} key={i}><Card className="border"><Card.Body><small className="text-muted">{l}</small><div className="fw-semibold">{v||'N/A'}</div></Card.Body></Card></Col>
              ))}
            </Row>
            <hr/>
            <h6 className="fw-bold mb-3">Thông tin thanh toán</h6>
            <Table bordered size="sm">
              <tbody>
                <tr><td>Tổng tiền ban đầu</td><td className="text-end">{formatMoney(selected.tongTienBanDau)}</td></tr>
                <tr><td>Số tiền giảm</td><td className="text-end text-danger">-{formatMoney(selected.soTienGiam)}</td></tr>
                <tr className="fw-bold"><td>Tổng thanh toán</td><td className="text-end text-success">{formatMoney(selected.tongTienThanhToan)}</td></tr>
                <tr><td>Điểm thưởng sử dụng</td><td className="text-end">{selected.diemThuongSuDung || 0}</td></tr>
                <tr><td>Điểm thưởng nhận được</td><td className="text-end text-warning">{selected.diemThuongNhanDuoc || 0}</td></tr>
              </tbody>
            </Table>
          </div>
        )}</Modal.Body>
        <Modal.Footer><Button variant="secondary" onClick={()=>setShowModal(false)}>Đóng</Button></Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminInvoices;

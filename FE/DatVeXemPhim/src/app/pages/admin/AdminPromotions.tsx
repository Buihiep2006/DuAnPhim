import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Form, InputGroup, Badge, Modal, Pagination } from 'react-bootstrap';
import { toast } from 'sonner';

interface Promotion {
  id: string; maCode: string; ten: string;
  phanTramGiam: number; giamToiDa: number;
  soLuong: number; thoiGianBatDau: string; thoiGianKetThuc: string;
  moTa: string; trangThai: number;
}

const API = 'http://localhost:9999/api/admin';

const AdminPromotions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add'|'edit'>('add');
  
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);
  const [formData, setFormData] = useState({
    maCode: '', ten: '', phanTramGiam: 0, giamToiDa: 0, soLuong: 0,
    thoiGianBatDau: '', thoiGianKetThuc: '', moTa: '', trangThai: 1
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [errors, setErrors] = useState<{[key:string]: string}>({});

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const promoRes = await fetch(`${API}/khuyen-mai`);
      const promoJson = await promoRes.json();
      
      if (promoJson.success && promoJson.data) {
        setPromotions(promoJson.data);
      }
    } catch (e) {
      console.error(e);
      toast.error('Lỗi khi tải dữ liệu khuyến mãi');
    }
  };

  const handleSave = async () => {
    const newErrors: any = {};
    const trimmedMa = (formData.maCode || '').trim().toUpperCase();
    const trimmedTen = (formData.ten || '').trim();

    if (!trimmedMa) newErrors.maCode = 'Mã code khuyến mãi không được để trống';
    else if (!/^[A-Z0-9_-]+$/.test(trimmedMa)) newErrors.maCode = 'Mã code khuyến mãi chỉ gồm chữ in hoa, số, gạch nối, gạch dưới';

    if (!trimmedTen) newErrors.ten = 'Tên khuyến mãi không được để trống';

    if (!formData.thoiGianBatDau) newErrors.thoiGianBatDau = 'Ngày bắt đầu khuyến mãi không được để trống';
    if (!formData.thoiGianKetThuc) newErrors.thoiGianKetThuc = 'Ngày kết thúc khuyến mãi không được để trống';

    if (formData.thoiGianBatDau && formData.thoiGianKetThuc) {
      if (new Date(formData.thoiGianBatDau) > new Date(formData.thoiGianKetThuc)) {
        newErrors.thoiGianKetThuc = 'Ngày kết thúc không được trước ngày bắt đầu';
      }
    }

    if (formData.phanTramGiam < 0 || formData.phanTramGiam > 100) newErrors.phanTramGiam = 'Phần trăm giảm khuyến mãi phải từ 0-100';
    if (formData.soLuong <= 0) newErrors.soLuong = 'Số lượng mã khuyến mãi phải lớn hơn 0';
    if (formData.giamToiDa < 0) newErrors.giamToiDa = 'Số tiền giảm tối đa không được âm';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Vui lòng kiểm tra lại thông tin!');
      return;
    }

    try {
      const startDT = formData.thoiGianBatDau.includes('T') ? formData.thoiGianBatDau : `${formData.thoiGianBatDau}T00:00:00`;
      const endDT = formData.thoiGianKetThuc.includes('T') ? formData.thoiGianKetThuc : `${formData.thoiGianKetThuc}T23:59:59`;
      
      const payload = {
        ...formData,
        maCode: trimmedMa,
        ten: trimmedTen,
        thoiGianBatDau: startDT,
        thoiGianKetThuc: endDT
      };

      const method = modalMode === 'add' ? 'POST' : 'PUT';
      const url = modalMode === 'add' ? `${API}/khuyen-mai` : `${API}/khuyen-mai/${selectedPromo?.id}`;
      
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      
      if (data.success || res.ok) {
        toast.success(modalMode === 'add' ? 'Tạo khuyến mãi thành công!' : 'Cập nhật thành công!');
        setShowModal(false);
        fetchAll();
      } else {
        if (data.data && typeof data.data === 'object' && Object.keys(data.data).length > 0) {
          setErrors(data.data as any);
          toast.error('Vui lòng kiểm tra lại thông tin nhập!');
        } else {
          let errorMsg = data.message || 'Thao tác thất bại';
          if (data.data && typeof data.data === 'object') {
            errorMsg += '\n' + Object.entries(data.data).map(([k, v]) => `- ${k}: ${v}`).join('\n');
          }
          toast.error('Lỗi: ' + errorMsg);
        }
      }
    } catch (e) {
      toast.error('Lỗi hệ thống');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khuyến mãi này?')) {
      try {
        const res = await fetch(`${API}/khuyen-mai/${id}`, { method: 'DELETE' });
        if (res.ok) {
          toast.success('Xóa khuyến mãi thành công!');
          fetchAll();
        }
      } catch (e) { toast.error('Lỗi khi xóa'); }
    }
  };

  const handleAdd = () => {
    setModalMode('add');
    setSelectedPromo(null);
    setFormData({ maCode: '', ten: '', phanTramGiam: 0, giamToiDa: 0, soLuong: 0, thoiGianBatDau: '', thoiGianKetThuc: '', moTa: '', trangThai: 1 });
    setErrors({});
    setShowModal(true);
  };

  const handleEdit = (p: Promotion) => {
    setModalMode('edit');
    setSelectedPromo(p);
    setFormData({
      maCode: p.maCode||'', ten: p.ten||'', phanTramGiam: p.phanTramGiam||0, giamToiDa: p.giamToiDa||0, soLuong: p.soLuong||0,
      thoiGianBatDau: p.thoiGianBatDau ? p.thoiGianBatDau.split('T')[0] : '', 
      thoiGianKetThuc: p.thoiGianKetThuc ? p.thoiGianKetThuc.split('T')[0] : '',
      moTa: p.moTa||'', trangThai: p.trangThai??1
    });
    setErrors({});
    setShowModal(true);
  };

  const filtered = promotions.filter(promo => {
    const s = (promo.ten||'').toLowerCase().includes(searchTerm.toLowerCase()) || (promo.maCode||'').toLowerCase().includes(searchTerm.toLowerCase());
    const m = filterStatus === 'all' || promo.trangThai.toString() === filterStatus;
    return s && m;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paged = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterStatus]);

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const items = [];
    for (let i = 1; i <= totalPages; i++) items.push(<Pagination.Item key={i} active={i === currentPage} onClick={() => setCurrentPage(i)}>{i}</Pagination.Item>);
    return <Pagination className="mb-0"><Pagination.Prev disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} />{items}<Pagination.Next disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} /></Pagination>;
  };

  const formatDate = (date: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const isExpired = (endDate: string) => {
    if (!endDate) return false;
    return new Date(endDate) < new Date();
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div><h2 className="mb-1 fw-bold">Quản lý Khuyến mãi</h2><p className="text-muted mb-0">Quản lý mã giảm giá và chương trình khuyến mãi</p></div>
        <Button variant="danger" onClick={handleAdd}><i className="bi bi-plus-circle me-2"></i>Tạo khuyến mãi</Button>
      </div>

      <Row className="g-3 mb-4">
        <Col md={4}><Card className="border-0 shadow-sm"><Card.Body><div className="d-flex justify-content-between align-items-start">
          <div><p className="text-muted mb-1 small">Tổng khuyến mãi</p><h4 className="mb-0 fw-bold">{promotions.length}</h4></div>
          <div className="bg-primary bg-opacity-10 rounded p-2"><i className="bi bi-tag fs-5 text-primary"></i></div>
        </div></Card.Body></Card></Col>
        <Col md={4}><Card className="border-0 shadow-sm"><Card.Body><div className="d-flex justify-content-between align-items-start">
          <div><p className="text-muted mb-1 small">Đang hoạt động</p><h4 className="mb-0 fw-bold">{promotions.filter(p => p.trangThai === 1).length}</h4></div>
          <div className="bg-success bg-opacity-10 rounded p-2"><i className="bi bi-check-circle fs-5 text-success"></i></div>
        </div></Card.Body></Card></Col>
        <Col md={4}><Card className="border-0 shadow-sm"><Card.Body><div className="d-flex justify-content-between align-items-start">
          <div><p className="text-muted mb-1 small">Đã hết hạn/tắt</p><h4 className="mb-0 fw-bold">{promotions.filter(p => p.trangThai !== 1 || isExpired(p.thoiGianKetThuc)).length}</h4></div>
          <div className="bg-danger bg-opacity-10 rounded p-2"><i className="bi bi-x-circle fs-5 text-danger"></i></div>
        </div></Card.Body></Card></Col>
      </Row>

      <Card className="border-0 shadow-sm mb-4">
        <Card.Body><Row className="g-3">
          <Col md={6}><InputGroup><InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text><Form.Control placeholder="Tìm kiếm khuyến mãi..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></InputGroup></Col>
          <Col md={3}><Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Tất cả trạng thái</option><option value="1">Đang hoạt động</option><option value="0">Tạm tắt</option>
          </Form.Select></Col>
        </Row></Card.Body>
      </Card>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0"><div className="table-responsive"><Table hover className="mb-0">
          <thead className="bg-light"><tr>
            <th className="text-center">Mã</th><th className="text-start">Tên chương trình</th><th className="text-end">Giảm giá</th><th className="text-center">Số lượng</th>
            <th className="text-start">Thời gian</th><th className="text-center">Trạng thái</th><th className="text-center text-nowrap">Thao tác</th>
          </tr></thead>
          <tbody>
            {paged.map(promo => (
              <tr key={promo.id}>
                <td className="text-center"><Badge bg="danger" className="font-monospace">{promo.maCode}</Badge></td>
                <td className="text-start"><div className="fw-semibold">{promo.ten}</div><small className="text-muted">{promo.moTa}</small></td>
                <td className="text-end"><div className="fw-bold text-danger">{promo.phanTramGiam}%</div><small className="text-muted">Tối đa {(promo.giamToiDa / 1000).toFixed(0)}K</small></td>
                <td className="text-center"><Badge bg="primary">{promo.soLuong}</Badge></td>
                <td className="text-start"><div className="small"><div><i className="bi bi-calendar-check me-1 text-success"></i> {formatDate(promo.thoiGianBatDau)}</div><div><i className="bi bi-calendar-x me-1 text-danger"></i> {formatDate(promo.thoiGianKetThuc)}</div></div></td>
                <td className="text-center">
                  {isExpired(promo.thoiGianKetThuc) ? <Badge bg="secondary">Đã hết hạn</Badge> : promo.trangThai === 1 ? <Badge bg="success">Đang hoạt động</Badge> : <Badge bg="secondary">Đã tắt</Badge>}
                </td>
                <td className="text-center text-nowrap">
                  <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleEdit(promo)}><i className="bi bi-pencil"></i></Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(promo.id)}><i className="bi bi-trash"></i></Button>
                </td>
              </tr>
            ))}
            {paged.length === 0 && <tr><td colSpan={8} className="text-center text-muted py-4">Không tìm thấy khuyến mãi nào</td></tr>}
          </tbody>
        </Table></div></Card.Body>
        <Card.Footer className="bg-white"><div className="d-flex justify-content-between align-items-center">
          <div className="text-muted small">Hiển thị {Math.min((currentPage-1)*itemsPerPage+1, filtered.length)}-{Math.min(currentPage*itemsPerPage, filtered.length)} / {filtered.length}</div>
          {renderPagination()}
        </div></Card.Footer>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>{modalMode==='add'?'Tạo khuyến mãi mới':'Cập nhật khuyến mãi'}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Mã khuyến mãi</Form.Label>
                <Form.Control isInvalid={!!errors.maCode} value={formData.maCode} onChange={e=>setFormData(p=>({...p, maCode: e.target.value}))} />
                <Form.Control.Feedback type="invalid">{errors.maCode}</Form.Control.Feedback>
              </Form.Group></Col>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Tên chương trình</Form.Label>
                <Form.Control isInvalid={!!errors.ten} value={formData.ten} onChange={e=>setFormData(p=>({...p, ten: e.target.value}))} />
                <Form.Control.Feedback type="invalid">{errors.ten}</Form.Control.Feedback>
              </Form.Group></Col>
            </Row>
            <Row>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Phần trăm giảm (%)</Form.Label>
                <Form.Control type="number" isInvalid={!!errors.phanTramGiam} value={formData.phanTramGiam} onChange={e=>setFormData(p=>({...p, phanTramGiam: Number(e.target.value)}))} />
                <Form.Control.Feedback type="invalid">{errors.phanTramGiam}</Form.Control.Feedback>
              </Form.Group></Col>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Giảm tối đa (VND)</Form.Label>
                <InputGroup>
                  <Form.Control type="number" isInvalid={!!errors.giamToiDa} value={formData.giamToiDa} onChange={e=>setFormData(p=>({...p, giamToiDa: Number(e.target.value)}))} />
                  <InputGroup.Text>₫</InputGroup.Text>
                  <Form.Control.Feedback type="invalid">{errors.giamToiDa}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group></Col>
            </Row>
            <Row>
              <Col md={12}><Form.Group className="mb-3"><Form.Label>Số lượng mã</Form.Label>
                <Form.Control type="number" isInvalid={!!errors.soLuong} value={formData.soLuong} onChange={e=>setFormData(p=>({...p, soLuong: Number(e.target.value)}))} />
                <Form.Control.Feedback type="invalid">{errors.soLuong}</Form.Control.Feedback>
              </Form.Group></Col>
            </Row>
            <Row>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Ngày bắt đầu</Form.Label>
                <Form.Control type="date" isInvalid={!!errors.thoiGianBatDau} value={formData.thoiGianBatDau} onChange={e=>setFormData(p=>({...p, thoiGianBatDau: e.target.value}))} />
                <Form.Control.Feedback type="invalid">{errors.thoiGianBatDau}</Form.Control.Feedback>
              </Form.Group></Col>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Ngày kết thúc</Form.Label>
                <Form.Control type="date" isInvalid={!!errors.thoiGianKetThuc} value={formData.thoiGianKetThuc} onChange={e=>setFormData(p=>({...p, thoiGianKetThuc: e.target.value}))} />
                <Form.Control.Feedback type="invalid">{errors.thoiGianKetThuc}</Form.Control.Feedback>
              </Form.Group></Col>
            </Row>
            <Form.Group className="mb-3"><Form.Label>Mô tả chi tiết</Form.Label>
              <Form.Control as="textarea" rows={3} isInvalid={!!errors.moTa} value={formData.moTa} onChange={e=>setFormData(p=>({...p, moTa: e.target.value}))} />
              <Form.Control.Feedback type="invalid">{errors.moTa}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3"><Form.Label>Trạng thái</Form.Label><Form.Select value={formData.trangThai} onChange={e=>setFormData(p=>({...p, trangThai: Number(e.target.value)}))}>
              <option value={1}>Đang hoạt động</option><option value={0}>Tạm tắt</option>
            </Form.Select></Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
          <Button variant="danger" onClick={handleSave}>Lưu khuyến mãi</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminPromotions;

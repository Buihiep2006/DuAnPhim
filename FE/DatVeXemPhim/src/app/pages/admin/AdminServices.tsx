import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, InputGroup, Badge, Modal, Pagination } from 'react-bootstrap';
import { toast } from 'sonner';

interface ServiceType {
  id: string; ma: string; ten: string; moTa?: string; trangThai: number;
}

interface Service {
  id: string; ma: string; ten: string; loaiDichVuId: string;
  giaBan: number; hinhAnh: string; moTa: string; trangThai: number;
  tenLoaiDichVu?: string;
}

const API = 'http://localhost:9999/api/admin';

const AdminServices: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add'|'edit'>('add');
  const [services, setServices] = useState<Service[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [errors, setErrors] = useState<{[key:string]: string}>({});
  
  const [formData, setFormData] = useState({ ma: '', ten: '', loaiDichVuId: '', giaBan: 0, hinhAnh: '', moTa: '', trangThai: 1 });
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [svcRes, typeRes] = await Promise.all([ fetch(`${API}/dich-vu`), fetch(`${API}/loai-dich-vu`) ]);
      const [svcJson, typeJson] = await Promise.all([svcRes.json(), typeRes.json()]);
      const types = typeJson.data || [];
      setServiceTypes(types);
      
      if (svcJson.success && svcJson.data) {
        setServices(svcJson.data.map((s: any) => ({
          ...s,
          tenLoaiDichVu: types.find((t: any) => t.id === s.loaiDichVuId)?.ten || 'Khác'
        })));
      }
    } catch (e) { console.error('Lỗi tải dữ liệu dịch vụ', e); }
  };

  const handleSave = async () => {
    const newErrors: any = {};
    const trimmedMa = (formData.ma || '').trim().toUpperCase();
    const trimmedTen = (formData.ten || '').trim();

    if (!trimmedMa) newErrors.ma = 'Mã dịch vụ không được để trống';
    else if (!/^[A-Z0-9]+$/.test(trimmedMa)) newErrors.ma = 'Mã dịch vụ chỉ gồm chữ in hoa và số';

    if (!trimmedTen) newErrors.ten = 'Tên dịch vụ không được để trống';
    if (!formData.loaiDichVuId) newErrors.loaiDichVuId = 'Loại dịch vụ không được để trống';
    if (formData.giaBan <= 0) newErrors.giaBan = 'Giá bán dịch vụ phải lớn hơn 0';
    if (!(formData.hinhAnh || '').trim()) newErrors.hinhAnh = 'Hình ảnh dịch vụ không được để trống';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Vui lòng kiểm tra lại thông tin!');
      return;
    }

    try {
      const payload = { ...formData, ma: trimmedMa, ten: trimmedTen };
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      const url = modalMode === 'add' ? `${API}/dich-vu` : `${API}/dich-vu/${selectedService?.id}`;
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success || res.ok) {
        toast.success(modalMode === 'add' ? 'Thêm dịch vụ thành công!' : 'Cập nhật thành công!');
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
    } catch (e) { toast.error('Lỗi hệ thống'); }
  };

  const handleDeleteService = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
      try {
        const res = await fetch(`${API}/dich-vu/${id}`, { method: 'DELETE' });
        if (res.ok) { toast.success('Xóa dịch vụ thành công!'); fetchAll(); }
      } catch (e) { toast.error('Lỗi khi xóa'); }
    }
  };

  const handleAdd = () => {
    setModalMode('add'); setSelectedService(null);
    setFormData({ ma: '', ten: '', loaiDichVuId: '', giaBan: 0, hinhAnh: '', moTa: '', trangThai: 1 });
    setErrors({});
    setShowModal(true);
  };

  const handleEdit = (s: Service) => {
    setModalMode('edit'); setSelectedService(s);
    setFormData({ ma: s.ma||'', ten: s.ten||'', loaiDichVuId: s.loaiDichVuId||'', giaBan: s.giaBan||0, hinhAnh: s.hinhAnh||'', moTa: s.moTa||'', trangThai: s.trangThai??1 });
    setErrors({});
    setShowModal(true);
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = (service.ten||'').toLowerCase().includes(searchTerm.toLowerCase()) || (service.ma||'').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || service.loaiDichVuId === filterType;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterType]);

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const items = [];
    for (let i = 1; i <= totalPages; i++) items.push(<Pagination.Item key={i} active={i === currentPage} onClick={() => setCurrentPage(i)}>{i}</Pagination.Item>);
    return <Pagination className="justify-content-center mt-4"><Pagination.Prev disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} />{items}<Pagination.Next disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} /></Pagination>;
  };

  const getTypeColor = (typeName: string) => {
    if (typeName.toLowerCase().includes('combo')) return 'danger';
    if (typeName.toLowerCase().includes('bắp')) return 'warning';
    if (typeName.toLowerCase().includes('nước')) return 'info';
    if (typeName.toLowerCase().includes('snack')) return 'success';
    return 'secondary';
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 fw-bold">Quản lý Dịch vụ F&B</h2>
          <p className="text-muted mb-0">Quản lý combo bắp nước và các dịch vụ</p>
        </div>
        <Button variant="danger" onClick={handleAdd}>
          <i className="bi bi-plus-circle me-2"></i>Thêm dịch vụ
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="g-3 mb-4">
        <Col md={3}><Card className="border-0 shadow-sm"><Card.Body><div className="d-flex justify-content-between align-items-start">
          <div><p className="text-muted mb-1 small">Tổng dịch vụ</p><h4 className="mb-0 fw-bold">{services.length}</h4></div>
          <div className="bg-primary bg-opacity-10 rounded p-2"><i className="bi bi-cup-straw fs-5 text-primary"></i></div>
        </div></Card.Body></Card></Col>
        <Col md={3}><Card className="border-0 shadow-sm"><Card.Body><div className="d-flex justify-content-between align-items-start">
          <div><p className="text-muted mb-1 small">Combo</p><h4 className="mb-0 fw-bold">{services.filter(s => (s.tenLoaiDichVu||'').toLowerCase().includes('combo')).length}</h4></div>
          <div className="bg-danger bg-opacity-10 rounded p-2"><i className="bi bi-box fs-5 text-danger"></i></div>
        </div></Card.Body></Card></Col>
        <Col md={3}><Card className="border-0 shadow-sm"><Card.Body><div className="d-flex justify-content-between align-items-start">
          <div><p className="text-muted mb-1 small">Loại dịch vụ</p><h4 className="mb-0 fw-bold">{serviceTypes.length}</h4></div>
          <div className="bg-warning bg-opacity-10 rounded p-2"><i className="bi bi-tags fs-5 text-warning"></i></div>
        </div></Card.Body></Card></Col>
        <Col md={3}><Card className="border-0 shadow-sm"><Card.Body><div className="d-flex justify-content-between align-items-start">
          <div><p className="text-muted mb-1 small">Đang hoạt động</p><h4 className="mb-0 fw-bold">{services.filter(s=>s.trangThai === 1).length}</h4></div>
          <div className="bg-success bg-opacity-10 rounded p-2"><i className="bi bi-check-circle fs-5 text-success"></i></div>
        </div></Card.Body></Card></Col>
      </Row>

      {/* Filters */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
                <Form.Control placeholder="Tìm kiếm dịch vụ..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="all">Tất cả loại</option>
                {serviceTypes.map(t => <option key={t.id} value={t.id}>{t.ten}</option>)}
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Services Grid */}
      <Row className="g-4">
        {paginatedServices.map((service) => (
          <Col key={service.id} md={4} lg={3}>
            <Card className="border-0 shadow-sm h-100">
              <div style={{ height: 200, backgroundImage: `url(${service.hinhAnh})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                <Badge bg={getTypeColor(service.tenLoaiDichVu||'Khác')} style={{ position: 'absolute', top: 10, right: 10 }}>{service.tenLoaiDichVu}</Badge>
              </div>
              <Card.Body>
                <div className="mb-2">
                  <Badge bg="light" text="dark" className="border me-2">{service.ma}</Badge>
                  <Badge bg={service.trangThai === 1 ? 'success' : 'secondary'}>{service.trangThai === 1 ? 'Còn hàng' : 'Hết hàng'}</Badge>
                </div>
                <h6 className="fw-semibold mb-2">{service.ten}</h6>
                <p className="text-muted small mb-3">{service.moTa}</p>
                <div className="d-flex justify-content-between align-items-center mt-auto pt-3">
                  <div className="text-danger fw-bold fs-5">{(service.giaBan||0).toLocaleString('vi-VN')} ₫</div>
                  <div className="text-nowrap">
                    <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleEdit(service)}><i className="bi bi-pencil"></i></Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteService(service.id)}><i className="bi bi-trash"></i></Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
        {paginatedServices.length === 0 && <Col xs={12} className="text-center text-muted py-5">Không tìm thấy dịch vụ nào</Col>}
      </Row>
      
      {renderPagination()}

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>{modalMode === 'add' ? 'Thêm dịch vụ' : 'Cập nhật dịch vụ'}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3"><Form.Label>Mã dịch vụ</Form.Label>
              <Form.Control isInvalid={!!errors.ma} value={formData.ma} onChange={e=>setFormData(p=>({...p, ma: e.target.value}))} />
              <Form.Control.Feedback type="invalid">{errors.ma}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3"><Form.Label>Tên dịch vụ</Form.Label>
              <Form.Control isInvalid={!!errors.ten} value={formData.ten} onChange={e=>setFormData(p=>({...p, ten: e.target.value}))} />
              <Form.Control.Feedback type="invalid">{errors.ten}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Loại dịch vụ</Form.Label>
              <Form.Select isInvalid={!!errors.loaiDichVuId} value={formData.loaiDichVuId} onChange={e=>setFormData(p=>({...p, loaiDichVuId: e.target.value}))}>
                <option value="">-- Chọn loại --</option>
                {serviceTypes.map(t => <option key={t.id} value={t.id}>{t.ten}</option>)}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.loaiDichVuId}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Giá bán</Form.Label>
              <InputGroup>
                <Form.Control type="number" isInvalid={!!errors.giaBan} value={formData.giaBan} onChange={e=>setFormData(p=>({...p, giaBan: Number(e.target.value)}))} />
                <InputGroup.Text>₫</InputGroup.Text>
                <Form.Control.Feedback type="invalid">{errors.giaBan}</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3"><Form.Label>URL hình ảnh</Form.Label>
              <Form.Control isInvalid={!!errors.hinhAnh} value={formData.hinhAnh} onChange={e=>setFormData(p=>({...p, hinhAnh: e.target.value}))} />
              <Form.Control.Feedback type="invalid">{errors.hinhAnh}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3"><Form.Label>Mô tả</Form.Label>
              <Form.Control as="textarea" rows={3} isInvalid={!!errors.moTa} value={formData.moTa} onChange={e=>setFormData(p=>({...p, moTa: e.target.value}))} />
              <Form.Control.Feedback type="invalid">{errors.moTa}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select value={formData.trangThai} onChange={e=>setFormData(p=>({...p, trangThai: Number(e.target.value)}))}>
                <option value={1}>Còn hàng</option><option value={0}>Hết hàng</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
          <Button variant="danger" onClick={handleSave}>Lưu</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminServices;

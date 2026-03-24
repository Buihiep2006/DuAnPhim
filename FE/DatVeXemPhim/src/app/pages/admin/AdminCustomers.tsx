import React, { useState, useEffect } from 'react';
import { 
  Row, Col, Card, Table, Button, Form, InputGroup, 
  Badge, Modal, Pagination 
} from 'react-bootstrap';
import { toast } from 'sonner';

interface Customer {
  id: string;
  ma: string;
  hoTen: string;
  email: string;
  soDienThoai: string;
  ngaySinh: string;
  gioiTinh: number;
  authProvider: string;
  hinhAnhDaiDien: string;
  diemTichLuy: number;
  trangThai: number;
  ngayTao: string;
}

const AdminCustomers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [errors, setErrors] = useState<{[key:string]: string}>({});

  const [formData, setFormData] = useState({
    ma: '', hoTen: '', email: '', matKhau: '', soDienThoai: '',
    ngaySinh: '', gioiTinh: 0, trangThai: 1
  });

  const API_BASE = 'http://localhost:9999/api/admin';

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${API_BASE}/khach-hang`);
      const json = await res.json();
      if (json.success && json.data) {
        setCustomers(json.data.map((c: any) => ({
          id: c.id, ma: c.ma, hoTen: c.hoTen, email: c.email,
          soDienThoai: c.soDienThoai,
          ngaySinh: c.ngaySinh ? c.ngaySinh.split('T')[0] : '',
          gioiTinh: c.gioiTinh ?? 0, authProvider: c.authProvider || 'local',
          hinhAnhDaiDien: c.hinhAnhDaiDien || '',
          diemTichLuy: c.diemTichLuy ?? 0,
          trangThai: c.trangThai ?? 1,
          ngayTao: c.ngayTao ? c.ngayTao.split('T')[0] : ''
        })));
      }
    } catch (e) { console.error('Error fetching customers:', e); }
  };

  const handleSave = async () => {
    const newErrors: any = {};
    const trimmedMa = (formData.ma || '').trim();
    const trimmedHoTen = (formData.hoTen || '').trim();
    const trimmedEmail = (formData.email || '').trim();
    const trimmedSdt = (formData.soDienThoai || '').trim();

    // 1. Check trống & trim
    if (!trimmedMa) newErrors.ma = 'Mã khách hàng không được để trống';
    else if (!/^[a-zA-Z0-9]+$/.test(trimmedMa)) newErrors.ma = 'Mã khách hàng không được chứa ký tự đặc biệt hoặc khoảng trắng';

    if (!trimmedHoTen) newErrors.hoTen = 'Họ tên khách hàng không được để trống';
    
    // 2. Định dạng Email: *@gmail.com
    if (!trimmedEmail) newErrors.email = 'Email không được để trống';
    else if (!trimmedEmail.toLowerCase().endsWith('@gmail.com')) newErrors.email = 'Email phải có định dạng @gmail.com';

    // 3. Định dạng SĐT: bắt đầu bằng 0, 10-11 số
    if (!trimmedSdt) newErrors.soDienThoai = 'Số điện thoại không được để trống';
    else if (!trimmedSdt.startsWith('0')) newErrors.soDienThoai = 'Số điện thoại phải bắt đầu bằng số 0';
    else if (!/^\d{10,11}$/.test(trimmedSdt)) newErrors.soDienThoai = 'Số điện thoại phải có 10-11 chữ số';

    if (!formData.ngaySinh) newErrors.ngaySinh = 'Ngày sinh không được để trống';

    if (modalMode === 'add' && !formData.matKhau) newErrors.matKhau = 'Mật khẩu khách hàng không được để trống';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Vui lòng kiểm tra lại thông tin nhập!');
      return;
    }

    const payload = {
      ...formData,
      ma: trimmedMa,
      hoTen: trimmedHoTen,
      email: trimmedEmail,
      soDienThoai: trimmedSdt,
      ngaySinh: formData.ngaySinh ? formData.ngaySinh + 'T00:00:00' : null
    };
    const method = modalMode === 'add' ? 'POST' : 'PUT';
    const url = modalMode === 'add' ? `${API_BASE}/khach-hang` : `${API_BASE}/khach-hang/${selectedCustomer?.id}`;
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) {
        toast.success(modalMode === 'add' ? 'Thêm khách hàng thành công!' : 'Cập nhật thành công!');
        setShowModal(false); fetchCustomers();
      } else {
        if (data.data && typeof data.data === 'object' && Object.keys(data.data).length > 0) {
          setErrors(data.data as any);
          toast.error('Vui lòng kiểm tra lại thông tin nhập!');
        } else {
          let errorMsg = data.message || 'Không hợp lệ';
          if (data.data && typeof data.data === 'object') {
            errorMsg += '\n' + Object.entries(data.data).map(([k, v]) => `- ${k}: ${v}`).join('\n');
          }
          toast.error('Lỗi: ' + errorMsg);
        }
      }
    } catch { toast.error('Lỗi hệ thống'); }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Xóa khách hàng này? (Chuyển vào thùng rác)')) {
      try {
        const res = await fetch(`${API_BASE}/khach-hang/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success || res.ok) { toast.success('Xóa thành công!'); fetchCustomers(); }
        else toast.error(data.message || 'Xóa thất bại');
      } catch { toast.error('Lỗi hệ thống'); }
    }
  };

  const handleRestore = async (c: Customer) => {
    if (window.confirm('Khôi phục khách hàng này?')) {
      try {
        const payload = { ma: c.ma, hoTen: c.hoTen, email: c.email, soDienThoai: c.soDienThoai,
          ngaySinh: c.ngaySinh ? c.ngaySinh + 'T00:00:00' : null, gioiTinh: c.gioiTinh, trangThai: 1 };
        const res = await fetch(`${API_BASE}/khach-hang/${c.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success || res.ok) { toast.success('Khôi phục thành công!'); fetchCustomers(); }
        else toast.error(data.message || 'Lỗi khôi phục');
      } catch { toast.error('Lỗi hệ thống'); }
    }
  };

  const handleAdd = () => {
    setModalMode('add'); setSelectedCustomer(null);
    setFormData({ ma: '', hoTen: '', email: '', matKhau: '', soDienThoai: '', ngaySinh: '', gioiTinh: 0, trangThai: 1 });
    setErrors({});
    setShowModal(true);
  };

  const handleEdit = (c: Customer) => {
    setModalMode('edit'); setSelectedCustomer(c);
    setFormData({ ma: c.ma, hoTen: c.hoTen, email: c.email, matKhau: '', soDienThoai: c.soDienThoai,
      ngaySinh: c.ngaySinh, gioiTinh: c.gioiTinh, trangThai: c.trangThai });
    setErrors({});
    setShowModal(true);
  };

  const handleView = (c: Customer) => { setModalMode('view'); setSelectedCustomer(c); setShowModal(true); };

  // Filtering
  const filtered = customers.filter(c => {
    const matchSearch = (c.hoTen || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.ma || '').toLowerCase().includes(searchTerm.toLowerCase());
    if (filterStatus === '3') return matchSearch && c.trangThai === 3;
    const matchStatus = filterStatus === 'all' ? c.trangThai !== 3 : c.trangThai.toString() === filterStatus;
    return matchSearch && matchStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterStatus]);

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push(<Pagination.Item key={i} active={i === currentPage} onClick={() => setCurrentPage(i)}>{i}</Pagination.Item>);
    }
    return (
      <Pagination className="mb-0">
        <Pagination.Prev disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} />
        {items}
        <Pagination.Next disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} />
      </Pagination>
    );
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 fw-bold">Quản lý Khách hàng</h2>
          <p className="text-muted mb-0">Quản lý tài khoản khách hàng và điểm tích lũy</p>
        </div>
        <Button variant="danger" onClick={handleAdd}>
          <i className="bi bi-plus-circle me-2"></i>Thêm khách hàng
        </Button>
      </div>

      {/* Stats */}
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm"><Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div><p className="text-muted mb-1 small">Tổng khách hàng</p>
                <h4 className="mb-0 fw-bold">{customers.filter(c => c.trangThai !== 3).length}</h4></div>
              <div className="bg-primary bg-opacity-10 rounded p-2"><i className="bi bi-people fs-5 text-primary"></i></div>
            </div>
          </Card.Body></Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm"><Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div><p className="text-muted mb-1 small">Đang hoạt động</p>
                <h4 className="mb-0 fw-bold">{customers.filter(c => c.trangThai === 1).length}</h4></div>
              <div className="bg-success bg-opacity-10 rounded p-2"><i className="bi bi-person-check fs-5 text-success"></i></div>
            </div>
          </Card.Body></Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm"><Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div><p className="text-muted mb-1 small">Đã khóa</p>
                <h4 className="mb-0 fw-bold">{customers.filter(c => c.trangThai === 0).length}</h4></div>
              <div className="bg-warning bg-opacity-10 rounded p-2"><i className="bi bi-person-lock fs-5 text-warning"></i></div>
            </div>
          </Card.Body></Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm"><Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div><p className="text-muted mb-1 small">Thùng rác</p>
                <h4 className="mb-0 fw-bold">{customers.filter(c => c.trangThai === 3).length}</h4></div>
              <div className="bg-danger bg-opacity-10 rounded p-2"><i className="bi bi-trash fs-5 text-danger"></i></div>
            </div>
          </Card.Body></Card>
        </Col>
      </Row>

      {/* Search & Filter */}
      <Card className="border-0 shadow-sm mb-4"><Card.Body>
        <Row className="g-3">
          <Col md={8}>
            <InputGroup><InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
              <Form.Control placeholder="Tìm kiếm theo tên, email, mã khách hàng..."
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </InputGroup>
          </Col>
          <Col md={4}>
            <Form.Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">Tất cả trạng thái</option>
              <option value="1">Đang hoạt động</option>
              <option value="0">Đã khóa</option>
              <option value="3">Thùng rác</option>
            </Form.Select>
          </Col>
        </Row>
      </Card.Body></Card>

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="text-center" style={{ width: '80px' }}>Mã</th>
                  <th className="text-start">Khách hàng</th>
                  <th className="text-start">Liên hệ</th>
                  <th className="text-center">Giới tính</th>
                  <th className="text-end">Điểm tích lũy</th>
                  <th className="text-center">Trạng thái</th>
                  <th className="text-center text-nowrap" style={{ width: '150px' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map(c => (
                  <tr key={c.id}>
                    <td className="text-center"><span className="badge bg-light text-dark border">{c.ma}</span></td>
                    <td className="text-start">
                      <div className="d-flex align-items-center">
                        <div className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                          style={{ width: 40, height: 40, minWidth: 40 }}>
                          <i className="bi bi-person-fill"></i>
                        </div>
                        <div>
                          <div className="fw-semibold">{c.hoTen}</div>
                          <small className="text-muted">Đăng ký: {c.ngayTao}</small>
                        </div>
                      </div>
                    </td>
                    <td className="text-start">
                      <div className="small">
                        <div><i className="bi bi-envelope me-1"></i>{c.email}</div>
                        <div className="text-muted"><i className="bi bi-phone me-1"></i>{c.soDienThoai}</div>
                      </div>
                    </td>
                    <td className="text-center text-nowrap">
                      <Badge bg={c.gioiTinh === 0 ? 'info' : c.gioiTinh === 1 ? 'pink' : 'secondary'}
                        style={c.gioiTinh === 1 ? { backgroundColor: '#e91e8c', color: '#fff' } : {}}>
                        {c.gioiTinh === 0 ? 'Nam' : c.gioiTinh === 1 ? 'Nữ' : 'Khác'}
                      </Badge>
                    </td>
                    <td className="text-end">
                      <span className="fw-semibold text-warning">{(c.diemTichLuy || 0).toLocaleString('vi-VN')}</span>
                    </td>
                    <td className="text-center text-nowrap">
                      <Badge bg={c.trangThai === 1 ? 'success' : c.trangThai === 0 ? 'warning' : 'danger'}>
                        {c.trangThai === 1 ? 'Hoạt động' : c.trangThai === 0 ? 'Đã khóa' : 'Đã xóa'}
                      </Badge>
                    </td>
                    <td className="text-center text-nowrap">
                      {c.trangThai === 3 ? (
                        <Button variant="outline-success" size="sm" onClick={() => handleRestore(c)}>
                          <i className="bi bi-arrow-counterclockwise"></i> Khôi phục
                        </Button>
                      ) : (<>
                        <Button variant="outline-info" size="sm" className="me-1" onClick={() => handleView(c)}>
                          <i className="bi bi-eye"></i>
                        </Button>
                        <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleEdit(c)}>
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(c.id)}>
                          <i className="bi bi-trash"></i>
                        </Button>
                      </>)}
                    </td>
                  </tr>
                ))}
                {paginatedData.length === 0 && (
                  <tr><td colSpan={7} className="text-center text-muted py-4">Không có dữ liệu</td></tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
        <Card.Footer className="bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-muted small">
              Hiển thị {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filtered.length)} / {filtered.length} khách hàng
            </div>
            {renderPagination()}
          </div>
        </Card.Footer>
      </Card>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'add' ? 'Thêm khách hàng' : modalMode === 'edit' ? 'Chỉnh sửa khách hàng' : 'Chi tiết khách hàng'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalMode === 'view' && selectedCustomer ? (
            <Row className="g-3">
              <Col md={12} className="text-center mb-3">
                <div className="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: 80, height: 80 }}><i className="bi bi-person-fill fs-1"></i></div>
                <h4 className="fw-bold">{selectedCustomer.hoTen}</h4>
                <Badge bg={selectedCustomer.trangThai === 1 ? 'success' : 'danger'} className="me-2">
                  {selectedCustomer.trangThai === 1 ? 'Hoạt động' : 'Không hoạt động'}
                </Badge>
              </Col>
              {[
                ['Mã KH', selectedCustomer.ma], ['Email', selectedCustomer.email],
                ['SĐT', selectedCustomer.soDienThoai], ['Ngày sinh', selectedCustomer.ngaySinh],
                ['Giới tính', selectedCustomer.gioiTinh === 0 ? 'Nam' : selectedCustomer.gioiTinh === 1 ? 'Nữ' : 'Khác'],
                ['Điểm tích lũy', (selectedCustomer.diemTichLuy || 0).toLocaleString('vi-VN') + ' điểm'],
                ['Đăng ký từ', selectedCustomer.ngayTao], ['Auth Provider', selectedCustomer.authProvider || 'local']
              ].map(([label, value], idx) => (
                <Col md={6} key={idx}>
                  <Card className="border"><Card.Body>
                    <small className="text-muted">{label}</small>
                    <div className="fw-semibold">{value || 'N/A'}</div>
                  </Card.Body></Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Form>
              <Row>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>Mã KH</Form.Label>
                  <Form.Control isInvalid={!!errors.ma} value={formData.ma} onChange={e => setFormData(p => ({...p, ma: e.target.value}))} />
                  <Form.Control.Feedback type="invalid">{errors.ma}</Form.Control.Feedback>
                </Form.Group></Col>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>Họ tên</Form.Label>
                  <Form.Control isInvalid={!!errors.hoTen} value={formData.hoTen} onChange={e => setFormData(p => ({...p, hoTen: e.target.value}))} />
                  <Form.Control.Feedback type="invalid">{errors.hoTen}</Form.Control.Feedback>
                </Form.Group></Col>
              </Row>
              <Row>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>Email</Form.Label>
                  <Form.Control type="email" isInvalid={!!errors.email} value={formData.email} onChange={e => setFormData(p => ({...p, email: e.target.value}))} />
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group></Col>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>Mật khẩu {modalMode === 'edit' && '(để trống nếu không đổi)'}</Form.Label>
                  <Form.Control type="password" isInvalid={!!errors.matKhau} value={formData.matKhau} onChange={e => setFormData(p => ({...p, matKhau: e.target.value}))} />
                  <Form.Control.Feedback type="invalid">{errors.matKhau}</Form.Control.Feedback>
                </Form.Group></Col>
              </Row>
              <Row>
                <Col md={4}><Form.Group className="mb-3"><Form.Label>SĐT</Form.Label>
                  <Form.Control isInvalid={!!errors.soDienThoai} value={formData.soDienThoai} onChange={e => setFormData(p => ({...p, soDienThoai: e.target.value}))} />
                  <Form.Control.Feedback type="invalid">{errors.soDienThoai}</Form.Control.Feedback>
                </Form.Group></Col>
                <Col md={4}><Form.Group className="mb-3"><Form.Label>Ngày sinh</Form.Label>
                  <Form.Control type="date" isInvalid={!!errors.ngaySinh} value={formData.ngaySinh} onChange={e => setFormData(p => ({...p, ngaySinh: e.target.value}))} />
                  <Form.Control.Feedback type="invalid">{errors.ngaySinh}</Form.Control.Feedback>
                </Form.Group></Col>
                <Col md={4}><Form.Group className="mb-3"><Form.Label>Giới tính</Form.Label>
                  <Form.Select isInvalid={!!errors.gioiTinh} value={formData.gioiTinh} onChange={e => setFormData(p => ({...p, gioiTinh: Number(e.target.value)}))}>
                    <option value={0}>Nam</option><option value={1}>Nữ</option><option value={2}>Khác</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.gioiTinh}</Form.Control.Feedback>
                </Form.Group></Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>{modalMode === 'view' ? 'Đóng' : 'Hủy'}</Button>
          {modalMode !== 'view' && <Button variant="danger" onClick={handleSave}>{modalMode === 'add' ? 'Thêm' : 'Cập nhật'}</Button>}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminCustomers;

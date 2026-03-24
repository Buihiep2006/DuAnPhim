import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Form, InputGroup, Badge, Modal, Pagination } from 'react-bootstrap';
import { toast } from 'sonner';

interface Employee {
  id: string; vaiTroId: string; ma: string; hoTen: string; email: string;
  ngaySinh: string; gioiTinh: number; soDienThoai: string; trangThai: number; ngayTao: string;
}

const AdminEmployees: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selected, setSelected] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [formData, setFormData] = useState({ vaiTroId: '', ma: '', hoTen: '', email: '', matKhau: '', soDienThoai: '', ngaySinh: '', gioiTinh: 0, trangThai: 1 });
  const [errors, setErrors] = useState<{[key:string]: string}>({});
  const API = 'http://localhost:9999/api/admin';

  useEffect(() => {
    fetchData();
    fetch(`${API}/vai-tro`).then(r => r.json()).then(r => setRoles(r.data || [])).catch(console.error);
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API}/nhan-vien`);
      const json = await res.json();
      if (json.success && json.data) {
        setEmployees(json.data.map((e: any) => ({
          id: e.id, vaiTroId: e.vaiTroId || '', ma: e.ma, hoTen: e.hoTen, email: e.email,
          soDienThoai: e.soDienThoai, ngaySinh: e.ngaySinh ? e.ngaySinh.split('T')[0] : '',
          gioiTinh: e.gioiTinh ?? 0, trangThai: e.trangThai ?? 1, ngayTao: e.ngayTao ? e.ngayTao.split('T')[0] : ''
        })));
      }
    } catch (e) { console.error(e); }
  };

  const getRoleName = (id: string) => roles.find(r => r.id === id)?.ten || 'N/A';

  const handleSave = async () => {
    const newErrors: any = {};
    const trimmedMa = (formData.ma || '').trim();
    const trimmedHoTen = (formData.hoTen || '').trim();
    const trimmedEmail = (formData.email || '').trim();
    const trimmedSdt = (formData.soDienThoai || '').trim();

    // 1. Check trống & trim
    if (!trimmedMa) newErrors.ma = 'Mã nhân viên không được để trống';
    else if (!/^[a-zA-Z0-9]+$/.test(trimmedMa)) newErrors.ma = 'Mã nhân viên không được chứa ký tự đặc biệt hoặc khoảng trắng';

    if (!trimmedHoTen) newErrors.hoTen = 'Họ tên nhân viên không được để trống';

    // 2. Định dạng Email: *@gmail.com
    if (!trimmedEmail) newErrors.email = 'Email không được để trống';
    else if (!trimmedEmail.toLowerCase().endsWith('@gmail.com')) newErrors.email = 'Email phải có định dạng @gmail.com';

    // 3. Định dạng SĐT: bắt đầu bằng 0, 10-11 số
    if (!trimmedSdt) newErrors.soDienThoai = 'Số điện thoại không được để trống';
    else if (!trimmedSdt.startsWith('0')) newErrors.soDienThoai = 'Số điện thoại phải bắt đầu bằng số 0';
    else if (!/^\d{10,11}$/.test(trimmedSdt)) newErrors.soDienThoai = 'Số điện thoại phải có 10-11 chữ số';

    if (!formData.vaiTroId) newErrors.vaiTroId = 'Vai trò nhân viên không được để trống';
    if (!formData.ngaySinh) newErrors.ngaySinh = 'Ngày sinh nhân viên không được để trống';

    if (modalMode === 'add' && !formData.matKhau) newErrors.matKhau = 'Mật khẩu nhân viên không được để trống';

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
      vaiTroId: formData.vaiTroId || null, 
      ngaySinh: formData.ngaySinh ? formData.ngaySinh + 'T00:00:00' : null 
    };
    const method = modalMode === 'add' ? 'POST' : 'PUT';
    const url = modalMode === 'add' ? `${API}/nhan-vien` : `${API}/nhan-vien/${selected?.id}`;
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) { toast.success(modalMode === 'add' ? 'Thêm thành công!' : 'Cập nhật thành công!'); setShowModal(false); fetchData(); }
      else {
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
    if (!window.confirm('Xóa nhân viên này?')) return;
    try {
      const res = await fetch(`${API}/nhan-vien/${id}`, { method: 'DELETE' });
      if (res.ok) { toast.success('Xóa thành công!'); fetchData(); }
    } catch { toast.error('Lỗi hệ thống'); }
  };

  const handleRestore = async (e: Employee) => {
    if (!window.confirm('Khôi phục nhân viên này?')) return;
    try {
      const payload = { ma: e.ma, hoTen: e.hoTen, email: e.email, soDienThoai: e.soDienThoai, vaiTroId: e.vaiTroId || null, ngaySinh: e.ngaySinh ? e.ngaySinh + 'T00:00:00' : null, gioiTinh: e.gioiTinh, trangThai: 1 };
      const res = await fetch(`${API}/nhan-vien/${e.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) { toast.success('Khôi phục thành công!'); fetchData(); }
    } catch { toast.error('Lỗi hệ thống'); }
  };

  const handleAdd = () => { setModalMode('add'); setSelected(null); setFormData({ vaiTroId: '', ma: '', hoTen: '', email: '', matKhau: '', soDienThoai: '', ngaySinh: '', gioiTinh: 0, trangThai: 1 }); setErrors({}); setShowModal(true); };
  const handleEdit = (e: Employee) => { setModalMode('edit'); setSelected(e); setFormData({ vaiTroId: e.vaiTroId, ma: e.ma, hoTen: e.hoTen, email: e.email, matKhau: '', soDienThoai: e.soDienThoai, ngaySinh: e.ngaySinh, gioiTinh: e.gioiTinh, trangThai: e.trangThai }); setErrors({}); setShowModal(true); };
  const handleView = (e: Employee) => { setModalMode('view'); setSelected(e); setShowModal(true); };

  const filtered = employees.filter(e => {
    const s = (e.hoTen||'').toLowerCase().includes(searchTerm.toLowerCase()) || (e.email||'').toLowerCase().includes(searchTerm.toLowerCase()) || (e.ma||'').toLowerCase().includes(searchTerm.toLowerCase());
    if (filterStatus === '3') return s && e.trangThai === 3;
    return s && (filterStatus === 'all' ? e.trangThai !== 3 : e.trangThai.toString() === filterStatus);
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paged = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterStatus]);

  const renderPag = () => {
    if (totalPages <= 1) return null;
    const items = []; for (let i = 1; i <= totalPages; i++) items.push(<Pagination.Item key={i} active={i === currentPage} onClick={() => setCurrentPage(i)}>{i}</Pagination.Item>);
    return <Pagination className="mb-0"><Pagination.Prev disabled={currentPage===1} onClick={()=>setCurrentPage(p=>p-1)}/>{items}<Pagination.Next disabled={currentPage===totalPages} onClick={()=>setCurrentPage(p=>p+1)}/></Pagination>;
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div><h2 className="mb-1 fw-bold">Quản lý Nhân viên</h2><p className="text-muted mb-0">Quản lý thông tin nhân viên và phân quyền</p></div>
        <Button variant="danger" onClick={handleAdd}><i className="bi bi-plus-circle me-2"></i>Thêm nhân viên</Button>
      </div>

      <Row className="g-3 mb-4">
        {[
          { label: 'Tổng NV', count: employees.filter(e=>e.trangThai!==3).length, icon: 'bi-person-badge', color: 'primary' },
          { label: 'Hoạt động', count: employees.filter(e=>e.trangThai===1).length, icon: 'bi-person-check', color: 'success' },
          { label: 'Thùng rác', count: employees.filter(e=>e.trangThai===3).length, icon: 'bi-trash', color: 'danger' },
        ].map((s, i) => (
          <Col md={4} key={i}><Card className="border-0 shadow-sm"><Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div><p className="text-muted mb-1 small">{s.label}</p><h4 className="mb-0 fw-bold">{s.count}</h4></div>
              <div className={`bg-${s.color} bg-opacity-10 rounded p-2`}><i className={`bi ${s.icon} fs-5 text-${s.color}`}></i></div>
            </div>
          </Card.Body></Card></Col>
        ))}
      </Row>

      <Card className="border-0 shadow-sm mb-4"><Card.Body><Row className="g-3">
        <Col md={8}><InputGroup><InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
          <Form.Control placeholder="Tìm kiếm..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/></InputGroup></Col>
        <Col md={4}><Form.Select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
          <option value="all">Tất cả</option><option value="1">Hoạt động</option><option value="0">Đã khóa</option><option value="3">Thùng rác</option>
        </Form.Select></Col>
      </Row></Card.Body></Card>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0"><div className="table-responsive"><Table hover className="mb-0">
          <thead className="bg-light"><tr>
            <th className="text-center" style={{width:'80px'}}>Mã</th><th className="text-start">Nhân viên</th><th className="text-start">Liên hệ</th><th className="text-center">Vai trò</th><th className="text-center">Trạng thái</th><th className="text-center text-nowrap" style={{width:'150px'}}>Thao tác</th>
          </tr></thead>
          <tbody>
            {paged.map(emp=>(
              <tr key={emp.id}>
                <td className="text-center"><span className="badge bg-light text-dark border">{emp.ma}</span></td>
                <td className="text-start"><div className="d-flex align-items-center">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{width:40,height:40,minWidth:40}}><i className="bi bi-person-badge-fill"></i></div>
                  <div><div className="fw-semibold">{emp.hoTen}</div><small className="text-muted">{emp.gioiTinh===0?'Nam':emp.gioiTinh===1?'Nữ':'Khác'} • {emp.ngayTao}</small></div>
                </div></td>
                <td className="text-start"><div className="small"><div><i className="bi bi-envelope me-1"></i>{emp.email}</div><div className="text-muted"><i className="bi bi-phone me-1"></i>{emp.soDienThoai}</div></div></td>
                <td className="text-center"><Badge bg="info">{getRoleName(emp.vaiTroId)}</Badge></td>
                <td className="text-center"><Badge bg={emp.trangThai===1?'success':emp.trangThai===0?'warning':'danger'}>{emp.trangThai===1?'Hoạt động':emp.trangThai===0?'Đã khóa':'Đã xóa'}</Badge></td>
                <td className="text-center text-nowrap">{emp.trangThai===3?(
                  <Button variant="outline-success" size="sm" onClick={()=>handleRestore(emp)}><i className="bi bi-arrow-counterclockwise"></i> Khôi phục</Button>
                ):(<>
                  <Button variant="outline-info" size="sm" className="me-1" onClick={()=>handleView(emp)}><i className="bi bi-eye"></i></Button>
                  <Button variant="outline-primary" size="sm" className="me-1" onClick={()=>handleEdit(emp)}><i className="bi bi-pencil"></i></Button>
                  <Button variant="outline-danger" size="sm" onClick={()=>handleDelete(emp.id)}><i className="bi bi-trash"></i></Button>
                </>)}</td>
              </tr>
            ))}
            {paged.length===0&&<tr><td colSpan={6} className="text-center text-muted py-4">Không có dữ liệu</td></tr>}
          </tbody>
        </Table></div></Card.Body>
        <Card.Footer className="bg-white"><div className="d-flex justify-content-between align-items-center">
          <div className="text-muted small">Hiển thị {Math.min((currentPage-1)*itemsPerPage+1,filtered.length)}-{Math.min(currentPage*itemsPerPage,filtered.length)} / {filtered.length}</div>
          {renderPag()}
        </div></Card.Footer>
      </Card>

      <Modal show={showModal} onHide={()=>setShowModal(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>{modalMode==='add'?'Thêm nhân viên':modalMode==='edit'?'Chỉnh sửa':'Chi tiết'}</Modal.Title></Modal.Header>
        <Modal.Body>
          {modalMode==='view'&&selected?(
            <Row className="g-3">
              <Col md={12} className="text-center mb-3">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width:80,height:80}}><i className="bi bi-person-badge-fill fs-1"></i></div>
                <h4 className="fw-bold">{selected.hoTen}</h4>
                <Badge bg="info" className="me-2">{getRoleName(selected.vaiTroId)}</Badge>
                <Badge bg={selected.trangThai===1?'success':'danger'}>{selected.trangThai===1?'Hoạt động':'Không hoạt động'}</Badge>
              </Col>
              {[['Mã NV',selected.ma],['Email',selected.email],['SĐT',selected.soDienThoai],['Ngày sinh',selected.ngaySinh],['Giới tính',selected.gioiTinh===0?'Nam':selected.gioiTinh===1?'Nữ':'Khác'],['Ngày tạo',selected.ngayTao]].map(([l,v],i)=>(
                <Col md={6} key={i}><Card className="border"><Card.Body><small className="text-muted">{l}</small><div className="fw-semibold">{v||'N/A'}</div></Card.Body></Card></Col>
              ))}
            </Row>
          ):(
            <Form>
              <Row>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>Mã NV</Form.Label>
                  <Form.Control isInvalid={!!errors.ma} value={formData.ma} onChange={e=>setFormData(p=>({...p,ma:e.target.value}))}/>
                  <Form.Control.Feedback type="invalid">{errors.ma}</Form.Control.Feedback>
                </Form.Group></Col>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>Họ tên</Form.Label>
                  <Form.Control isInvalid={!!errors.hoTen} value={formData.hoTen} onChange={e=>setFormData(p=>({...p,hoTen:e.target.value}))}/>
                  <Form.Control.Feedback type="invalid">{errors.hoTen}</Form.Control.Feedback>
                </Form.Group></Col>
              </Row>
              <Row>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>Email</Form.Label>
                  <Form.Control type="email" isInvalid={!!errors.email} value={formData.email} onChange={e=>setFormData(p=>({...p,email:e.target.value}))}/>
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group></Col>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>Mật khẩu</Form.Label>
                  <Form.Control type="password" isInvalid={!!errors.matKhau} value={formData.matKhau} onChange={e=>setFormData(p=>({...p,matKhau:e.target.value}))}/>
                  <Form.Control.Feedback type="invalid">{errors.matKhau}</Form.Control.Feedback>
                </Form.Group></Col>
              </Row>
              <Row>
                <Col md={4}><Form.Group className="mb-3"><Form.Label>SĐT</Form.Label>
                  <Form.Control isInvalid={!!errors.soDienThoai} value={formData.soDienThoai} onChange={e=>setFormData(p=>({...p,soDienThoai:e.target.value}))}/>
                  <Form.Control.Feedback type="invalid">{errors.soDienThoai}</Form.Control.Feedback>
                </Form.Group></Col>
                <Col md={4}><Form.Group className="mb-3"><Form.Label>Ngày sinh</Form.Label>
                  <Form.Control type="date" isInvalid={!!errors.ngaySinh} value={formData.ngaySinh} onChange={e=>setFormData(p=>({...p,ngaySinh:e.target.value}))}/>
                  <Form.Control.Feedback type="invalid">{errors.ngaySinh}</Form.Control.Feedback>
                </Form.Group></Col>
                <Col md={4}><Form.Group className="mb-3"><Form.Label>Giới tính</Form.Label>
                  <Form.Select isInvalid={!!errors.gioiTinh} value={formData.gioiTinh} onChange={e=>setFormData(p=>({...p,gioiTinh:Number(e.target.value)}))}>
                    <option value={0}>Nam</option><option value={1}>Nữ</option><option value={2}>Khác</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.gioiTinh}</Form.Control.Feedback>
                </Form.Group></Col>
              </Row>
              <Form.Group className="mb-3"><Form.Label>Vai trò</Form.Label>
                <Form.Select isInvalid={!!errors.vaiTroId} value={formData.vaiTroId} onChange={e=>setFormData(p=>({...p,vaiTroId:e.target.value}))}>
                  <option value="">Chọn vai trò...</option>{roles.map(r=>(<option key={r.id} value={r.id}>{r.ten}</option>))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.vaiTroId}</Form.Control.Feedback>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setShowModal(false)}>{modalMode==='view'?'Đóng':'Hủy'}</Button>
          {modalMode!=='view'&&<Button variant="danger" onClick={handleSave}>{modalMode==='add'?'Thêm':'Cập nhật'}</Button>}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminEmployees;

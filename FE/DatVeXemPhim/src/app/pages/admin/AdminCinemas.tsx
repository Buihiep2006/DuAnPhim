import React, { useState, useEffect } from 'react';
import { 
  Row, Col, Card, Table, Button, Form, InputGroup, 
  Badge, Modal, Tabs, Tab, Pagination
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Cinema {
  id: string;
  ma: string;
  ten: string;
  dia_chi: string;
  khu_vuc: string;
  mo_ta: string;
  trang_thai: number;
}

interface Room {
  id: string;
  rap_chieu_id: string;
  ma: string;
  ten: string;
  suc_chua: number;
  loai_may_chieu: number;
  trang_thai: number;
}

interface LoaiGhe {
  id: string;
  ma: string;
  ten: string;
  phuThu: number;
}

const API_BASE = 'http://localhost:9999/api/admin';

const AdminCinemas: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'cinemas' | 'rooms' | 'seats'>('cinemas');
  
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [seatTypes, setSeatTypes] = useState<LoaiGhe[]>([]);
  
  // Search and Filters
  const [cinemaSearch, setCinemaSearch] = useState('');
  const [cinemaStatusFilter, setCinemaStatusFilter] = useState('all');

  // Pagination
  const [currentPageCinemas, setCurrentPageCinemas] = useState(1);
  const itemsPerPage = 5;

  const [cinemaErrors, setCinemaErrors] = useState<{[key:string]: string}>({});

  // Modals
  const [showCinemaModal, setShowCinemaModal] = useState(false);
  const [cinemaModalMode, setCinemaModalMode] = useState<'add'|'edit'>('add');
  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);

  // Forms
  const emptyCinemaForm = { ma: '', ten: '', diaChi: '', khuVuc: 'Quận 1', moTa: '', trangThai: 1 };
  const [cinemaForm, setCinemaForm] = useState(emptyCinemaForm);

  // Seat Type Modal & Form
  const [showSeatTypeModal, setShowSeatTypeModal] = useState(false);
  const [seatTypeModalMode, setSeatTypeModalMode] = useState<'add'|'edit'>('add');
  const [selectedSeatType, setSelectedSeatType] = useState<LoaiGhe | null>(null);
  const emptySeatTypeForm = { ma: '', ten: '', phuThu: 0 };
  const [seatTypeForm, setSeatTypeForm] = useState(emptySeatTypeForm);
  const [seatTypeErrors, setSeatTypeErrors] = useState<{[key:string]: string}>({});

  useEffect(() => {
    fetchCinemas();
    fetchRooms();
    fetchSeatTypes();
  }, []);

  const fetchSeatTypes = async () => {
    try {
      const res = await fetch(`${API_BASE}/loai-ghe`);
      const json = await res.json();
      if (json.success && json.data) {
        setSeatTypes(json.data);
      }
    } catch (e) {
      toast.error('Lỗi tải danh sách loại ghế');
    }
  };

  const fetchCinemas = async () => {
    try {
      const res = await fetch(`${API_BASE}/rap-chieu`);
      const json = await res.json();
      if (json.success && json.data) {
        const mapped = json.data.map((c: any) => ({
          ...c, dia_chi: c.diaChi, khu_vuc: c.khuVuc, mo_ta: c.moTa, trang_thai: c.trangThai
        }));
        setCinemas(mapped);
      }
    } catch (e) {
      toast.error('Lỗi tải danh sách rạp chiếu');
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API_BASE}/phong-chieu`);
      const json = await res.json();
      if (json.success && json.data) {
        const mapped = json.data.map((r: any) => ({
          ...r, rap_chieu_id: r.rapChieuId, suc_chua: r.sucChua, loai_may_chieu: r.loaiMayChieu, trang_thai: r.trangThai
        }));
        setRooms(mapped);
      }
    } catch (e) {
      toast.error('Lỗi tải danh sách phòng chiếu');
    }
  };

  // Cinema Handlers
  const handleOpenAddCinema = () => {
    setCinemaModalMode('add');
    setSelectedCinema(null);
    setCinemaForm(emptyCinemaForm);
    setCinemaErrors({});
    setShowCinemaModal(true);
  };

  const handleOpenEditCinema = (cinema: Cinema) => {
    setCinemaModalMode('edit');
    setSelectedCinema(cinema);
    setCinemaForm({
      ma: cinema.ma, ten: cinema.ten, diaChi: cinema.dia_chi,
      khuVuc: cinema.khu_vuc, moTa: cinema.mo_ta, trangThai: cinema.trang_thai
    });
    setCinemaErrors({});
    setShowCinemaModal(true);
  };

  const handleSaveCinema = async () => {
    const newErrors: any = {};
    const trimmedMa = (cinemaForm.ma || '').trim().toUpperCase();
    const trimmedTen = (cinemaForm.ten || '').trim();
    const trimmedDiaChi = (cinemaForm.diaChi || '').trim();

    if (!trimmedMa) newErrors.ma = 'Mã rạp không được để trống';
    else if (!/^[A-Z0-9]+$/.test(trimmedMa)) newErrors.ma = 'Mã rạp chỉ gồm chữ in hoa và số';

    if (!trimmedTen) newErrors.ten = 'Tên rạp không được để trống';
    if (!trimmedDiaChi) newErrors.diaChi = 'Địa chỉ rạp không được để trống';
    if (!cinemaForm.khuVuc) newErrors.khuVuc = 'Khu vực rạp không được để trống';

    if (Object.keys(newErrors).length > 0) {
      setCinemaErrors(newErrors);
      toast.error('Vui lòng kiểm tra lại thông tin!');
      return;
    }

    try {
      const payload = { ...cinemaForm, ma: trimmedMa, ten: trimmedTen, diaChi: trimmedDiaChi };
      const url = cinemaModalMode === 'add' ? `${API_BASE}/rap-chieu` : `${API_BASE}/rap-chieu/${selectedCinema?.id}`;
      const method = cinemaModalMode === 'add' ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method, headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success || res.ok) {
        toast.success(cinemaModalMode === 'add' ? 'Thêm rạp thành công' : 'Cập nhật rạp thành công');
        setShowCinemaModal(false);
        fetchCinemas();
      } else {
        if (data.data && typeof data.data === 'object' && Object.keys(data.data).length > 0) {
          setCinemaErrors(data.data as any);
          toast.error('Vui lòng kiểm tra lại thông tin rạp chiếu!');
        } else {
          let errorMsg = data.message || 'Lưu thất bại';
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

  const handleDeleteCinema = async (id: string) => {
    if (window.confirm('Xóa rạp chiếu này sẽ đẩy vào thùng rác?')) {
      try {
        const res = await fetch(`${API_BASE}/rap-chieu/${id}`, { method: 'DELETE' });
        if (res.ok) {
          toast.success('Xóa rạp thành công!');
          fetchCinemas();
        }
      } catch (e) { toast.error('Lỗi xóa rạp'); }
    }
  };

  const handleRestoreCinema = async (cinema: Cinema) => {
    if (window.confirm('Khôi phục rạp chiếu này?')) {
      try {
        const payload = { ...cinema, diaChi: cinema.dia_chi, khuVuc: cinema.khu_vuc, moTa: cinema.mo_ta, trangThai: 1 };
        const res = await fetch(`${API_BASE}/rap-chieu/${cinema.id}`, {
          method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)
        });
        if (res.ok) {
          toast.success('Khôi phục rạp thành công!');
          fetchCinemas();
        }
      } catch (e) { toast.error('Lỗi khôi phục'); }
    }
  };

  // Seat Type Handlers
  const handleOpenAddSeatType = () => {
    setSeatTypeModalMode('add');
    setSelectedSeatType(null);
    setSeatTypeForm(emptySeatTypeForm);
    setSeatTypeErrors({});
    setShowSeatTypeModal(true);
  };

  const handleOpenEditSeatType = (st: LoaiGhe) => {
    setSeatTypeModalMode('edit');
    setSelectedSeatType(st);
    setSeatTypeForm({
      ma: st.ma,
      ten: st.ten,
      phuThu: st.phuThu
    });
    setSeatTypeErrors({});
    setShowSeatTypeModal(true);
  };

  const handleSaveSeatType = async () => {
    const newErrors: any = {};
    const trimmedMa = (seatTypeForm.ma || '').trim().toUpperCase();
    const trimmedTen = (seatTypeForm.ten || '').trim();

    if (!trimmedMa) newErrors.ma = 'Mã loại ghế không được để trống';
    if (!trimmedTen) newErrors.ten = 'Tên loại ghế không được để trống';
    if (seatTypeForm.phuThu < 0) newErrors.phuThu = 'Phụ thu loại ghế không được âm';

    if (Object.keys(newErrors).length > 0) {
      setSeatTypeErrors(newErrors);
      toast.error('Vui lòng kiểm tra lại thông tin!');
      return;
    }

    try {
      const payload = { ...seatTypeForm, ma: trimmedMa, ten: trimmedTen };
      const url = seatTypeModalMode === 'add' ? `${API_BASE}/loai-ghe` : `${API_BASE}/loai-ghe/${selectedSeatType?.id}`;
      const method = seatTypeModalMode === 'add' ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method, headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success || res.ok) {
        toast.success(seatTypeModalMode === 'add' ? 'Thêm loại ghế thành công' : 'Cập nhật loại ghế thành công');
        setShowSeatTypeModal(false);
        fetchSeatTypes();
      } else {
        if (data.data && typeof data.data === 'object' && Object.keys(data.data).length > 0) {
          setSeatTypeErrors(data.data as any);
          toast.error('Vui lòng kiểm tra lại thông tin!');
        } else {
          toast.error('Lỗi: ' + (data.message || 'Lưu thất bại'));
        }
      }
    } catch (e) {
      toast.error('Lỗi hệ thống');
    }
  };

  const handleDeleteSeatType = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa loại ghế này?')) {
      try {
        const res = await fetch(`${API_BASE}/loai-ghe/${id}`, { method: 'DELETE' });
        if (res.ok) {
          toast.success('Xóa loại ghế thành công!');
          fetchSeatTypes();
        } else {
          toast.error('Không thể xóa loại ghế này (có thể đang được sử dụng)');
        }
      } catch (e) { toast.error('Lỗi xóa loại ghế'); }
    }
  };

  // Filters
  const filteredCinemas = cinemas.filter(c => {
    const s = c.ten.toLowerCase().includes(cinemaSearch.toLowerCase()) || c.ma.toLowerCase().includes(cinemaSearch.toLowerCase());
    if (cinemaStatusFilter === '3') return s && c.trang_thai === 3;
    const st = cinemaStatusFilter === 'all' ? c.trang_thai !== 3 : c.trang_thai.toString() === cinemaStatusFilter;
    return s && st;
  });

  const totalPagesCinemas = Math.ceil(filteredCinemas.length / itemsPerPage);
  const paginatedCinemas = filteredCinemas.slice((currentPageCinemas - 1) * itemsPerPage, currentPageCinemas * itemsPerPage);
  useEffect(() => { setCurrentPageCinemas(1); }, [cinemaSearch, cinemaStatusFilter]);

  const renderPagination = (currentPage: number, setCurrentPage: (p: number | ((prev: number) => number)) => void, totalPages: number) => {
    if (totalPages <= 1) return null;
    const items = [];
    for (let i = 1; i <= totalPages; i++) items.push(<Pagination.Item key={i} active={i === currentPage} onClick={() => setCurrentPage(i)}>{i}</Pagination.Item>);
    return (
      <Pagination className="mb-0">
        <Pagination.Prev disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} />
        {items}
        <Pagination.Next disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} />
      </Pagination>
    );
  };

  const getStatusBadge = (status: number) => {
    if (status === 1) return <Badge bg="success">Hoạt động</Badge>;
    if (status === 0) return <Badge bg="secondary">Ngừng hoạt động</Badge>;
    if (status === 3) return <Badge bg="danger">Đã xóa</Badge>;
    return <Badge bg="light" text="dark">Không xác định</Badge>;
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 fw-bold">Quản lý Rạp & Phòng chiếu</h2>
          <p className="text-muted mb-0">Quản lý hệ thống rạp chiếu và sơ đồ ghế</p>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm"><Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div><p className="text-muted mb-1 small">Rạp hoạt động</p><h4 className="mb-0 fw-bold">{cinemas.filter(c=>c.trang_thai===1).length}</h4></div>
              <div className="bg-primary bg-opacity-10 rounded p-2"><i className="bi bi-building fs-5 text-primary"></i></div>
            </div>
          </Card.Body></Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm"><Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div><p className="text-muted mb-1 small">Phòng chiếu hoạt động</p><h4 className="mb-0 fw-bold">{rooms.filter(r=>r.trang_thai===1).length}</h4></div>
              <div className="bg-success bg-opacity-10 rounded p-2"><i className="bi bi-door-open fs-5 text-success"></i></div>
            </div>
          </Card.Body></Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm"><Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div><p className="text-muted mb-1 small">Sức chứa phòng tối đa</p><h4 className="mb-0 fw-bold">{Math.max(0, ...rooms.map(r=>r.suc_chua))}</h4></div>
              <div className="bg-warning bg-opacity-10 rounded p-2"><i className="bi bi-chair fs-5 text-warning"></i></div>
            </div>
          </Card.Body></Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm"><Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div><p className="text-muted mb-1 small">Phòng IMAX/4DX</p><h4 className="mb-0 fw-bold">{rooms.filter(r => [3, 4].includes(r.loai_may_chieu)).length}</h4></div>
              <div className="bg-danger bg-opacity-10 rounded p-2"><i className="bi bi-badge-3d fs-5 text-danger"></i></div>
            </div>
          </Card.Body></Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm"><Card.Body>
        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k as 'cinemas' | 'rooms' | 'seats')} className="mb-3">
          
          {/* Cinemas Tab */}
          <Tab eventKey="cinemas" title={<><i className="bi bi-building me-2"></i>Rạp chiếu</>}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex gap-2">
                <InputGroup style={{ width: '300px' }}>
                  <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
                  <Form.Control placeholder="Tìm rạp..." value={cinemaSearch} onChange={e=>setCinemaSearch(e.target.value)} />
                </InputGroup>
                <Form.Select style={{ width: '200px' }} value={cinemaStatusFilter} onChange={e=>setCinemaStatusFilter(e.target.value)}>
                  <option value="all">Tất cả (trừ xóa)</option>
                  <option value="1">Hoạt động</option>
                  <option value="0">Ngừng hoạt động</option>
                  <option value="3">Thùng rác (Đã xóa)</option>
                </Form.Select>
              </div>
              <Button variant="danger" onClick={handleOpenAddCinema}>
                <i className="bi bi-plus-circle me-2"></i> Thêm rạp mới
              </Button>
            </div>
            <Table hover responsive>
              <thead className="bg-light">
                <tr>
                  <th className="text-center" style={{ width: '80px' }}>Mã</th>
                  <th className="text-start">Tên rạp</th>
                  <th className="text-start">Địa chỉ</th>
                  <th className="text-center">Khu vực</th>
                  <th className="text-center">Số phòng</th>
                  <th className="text-center">Trạng thái</th>
                  <th className="text-center text-nowrap">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCinemas.map(c => (
                  <tr key={c.id}>
                    <td className="text-center"><Badge bg="light" text="dark" className="border">{c.ma}</Badge></td>
                    <td className="text-start fw-semibold">{c.ten}</td>
                    <td className="text-start">{c.dia_chi}</td>
                    <td className="text-center"><Badge bg="info">{c.khu_vuc}</Badge></td>
                    <td className="text-center"><Badge bg="primary">{rooms.filter(r => r.rap_chieu_id === c.id).length} phòng</Badge></td>
                    <td className="text-center">{getStatusBadge(c.trang_thai)}</td>
                    <td className="text-center text-nowrap">
                      {c.trang_thai === 3 ? (
                        <Button variant="outline-success" size="sm" onClick={() => handleRestoreCinema(c)}>
                          <i className="bi bi-arrow-counterclockwise"></i> Khôi phục
                        </Button>
                      ) : (
                        <>
                          <Button variant="outline-info" size="sm" className="me-1" onClick={() => navigate(`/admin/cinemas/${c.id}/rooms`)} title="Danh sách phòng">
                            <i className="bi bi-door-open"></i>
                          </Button>
                          <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleOpenEditCinema(c)}>
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button variant="outline-danger" size="sm" onClick={() => handleDeleteCinema(c.id)}>
                            <i className="bi bi-trash"></i>
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {paginatedCinemas.length === 0 && <tr><td colSpan={7} className="text-center text-muted">Không tìm thấy rạp chiếu nào</td></tr>}
              </tbody>
            </Table>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="text-muted small">Hiển thị {Math.min((currentPageCinemas-1)*itemsPerPage+1, filteredCinemas.length)}-{Math.min(currentPageCinemas*itemsPerPage, filteredCinemas.length)} / {filteredCinemas.length} rạp</div>
              {renderPagination(currentPageCinemas, setCurrentPageCinemas, totalPagesCinemas)}
            </div>
          </Tab>

          {/* Rooms List Modal moved to actual Modals section at bottom */}

          {/* Seat Types Tab */}
          <Tab eventKey="seats" title={<><i className="bi bi-chair me-2"></i>Loại ghế</>}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="text-muted small">Danh sách các loại ghế và mức phụ thu tương ứng</div>
              <Button variant="danger" size="sm" onClick={handleOpenAddSeatType}>
                <i className="bi bi-plus-circle me-1"></i> Thêm loại ghế
              </Button>
            </div>
            <Table hover responsive>
              <thead className="bg-light">
                <tr><th className="text-center">Mã hiệu</th><th className="text-start">Tên loại ghế</th><th className="text-end">Phụ thu</th><th className="text-center text-nowrap">Thao tác</th></tr>
              </thead>
              <tbody>
                {seatTypes.map(st => (
                  <tr key={st.id}>
                    <td className="text-center"><Badge bg="light" text="dark" className="border">{st.ma}</Badge></td>
                    <td className="text-start fw-semibold">{st.ten}</td>
                    <td className="text-end">{st.phuThu.toLocaleString()} ₫</td>
                    <td className="text-center text-nowrap">
                      <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleOpenEditSeatType(st)} title="Sửa"><i className="bi bi-pencil"></i></Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteSeatType(st.id)} title="Xóa"><i className="bi bi-trash"></i></Button>
                    </td>
                  </tr>
                ))}
                {seatTypes.length === 0 && <tr><td colSpan={4} className="text-center text-muted py-3">Chưa có dữ liệu loại ghế</td></tr>}
              </tbody>
            </Table>
          </Tab>
        </Tabs>
      </Card.Body></Card>

      {/* Cinema Modal */}
      <Modal show={showCinemaModal} onHide={() => setShowCinemaModal(false)}>
        <Modal.Header closeButton><Modal.Title>{cinemaModalMode==='add'?'Thêm rạp chiếu mới':'Chỉnh sửa rạp'}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3"><Form.Label>Mã rạp</Form.Label>
              <Form.Control type="text" isInvalid={!!cinemaErrors.ma} value={cinemaForm.ma} onChange={e=>setCinemaForm({...cinemaForm, ma: e.target.value})} />
              <Form.Control.Feedback type="invalid">{cinemaErrors.ma}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3"><Form.Label>Tên rạp</Form.Label>
              <Form.Control type="text" isInvalid={!!cinemaErrors.ten} value={cinemaForm.ten} onChange={e=>setCinemaForm({...cinemaForm, ten: e.target.value})} />
              <Form.Control.Feedback type="invalid">{cinemaErrors.ten}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3"><Form.Label>Địa chỉ</Form.Label>
              <Form.Control type="text" isInvalid={!!cinemaErrors.diaChi} value={cinemaForm.diaChi} onChange={e=>setCinemaForm({...cinemaForm, diaChi: e.target.value})} />
              <Form.Control.Feedback type="invalid">{cinemaErrors.diaChi}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3"><Form.Label>Khu vực</Form.Label>
              <Form.Select isInvalid={!!cinemaErrors.khuVuc} value={cinemaForm.khuVuc} onChange={e=>setCinemaForm({...cinemaForm, khuVuc: e.target.value})}>
                <option>Quận 1</option><option>Quận 2</option><option>Quận 3</option><option>Tân Bình</option><option>Gò Vấp</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{cinemaErrors.khuVuc}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3"><Form.Label>Mô tả</Form.Label>
              <Form.Control as="textarea" rows={3} isInvalid={!!cinemaErrors.moTa} value={cinemaForm.moTa} onChange={e=>setCinemaForm({...cinemaForm, moTa: e.target.value})} />
              <Form.Control.Feedback type="invalid">{cinemaErrors.moTa}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3"><Form.Label>Trạng thái</Form.Label>
              <Form.Select value={cinemaForm.trangThai} onChange={e=>setCinemaForm({...cinemaForm, trangThai: Number(e.target.value)})}>
                <option value={1}>Hoạt động</option><option value={0}>Ngừng hoạt động</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCinemaModal(false)}>Hủy</Button>
          <Button variant="danger" onClick={handleSaveCinema}>Lưu lại</Button>
        </Modal.Footer>
      </Modal>

      {/* Seat Type Modal */}
      <Modal show={showSeatTypeModal} onHide={() => setShowSeatTypeModal(false)}>
        <Modal.Header closeButton><Modal.Title>{seatTypeModalMode==='add'?'Thêm loại ghế mới':'Chỉnh sửa loại ghế'}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3"><Form.Label>Mã loại ghế</Form.Label>
              <Form.Control type="text" isInvalid={!!seatTypeErrors.ma} value={seatTypeForm.ma} onChange={e=>setSeatTypeForm({...seatTypeForm, ma: e.target.value})} />
              <Form.Control.Feedback type="invalid">{seatTypeErrors.ma}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3"><Form.Label>Tên loại ghế</Form.Label>
              <Form.Control type="text" isInvalid={!!seatTypeErrors.ten} value={seatTypeForm.ten} onChange={e=>setSeatTypeForm({...seatTypeForm, ten: e.target.value})} />
              <Form.Control.Feedback type="invalid">{seatTypeErrors.ten}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3"><Form.Label>Phụ thu (VNĐ)</Form.Label>
              <Form.Control type="number" isInvalid={!!seatTypeErrors.phuThu} value={seatTypeForm.phuThu} onChange={e=>setSeatTypeForm({...seatTypeForm, phuThu: Number(e.target.value)})} />
              <Form.Control.Feedback type="invalid">{seatTypeErrors.phuThu}</Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSeatTypeModal(false)}>Hủy</Button>
          <Button variant="danger" onClick={handleSaveSeatType}>Lưu lại</Button>
        </Modal.Footer>
      </Modal>



    </div>
  );
};
export default AdminCinemas;

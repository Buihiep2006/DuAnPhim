import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Form, InputGroup, Badge, Modal, Pagination } from 'react-bootstrap';
import { toast } from 'sonner';

interface Showtime {
  id: string; ma: string; phimId: string; phongChieuId: string;
  dinhDangPhimId: string;
  tenPhim: string; tenPhong: string; tenRap: string;
  thoiGianBatDau: string; thoiGianKetThuc: string;
  giaVeCoBan: number; trangThai: number;
}

const API = 'http://localhost:9999/api/admin';

const AdminShowtimes: React.FC = () => {
  const [selectedCinema, setSelectedCinema] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedItem, setSelectedItem] = useState<Showtime | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [movies, setMovies] = useState<any[]>([]);
  const [cinemas, setCinemas] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [formats, setFormats] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [formData, setFormData] = useState({ phimId: '', phongChieuId: '', dinhDangPhimId: '', ma: '', ngayChieu: '', gioBatDau: '', giaVeCoBan: 80000, trangThai: 1 });
  const [errors, setErrors] = useState<{[key:string]: string}>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [genSettings, setGenSettings] = useState({ start: '08:00', end: '23:00', gap: 15 });
  const [previewShows, setPreviewShows] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('compact');

  useEffect(() => { 
    fetchAll();
    fetch(`${API}/cai-dat-chung`).then(res => res.json()).then(json => {
      if (json.success && json.data && json.data.length > 0) {
        const s = json.data[0];
        setGenSettings({
          start: s.gioMoCua?.substring(0, 5) || '08:00',
          end: s.gioDongCua?.substring(0, 5) || '23:00',
          gap: s.thoiGianNghiSuatChieu || 15
        });
      }
    }).catch(e => console.error('Error fetching settings:', e));
  }, []);

  const fetchAll = async () => {
    try {
      const [stRes, mvRes, cnRes, rmRes, fmRes] = await Promise.all([
        fetch(`${API}/suat-chieu`), fetch(`${API}/phim`), fetch(`${API}/rap-chieu`), fetch(`${API}/phong-chieu`), fetch(`${API}/dinh-dang-phim`)
      ]);
      const [stJson, mvJson, cnJson, rmJson, fmJson] = await Promise.all([stRes.json(), mvRes.json(), cnRes.json(), rmRes.json(), fmRes.json()]);
      const mvData = mvJson.data || []; const cnData = cnJson.data || []; const rmData = rmJson.data || []; const fmData = fmJson.data || [];
      setMovies(mvData); setCinemas(cnData); setRooms(rmData); setFormats(fmData);
        setShowtimes(stJson.data.map((s: any) => {
          const movie = mvData.find((m: any) => m.id === s.phimId);
          const room = rmData.find((r: any) => r.id === s.phongChieuId);
          const cinema = room ? cnData.find((c: any) => c.id === room.rapChieuId) : null;
          return {
            id: s.id, ma: s.ma || '', phimId: s.phimId || '', phongChieuId: s.phongChieuId || '',
            dinhDangPhimId: s.dinhDangPhimId || '',
            tenPhim: movie?.ten || s.phimId?.substring(0,8) || '', tenPhong: room?.ten || '', tenRap: cinema?.ten || '',
            thoiGianBatDau: s.thoiGianBatDau || '', thoiGianKetThuc: s.thoiGianKetThuc || '',
            giaVeCoBan: s.giaVeCoBan || 0, trangThai: s.trangThai ?? 1
          };
        }));
    } catch (e) { console.error(e); }
  };

  const getGroupedShows = (data: Showtime[]) => {
    const groups: { [key: string]: any } = {};
    data.forEach(s => {
      const day = s.thoiGianBatDau.split('T')[0];
      const key = `${s.phimId}_${s.phongChieuId}_${day}`;
      if (!groups[key]) {
        groups[key] = {
          ...s,
          allShows: [s],
          times: [s.thoiGianBatDau]
        };
      } else {
        groups[key].allShows.push(s);
        groups[key].times.push(s.thoiGianBatDau);
      }
    });
    return Object.values(groups).sort((a,b) => b.thoiGianBatDau.localeCompare(a.thoiGianBatDau));
  };

  const getStatusBadge = (s: number) => {
    switch (s) { case 0: return <Badge bg="secondary">Đã hủy</Badge>; case 1: return <Badge bg="primary">Đã lên lịch</Badge>;
      case 2: return <Badge bg="success">Đang chiếu</Badge>; case 3: return <Badge bg="secondary">Đã kết thúc</Badge>;
      default: return <Badge bg="secondary">N/A</Badge>; }
  };

  const formatTime = (d: string) => d ? new Date(d).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }) : '';
  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('vi-VN') : '';

  const handleSave = async () => {
    const newErrors: any = {};
    const trimmedMa = (formData.ma || '').trim();
    if (!trimmedMa) newErrors.ma = 'Mã suất chiếu không được để trống';
    if (!formData.phimId) newErrors.phimId = 'Phim không được để trống';
    if (!formData.phongChieuId) newErrors.phongChieuId = 'Phòng chiếu không được để trống';
    if (!formData.ngayChieu) newErrors.ngayChieu = 'Ngày chiếu không được để trống';
    if (!formData.gioBatDau) newErrors.gioBatDau = 'Giờ bắt đầu không được để trống';
    if (formData.giaVeCoBan <= 0) newErrors.giaVeCoBan = 'Giá vé cơ bản phải lớn hơn 0';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Vui lòng kiểm tra lại thông tin!');
      return;
    }

    const startDT = `${formData.ngayChieu}T${formData.gioBatDau}:00`;
    const movie = movies.find(m => m.id === formData.phimId);
    const duration = movie?.thoiLuong || 120;
    
    const startObj = new Date(startDT);
    const endObj = new Date(startObj.getTime() + duration * 60000);
    const pad = (n: number) => n < 10 ? '0' + n : n;
    const endDT = `${endObj.getFullYear()}-${pad(endObj.getMonth() + 1)}-${pad(endObj.getDate())}T${pad(endObj.getHours())}:${pad(endObj.getMinutes())}:${pad(endObj.getSeconds())}`;
    
    const payload = { 
      phimId: formData.phimId, 
      phongChieuId: formData.phongChieuId, 
      dinhDangPhimId: formData.dinhDangPhimId || null, 
      ma: trimmedMa, 
      thoiGianBatDau: startDT, 
      thoiGianKetThuc: endDT, 
      giaVeCoBan: formData.giaVeCoBan, 
      trangThai: formData.trangThai, 
      ngayTao: new Date().toISOString() 
    };
    const method = modalMode === 'add' ? 'POST' : 'PUT';
    const url = modalMode === 'add' ? `${API}/suat-chieu` : `${API}/suat-chieu/${selectedItem?.id}`;
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success || res.ok) { toast.success(modalMode === 'add' ? 'Thêm thành công!' : 'Cập nhật thành công!'); setShowModal(false); fetchAll(); }
      else {
        if (data.data && typeof data.data === 'object' && Object.keys(data.data).length > 0) {
          setErrors(data.data as any);
          toast.error('Vui lòng kiểm tra lại thông tin nhập!');
        } else {
          let errorMsg = data.message || 'Thất bại';
          if (data.data && typeof data.data === 'object') {
            errorMsg += '\n' + Object.entries(data.data).map(([k, v]) => `- ${k}: ${v}`).join('\n');
          }
          toast.error('Lỗi: ' + errorMsg);
        }
      }
    } catch { toast.error('Lỗi hệ thống'); }
  };
 
  const handlePreview = () => {
    if (!formData.phimId || !formData.phongChieuId || !formData.ngayChieu) {
      toast.error('Vui lòng chọn Phim, Phòng chiếu và Ngày chiếu!');
      return;
    }

    const movie = movies.find(m => m.id === formData.phimId);
    const duration = movie?.thoiLuong || 120;
    const { start, end, gap } = genSettings;

    let current = new Date(`${formData.ngayChieu}T${start}:00`);
    let closing = new Date(`${formData.ngayChieu}T${end}:00`);
    if (closing <= current) closing.setDate(closing.getDate() + 1);

    const generated = [];
    let count = 1;
    while (new Date(current.getTime() + duration * 60000) <= closing && count < 50) {
      const endShow = new Date(current.getTime() + duration * 60000);
      generated.push({
        id: `preview-${count}`,
        index: count++,
        start: new Date(current),
        end: endShow
      });
      current = new Date(endShow.getTime() + gap * 60000);
    }
    setPreviewShows(generated);
    if (generated.length === 0) toast.warning('Không thể tạo suất chiếu nào trong khoảng thời gian này!');
  };

  const handleGenerate = async () => {
    if (!formData.phimId || !formData.phongChieuId || !formData.ngayChieu) {
      toast.error('Vui lòng chọn Phim, Phòng chiếu và Ngày chiếu!');
      return;
    }
    
    if (previewShows.length === 0) {
      toast.error('Vui lòng "Xem trước" và kiểm tra lịch trước khi tạo!');
      return;
    }

    if (!window.confirm(`Hệ thống sẽ tạo ${previewShows.length} suất chiếu. Tiếp tục?`)) return;

    try {
      const res = await fetch(`${API}/suat-chieu/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phimId: formData.phimId,
          phongChieuId: formData.phongChieuId,
          ngayChieu: formData.ngayChieu,
          dinhDangPhimId: formData.dinhDangPhimId,
          gioMo: genSettings.start,
          gioDong: genSettings.end
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Đã tạo ${data.data.length} suất chiếu thành công!`);
        setShowModal(false);
        setIsGenerating(false);
        setPreviewShows([]);
        fetchAll();
      } else {
        toast.error('Lỗi: ' + (data.message || 'Thất bại'));
      }
    } catch { toast.error('Lỗi hệ thống'); }
  };
 
  const handleDelete = async (id: string) => {
    if (!window.confirm('Xóa suất chiếu này?')) return;
    try { const res = await fetch(`${API}/suat-chieu/${id}`, { method: 'DELETE' }); if (res.ok) { toast.success('Xóa thành công!'); fetchAll(); } }
    catch { toast.error('Lỗi hệ thống'); }
  };

  const handleAdd = () => { setModalMode('add'); setSelectedItem(null); setFormData({ phimId: '', phongChieuId: '', dinhDangPhimId: '', ma: '', ngayChieu: '', gioBatDau: '', giaVeCoBan: 80000, trangThai: 1 }); setErrors({}); setIsGenerating(false); setPreviewShows([]); setShowModal(true); };
  const handleEdit = (s: Showtime) => {
    setModalMode('edit');
    setSelectedItem(s);
    setIsGenerating(false);
    setPreviewShows([]);
    const datePart = s.thoiGianBatDau ? s.thoiGianBatDau.split('T')[0] : '';
    const timePart = s.thoiGianBatDau ? s.thoiGianBatDau.split('T')[1]?.substring(0, 5) : '';
    setFormData({
      phimId: s.phimId,
      phongChieuId: s.phongChieuId,
      dinhDangPhimId: s.dinhDangPhimId,
      ma: s.ma,
      ngayChieu: datePart,
      gioBatDau: timePart,
      giaVeCoBan: s.giaVeCoBan,
      trangThai: s.trangThai
    });
    setErrors({});
    setShowModal(true);
  };
  const handleView = (s: Showtime) => { setModalMode('view'); setSelectedItem(s); setShowModal(true); };

  // Data processing for table
  const allFiltered = showtimes.filter(s => selectedCinema === 'all' || s.tenRap === cinemas.find(c => c.id === selectedCinema)?.ten);
  const displayData = viewMode === 'compact' ? getGroupedShows(allFiltered) : allFiltered;

  const totalPages = Math.ceil(displayData.length / itemsPerPage);
  const paged = displayData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  useEffect(() => { setCurrentPage(1); }, [selectedCinema, viewMode]);

  const renderPag = () => {
    if (totalPages <= 1) return null;
    const items = []; for (let i = 1; i <= totalPages; i++) items.push(<Pagination.Item key={i} active={i === currentPage} onClick={() => setCurrentPage(i)}>{i}</Pagination.Item>);
    return <Pagination className="mb-0"><Pagination.Prev disabled={currentPage===1} onClick={()=>setCurrentPage(p=>p-1)}/>{items}<Pagination.Next disabled={currentPage===totalPages} onClick={()=>setCurrentPage(p=>p+1)}/></Pagination>;
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div><h2 className="mb-1 fw-bold">Quản lý Lịch chiếu</h2><p className="text-muted mb-0">Quản lý suất chiếu và lịch trình phim</p></div>
        <Button variant="danger" onClick={handleAdd}><i className="bi bi-plus-circle me-2"></i>Thêm suất chiếu</Button>
      </div>

      <Row className="g-3 mb-4">
        {[
          { label: 'Tổng suất chiếu', count: showtimes.length, icon: 'bi-calendar-event', color: 'primary' },
          { label: 'Đang chiếu', count: showtimes.filter(s=>s.trangThai===2).length, icon: 'bi-play-circle', color: 'success' },
          { label: 'Đã lên lịch', count: showtimes.filter(s=>s.trangThai===1).length, icon: 'bi-clock-history', color: 'info' },
          { label: 'Phòng chiếu', count: rooms.length, icon: 'bi-door-open', color: 'warning' },
        ].map((s, i) => (
          <Col md={3} key={i}><Card className="border-0 shadow-sm"><Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div><p className="text-muted mb-1 small">{s.label}</p><h4 className="mb-0 fw-bold">{s.count}</h4></div>
              <div className={`bg-${s.color} bg-opacity-10 rounded p-2`}><i className={`bi ${s.icon} fs-5 text-${s.color}`}></i></div>
            </div>
          </Card.Body></Card></Col>
        ))}
      </Row>

      <Card className="border-0 shadow-sm mb-4"><Card.Body><Row className="g-3 align-items-center">
        <Col md={4}><Form.Label className="mb-0 small">Rạp chiếu</Form.Label>
          <Form.Select value={selectedCinema} onChange={e=>setSelectedCinema(e.target.value)}>
            <option value="all">Tất cả rạp</option>
            {cinemas.map(c=>(<option key={c.id} value={c.id}>{c.ten}</option>))}
          </Form.Select></Col>
        <Col md={4} className="d-flex align-items-end h-100">
          <div className="bg-light p-1 rounded d-flex w-100" style={{height:'38px'}}>
            <Button variant={viewMode === 'compact' ? 'white' : 'transparent'} size="sm" className={`flex-grow-1 border-0 ${viewMode === 'compact' ? 'shadow-sm' : 'text-muted'}`} onClick={()=>setViewMode('compact')}>Rút gọn</Button>
            <Button variant={viewMode === 'detailed' ? 'white' : 'transparent'} size="sm" className={`flex-grow-1 border-0 ${viewMode === 'detailed' ? 'shadow-sm' : 'text-muted'}`} onClick={()=>setViewMode('detailed')}>Chi tiết</Button>
          </div>
        </Col>
      </Row></Card.Body></Card>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0"><div className="table-responsive"><Table hover className="mb-0">
          <thead className="bg-light"><tr>
            <th className="text-center" style={{width:'80px'}}>Mã</th><th className="text-start">Phim</th><th className="text-start">Rạp / Phòng</th><th className="text-center">Thời gian</th>
            <th className="text-end">Giá vé</th><th className="text-center">Trạng thái</th><th className="text-center text-nowrap" style={{width:'120px'}}>Thao tác</th>
          </tr></thead>
          <tbody>
            {paged.map((s: any)=>(
              <tr key={s.id}>
                <td className="text-center"><span className="badge bg-light text-dark border">{viewMode === 'compact' ? 'GROUP' : s.ma}</span></td>
                <td className="text-start fw-semibold">{s.tenPhim}</td>
                <td className="text-start"><small>{s.tenRap}<br/><span className="text-muted">{s.tenPhong}</span></small></td>
                <td className="text-center">
                  {viewMode === 'compact' ? (
                    <div className="d-flex flex-wrap justify-content-center gap-1" style={{maxWidth: '220px'}}>
                      <div className="w-100 text-muted small mb-1">{formatDate(s.thoiGianBatDau)}</div>
                      {s.times.sort().map((t: string, i: number) => (
                        <Badge key={i} bg="success" style={{cursor:'pointer'}} onClick={()=>handleEdit(s.allShows.find((sh:any)=>sh.thoiGianBatDau===t))} title="Click để sửa">{formatTime(t)}</Badge>
                      ))}
                    </div>
                  ) : (
                    <>
                      <Badge bg="success"><i className="bi bi-clock me-1"></i>{formatTime(s.thoiGianBatDau)}</Badge><br/><small className="text-muted">{formatDate(s.thoiGianBatDau)}</small>
                    </>
                  )}
                </td>
                <td className="text-end fw-semibold">{(s.giaVeCoBan||0).toLocaleString('vi-VN')} ₫</td>
                <td className="text-center">{getStatusBadge(s.trangThai)}</td>
                <td className="text-center text-nowrap">
                  {viewMode === 'compact' ? (
                    <Button variant="outline-info" size="sm" onClick={()=>handleEdit(s.allShows[0])} title="Quản lý"><i className="bi bi-gear-fill me-1"></i>Sửa</Button>
                  ) : (
                    <>
                      <Button variant="outline-primary" size="sm" className="me-1" onClick={()=>handleEdit(s)} title="Sửa"><i className="bi bi-pencil"></i></Button>
                      <Button variant="outline-info" size="sm" className="me-1" onClick={()=>handleView(s)} title="Chi tiết"><i className="bi bi-eye"></i></Button>
                      <Button variant="outline-danger" size="sm" onClick={()=>handleDelete(s.id)} title="Xóa"><i className="bi bi-trash"></i></Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {paged.length===0&&<tr><td colSpan={7} className="text-center text-muted py-4">Không có dữ liệu</td></tr>}
          </tbody>
        </Table></div></Card.Body>
        <Card.Footer className="bg-white"><div className="d-flex justify-content-between align-items-center">
          <div className="text-muted small">Hiển thị {Math.min((currentPage-1)*itemsPerPage+1,allFiltered.length)}-{Math.min(currentPage*itemsPerPage,allFiltered.length)} / {allFiltered.length}</div>
          {renderPag()}
        </div></Card.Footer>
      </Card>
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{modalMode === 'add' ? 'Thêm suất chiếu' : modalMode === 'edit' ? 'Chỉnh sửa' : 'Chi tiết'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalMode === 'view' && selectedItem ? (
            <div>
              <h4 className="text-primary mb-3">{selectedItem.tenPhim}</h4>
              <p><strong>Rạp:</strong> {selectedItem.tenRap}</p>
              <p><strong>Phòng:</strong> {selectedItem.tenPhong}</p>
              <p><strong>Bắt đầu:</strong> {new Date(selectedItem.thoiGianBatDau).toLocaleString('vi-VN')}</p>
              <p><strong>Kết thúc:</strong> {new Date(selectedItem.thoiGianKetThuc).toLocaleString('vi-VN')}</p>
              <p><strong>Giá vé:</strong> {(selectedItem.giaVeCoBan || 0).toLocaleString('vi-VN')} ₫</p>
            </div>
          ) : (
            <>
              {modalMode !== 'view' && (
                <div className="mb-3 p-3 bg-light rounded d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1 fw-bold">Chế độ tạo suất chiếu</h6>
                    <p className="text-muted small mb-0">Chọn nhập tay hoặc tự động sinh lịch theo ngày</p>
                  </div>
                  <Form.Check 
                    type="switch"
                    id="gen-switch"
                    label={isGenerating ? "Tự động sinh" : "Nhập tay"}
                    checked={isGenerating}
                    onChange={() => setIsGenerating(!isGenerating)}
                    className="fw-bold text-primary"
                  />
                </div>
              )}

              <Form>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Phim</Form.Label>
                      <Form.Select isInvalid={!!errors.phimId} value={formData.phimId} onChange={e => setFormData(p => ({ ...p, phimId: e.target.value }))}>
                        <option value="">-- Chọn phim --</option>
                        {movies.map(m => (<option key={m.id} value={m.id}>{m.ten} ({m.thoiLuong}p)</option>))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{errors.phimId}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Phòng chiếu</Form.Label>
                      <Form.Select isInvalid={!!errors.phongChieuId} value={formData.phongChieuId} onChange={e => setFormData(p => ({ ...p, phongChieuId: e.target.value }))}>
                        <option value="">-- Chọn phòng --</option>
                        {rooms.map(r => (<option key={r.id} value={r.id}>{r.ten} ({cinemas.find(c => c.id === r.rapChieuId)?.ten || ''})</option>))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{errors.phongChieuId}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {isGenerating ? (
                  <Card className="border-info mb-3">
                    <Card.Body>
                      <h6 className="text-info fw-bold mb-3"><i className="bi bi-magic me-2"></i>Cấu hình sinh lịch tự động</h6>
                      <Row className="mb-3">
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label className="small">Ngày chiếu</Form.Label>
                            <Form.Control type="date" value={formData.ngayChieu} onChange={e => setFormData(p => ({ ...p, ngayChieu: e.target.value }))} />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label className="small">Thời gian từ</Form.Label>
                            <Form.Control type="time" value={genSettings.start} onChange={e => setGenSettings(p => ({ ...p, start: e.target.value }))} />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label className="small">Đến (dự kiến)</Form.Label>
                            <Form.Control type="time" value={genSettings.end} onChange={e => setGenSettings(p => ({ ...p, end: e.target.value }))} />
                          </Form.Group>
                        </Col>
                      </Row>
                      <div className="d-grid">
                        <Button variant="outline-info" onClick={handlePreview}>
                          <i className="bi bi-eye me-2"></i>Xem trước danh sách suất chiếu
                        </Button>
                      </div>

                      {previewShows.length > 0 && (
                        <div className="mt-3">
                          <p className="small fw-bold mb-2 text-muted">Dự kiến tạo {previewShows.length} suất chiếu:</p>
                          <div className="d-flex flex-wrap gap-2" style={{maxHeight:'150px', overflowY:'auto'}}>
                            {previewShows.map((s, idx) => (
                              <Badge key={idx} bg="light" text="dark" className="border p-2">
                                {s.start.toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'})} - {s.end.toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'})}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                ) : (
                  <>
                    <Row className="mb-3">
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Mã</Form.Label>
                          <Form.Control isInvalid={!!errors.ma} value={formData.ma} onChange={e => setFormData(p => ({ ...p, ma: e.target.value }))} />
                          <Form.Control.Feedback type="invalid">{errors.ma}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Định dạng phim</Form.Label>
                          <Form.Select isInvalid={!!errors.dinhDangPhimId} value={formData.dinhDangPhimId} onChange={e => setFormData(p => ({ ...p, dinhDangPhimId: e.target.value }))}>
                            <option value="">-- Chọn định dạng --</option>
                            {formats.map(f => (<option key={f.id} value={f.id}>{f.ten}</option>))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">{errors.dinhDangPhimId}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Ngày chiếu</Form.Label>
                          <Form.Control type="date" isInvalid={!!errors.ngayChieu} value={formData.ngayChieu} onChange={e => setFormData(p => ({ ...p, ngayChieu: e.target.value }))} />
                          <Form.Control.Feedback type="invalid">{errors.ngayChieu}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Giờ bắt đầu</Form.Label>
                          <Form.Control type="time" isInvalid={!!errors.gioBatDau} value={formData.gioBatDau} onChange={e => setFormData(p => ({ ...p, gioBatDau: e.target.value }))} />
                          <Form.Control.Feedback type="invalid">{errors.gioBatDau}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Giá vé cơ bản</Form.Label>
                          <InputGroup>
                            <Form.Control type="number" isInvalid={!!errors.giaVeCoBan} value={formData.giaVeCoBan} onChange={e => setFormData(p => ({ ...p, giaVeCoBan: Number(e.target.value) }))} />
                            <InputGroup.Text>₫</InputGroup.Text>
                            <Form.Control.Feedback type="invalid">{errors.giaVeCoBan}</Form.Control.Feedback>
                          </InputGroup>
                        </Form.Group>
                      </Col>
                      {modalMode === 'edit' && (
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Trạng thái</Form.Label>
                            <Form.Select value={formData.trangThai} onChange={e => setFormData(p => ({ ...p, trangThai: Number(e.target.value) }))}>
                              <option value={1}>Đã lên lịch</option>
                              <option value={2}>Đang chiếu</option>
                              <option value={3}>Đã kết thúc</option>
                              <option value={0}>Đã hủy</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      )}
                    </Row>
                  </>
                )}
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>{modalMode === 'view' ? 'Đóng' : 'Hủy'}</Button>
          {modalMode !== 'view' && (
            isGenerating ? (
              <Button variant="info" onClick={handleGenerate} className="text-white" disabled={previewShows.length === 0}>
                <i className="bi bi-check-all me-2"></i>Xác nhận tạo {previewShows.length} suất chiếu
              </Button>
            ) : (
              <Button variant="danger" onClick={handleSave}><i className="bi bi-check-circle me-2"></i>Lưu</Button>
            )
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminShowtimes;

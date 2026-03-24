import React, { useState, useEffect } from 'react';
import { 
  Card, Table, Button, Form, InputGroup, 
  Badge, Modal, Pagination
} from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Cinema {
  id: string;
  ma: string;
  ten: string;
  dia_chi: string;
  khu_vuc: string;
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

const AdminRooms: React.FC = () => {
  const { cinemaId } = useParams();
  const navigate = useNavigate();

  const [cinema, setCinema] = useState<Cinema | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  
  // Search and Pagination
  const [roomSearch, setRoomSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Forms and Modals
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [roomModalMode, setRoomModalMode] = useState<'add'|'edit'>('add');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [roomErrors, setRoomErrors] = useState<{[key:string]: string}>({});

  const emptyRoomForm = { rapChieuId: cinemaId || '', ma: '', ten: '', sucChua: 100, loaiMayChieu: 1, trangThai: 1 };
  const [roomForm, setRoomForm] = useState(emptyRoomForm);

  // Seat Map
  const [showSeatMapModal, setShowSeatMapModal] = useState(false);
  const [seatMapRoom, setSeatMapRoom] = useState<Room | null>(null);
  const [roomSeats, setRoomSeats] = useState<any[]>([]);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [seatConfigCols, setSeatConfigCols] = useState(12);
  const [seatConfigCapacity, setSeatConfigCapacity] = useState(100);
  const [isGeneratingSeats, setIsGeneratingSeats] = useState(false);

  // Seat Type & Edit
  const [seatTypes, setSeatTypes] = useState<LoaiGhe[]>([]);
  const [showSeatEditModal, setShowSeatEditModal] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<any>(null);
  const [seatEditForm, setSeatEditForm] = useState({ loaiGheId: '', trangThai: 1 });

  useEffect(() => {
    if (cinemaId) {
      fetchCinemaInfo();
      fetchRooms();
      fetchSeatTypes();
    }
  }, [cinemaId]);

  const fetchSeatTypes = async () => {
    try {
      const res = await fetch(`${API_BASE}/loai-ghe`);
      const json = await res.json();
      if (json.success && json.data) {
        setSeatTypes(json.data);
      }
    } catch (e) { console.error('Lỗi tải danh sách loại ghế', e); }
  };

  const fetchCinemaInfo = async () => {
    try {
      const res = await fetch(`${API_BASE}/rap-chieu`);
      const json = await res.json();
      if (json.success && json.data) {
        const found = json.data.find((c: any) => c.id === cinemaId);
        if (found) setCinema(found);
      }
    } catch (e) { toast.error('Lỗi tải thông tin rạp'); }
  };

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API_BASE}/phong-chieu`);
      const json = await res.json();
      if (json.success && json.data) {
        const mapped = json.data
          .filter((r: any) => r.rapChieuId === cinemaId)
          .map((r: any) => ({
            ...r, rap_chieu_id: r.rapChieuId, suc_chua: r.sucChua, loai_may_chieu: r.loaiMayChieu, trang_thai: r.trangThai
          }));
        setRooms(mapped);
      }
    } catch (e) {
      toast.error('Lỗi tải danh sách phòng chiếu');
    }
  };

  const fetchSeats = async (roomId: string) => {
    setLoadingSeats(true);
    try {
      const res = await fetch(`${API_BASE}/ghe-ngoi`);
      const json = await res.json();
      if (json.success && json.data) {
        setRoomSeats(json.data.filter((s: any) => s.phongChieuId === roomId));
      }
    } catch (e) { toast.error('Lỗi tải thông tin ghế ngồi'); }
    setLoadingSeats(false);
  };

  // Handlers
  const handleOpenAddRoom = () => {
    setRoomModalMode('add');
    setSelectedRoom(null);
    setRoomForm({ ...emptyRoomForm, rapChieuId: cinemaId || '' });
    setRoomErrors({});
    setShowRoomModal(true);
  };

  const handleOpenEditRoom = (room: Room) => {
    setRoomModalMode('edit');
    setSelectedRoom(room);
    setRoomForm({
      rapChieuId: room.rap_chieu_id, ma: room.ma, ten: room.ten,
      sucChua: room.suc_chua, loaiMayChieu: room.loai_may_chieu, trangThai: room.trang_thai
    });
    setRoomErrors({});
    setShowRoomModal(true);
  };

  const handleSaveRoom = async () => {
    const newErrors: any = {};
    const trimmedMa = (roomForm.ma || '').trim().toUpperCase();
    const trimmedTen = (roomForm.ten || '').trim();

    if (!trimmedMa) newErrors.ma = 'Mã phòng không được để trống';
    else if (!/^[A-Z0-9]+$/.test(trimmedMa)) newErrors.ma = 'Mã phòng chỉ gồm chữ in hoa và số';

    if (!trimmedTen) newErrors.ten = 'Tên phòng không được để trống';
    if (roomForm.sucChua <= 0) newErrors.sucChua = 'Sức chứa phòng phải lớn hơn 0';
    if (!roomForm.rapChieuId) newErrors.rapChieuId = 'Rạp chiếu không được để trống';

    if (Object.keys(newErrors).length > 0) {
      setRoomErrors(newErrors);
      toast.error('Vui lòng kiểm tra lại thông tin!');
      return;
    }

    try {
      const payload = { ...roomForm, ma: trimmedMa, ten: trimmedTen };
      const url = roomModalMode === 'add' ? `${API_BASE}/phong-chieu` : `${API_BASE}/phong-chieu/${selectedRoom?.id}`;
      const method = roomModalMode === 'add' ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method, headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success || res.ok) {
        toast.success(roomModalMode === 'add' ? 'Thêm phòng chiếu thành công' : 'Cập nhật phòng thành công');
        setShowRoomModal(false);
        fetchRooms();
      } else {
        if (data.data && typeof data.data === 'object' && Object.keys(data.data).length > 0) {
          setRoomErrors(data.data as any);
          toast.error('Vui lòng kiểm tra lại thông tin phòng chiếu!');
        } else {
          toast.error('Lỗi lưu: ' + data.message);
        }
      }
    } catch (e) { toast.error('Lỗi hệ thống'); }
  };

  const handleDeleteRoom = async (id: string) => {
    if (window.confirm('Bạn có muốn xóa (chuyển vào thùng rác) phòng chiếu này?')) {
      try {
        const res = await fetch(`${API_BASE}/phong-chieu/${id}`, { method: 'DELETE' });
        if (res.ok) {
          toast.success('Xóa phòng chiếu thành công!');
          fetchRooms();
        }
      } catch (e) { toast.error('Lỗi xóa phòng'); }
    }
  };

  const handleRestoreRoom = async (room: Room) => {
    if (window.confirm('Khôi phục phòng chiếu này?')) {
      try {
        const payload = { ...room, rapChieuId: room.rap_chieu_id, sucChua: room.suc_chua, loaiMayChieu: room.loai_may_chieu, trangThai: 1 };
        const res = await fetch(`${API_BASE}/phong-chieu/${room.id}`, {
          method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)
        });
        if (res.ok) {
          toast.success('Khôi phục phòng thành công!');
          fetchRooms();
        }
      } catch (e) { toast.error('Lỗi khôi phục'); }
    }
  };

  const handleGenerateSeats = async () => {
    if (!seatMapRoom) return;
    const totalCapacity = seatConfigCapacity;
    if (!totalCapacity || totalCapacity <= 0) {
      toast.error('Vui lòng nhập sức chứa hợp lệ!');
      return;
    }
    
    if (roomSeats.length > 0) {
      if (!window.confirm('Cảnh báo: Việc tạo sơ đồ mới sẽ XÓA TOÀN BỘ cấu hình ghế hiện tại của phòng này. Bạn có chắc chắn?')) return;
    }

    setIsGeneratingSeats(true);
    
    // Xóa ghế cũ nếu có
    if (roomSeats.length > 0) {
      const toastId = toast.loading('Đang xóa các ghế cũ...');
      try {
        const deletePromises = roomSeats.map(s => fetch(`${API_BASE}/ghe-ngoi/${s.id}`, { method: 'DELETE' }));
        await Promise.all(deletePromises);
        toast.dismiss(toastId);
      } catch (e) {
        toast.dismiss(toastId);
        toast.error('Lỗi khi xóa ghế cũ');
        setIsGeneratingSeats(false);
        return;
      }
    }

    // Đồng bộ Sức chứa (Capacity) mới cập nhật vào Database cho đúng với table bên phân trang
    try {
      const roomUpdatePayload = { 
        ...seatMapRoom, 
        rapChieuId: seatMapRoom.rap_chieu_id, 
        sucChua: totalCapacity, 
        loaiMayChieu: seatMapRoom.loai_may_chieu, 
        trangThai: seatMapRoom.trang_thai 
      };
      await fetch(`${API_BASE}/phong-chieu/${seatMapRoom.id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(roomUpdatePayload) });
    } catch (e) {
      console.error("Không thể tự động cập nhật sức chứa của phòng", e);
    }

    const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const cols = seatConfigCols;
    const rows = Math.ceil(totalCapacity / cols);
    const totalRequests = totalCapacity;

    let defaultSeatTypeId = null;
    if (seatTypes.length > 0) {
      const standardType = seatTypes.find(t => t.ten.toLowerCase().includes('thường') || t.ten.toLowerCase().includes('standard'));
      defaultSeatTypeId = standardType ? standardType.id : seatTypes[0].id;
    }
    
    if (!defaultSeatTypeId) {
      toast.error('Không tìm thấy Loại Ghế mặc định từ hệ thống!');
      setIsGeneratingSeats(false);
      return;
    }
    
    let successCount = 0;
    let createdCount = 0;
    
    try {
      for (let i = 0; i < rows; i++) {
        if (createdCount >= totalCapacity || i >= 26) break;
        const hangGhe = rowLabels[i];
        for (let j = 1; j <= cols; j++) {
          if (createdCount >= totalCapacity) break;
          const payload = {
            phongChieuId: seatMapRoom.id,
            loaiGheId: defaultSeatTypeId,
            maGhe: `${hangGhe}${j}`,
            hangGhe: hangGhe,
            soThuTu: j,
            trangThai: 1
          };
          const res = await fetch(`${API_BASE}/ghe-ngoi`, {
            method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)
          });
          if (res.ok) successCount++;
          createdCount++;
        }
      }
      toast.success(`Khởi tạo thành công ${successCount}/${totalRequests} ghế`);
      await fetchSeats(seatMapRoom.id);
      fetchRooms(); // Cập nhật lại table Danh sách phòng để hiện Sức chứa mới
    } catch (e) {
      toast.error('Có lỗi xảy ra khi tạo sơ đồ ghế');
    }
    setIsGeneratingSeats(false);
  };

  const handleSeatClick = (seat: any) => {
    setSelectedSeat(seat);
    setSeatEditForm({
      loaiGheId: seat.loaiGheId || '',
      trangThai: seat.trangThai !== undefined ? seat.trangThai : 1
    });
    setShowSeatEditModal(true);
  };

  const handleSaveSeatEdit = async () => {
    if (!selectedSeat) return;
    try {
      const payload = {
        ...selectedSeat,
        loaiGheId: seatEditForm.loaiGheId || null,
        trangThai: seatEditForm.trangThai
      };
      const res = await fetch(`${API_BASE}/ghe-ngoi/${selectedSeat.id}`, {
        method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast.success(`Cập nhật ghế ${selectedSeat.maGhe} thành công`);
        setShowSeatEditModal(false);
        if (seatMapRoom) fetchSeats(seatMapRoom.id);
      } else {
        toast.error('Cập nhật thất bại');
      }
    } catch (e) { toast.error('Lỗi hệ thống'); }
  };

  const getSeatColorClass = (seat: any) => {
    if (seat.trangThai === 0) return 'btn-danger';
    if (seat.trangThai === 3) return 'btn-dark opacity-25';
    if (!seat.loaiGheId) return 'btn-secondary text-white';
    
    const type = seatTypes.find(t => t.id === seat.loaiGheId);
    if (!type) return 'btn-secondary text-white';
    
    const name = type.ten.toLowerCase();
    if (name.includes('vip')) return 'btn-warning text-dark fw-bold';
    if (name.includes('đôi') || name.includes('couple') || name.includes('sweetbox') || name.includes('đồi')) return 'btn-info text-white fw-bold';
    
    return 'btn-secondary text-white';
  };

  // Filtering and Pagination
  const filteredRooms = rooms.filter(r => r.ten.toLowerCase().includes(roomSearch.toLowerCase()) || r.ma.toLowerCase().includes(roomSearch.toLowerCase()));
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const paginatedRooms = filteredRooms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  useEffect(() => { setCurrentPage(1); }, [roomSearch]);

  const renderPagination = () => {
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
    if (status === 0) return <Badge bg="secondary">Bảo trì</Badge>;
    if (status === 3) return <Badge bg="danger">Đã xóa</Badge>;
    return <Badge bg="light" text="dark">Không xác định</Badge>;
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 fw-bold">
            <Button variant="link" className="p-0 text-dark text-decoration-none me-3" onClick={() => navigate('/admin/cinemas')}><i className="bi bi-arrow-left fs-4"></i></Button>
            Quản lý Phòng chiếu
          </h2>
          <p className="text-muted mb-0 ms-5">{cinema ? `Thuộc rạp: ${cinema.ten} - ${cinema.dia_chi}` : 'Đang tải thông tin rạp...'}</p>
        </div>
      </div>

      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <InputGroup style={{ width: '300px' }}>
              <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
              <Form.Control placeholder="Tìm kiếm phòng chiếu..." value={roomSearch} onChange={e=>setRoomSearch(e.target.value)} />
            </InputGroup>
            <Button variant="danger" onClick={handleOpenAddRoom}>
              <i className="bi bi-plus-circle me-2"></i> Thêm phòng chiếu
            </Button>
          </div>
          
          <Table hover responsive className="mb-0">
            <thead className="bg-light">
              <tr>
                <th className="text-center" style={{ width: '100px' }}>Mã</th>
                <th className="text-start">Tên phòng</th>
                <th className="text-center">Loại (Định dạng)</th>
                <th className="text-center">Sức chứa</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-center text-nowrap">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRooms.map(r => (
                <tr key={r.id}>
                  <td className="text-center"><Badge bg="light" text="dark" className="border">{r.ma}</Badge></td>
                  <td className="text-start fw-semibold">{r.ten}</td>
                  <td className="text-center"><Badge bg={r.loai_may_chieu === 3 ? 'danger' : r.loai_may_chieu === 4 ? 'warning' : 'info'}>{r.loai_may_chieu === 1 ? '2D' : r.loai_may_chieu === 2 ? '3D' : r.loai_may_chieu === 3 ? 'IMAX' : r.loai_may_chieu === 4 ? '4DX' : 'N/A'}</Badge></td>
                  <td className="text-center">{r.suc_chua} ghế</td>
                  <td className="text-center">{getStatusBadge(r.trang_thai)}</td>
                  <td className="text-center text-nowrap">
                    {r.trang_thai === 3 ? (
                      <Button variant="outline-success" size="sm" onClick={() => handleRestoreRoom(r)}><i className="bi bi-arrow-counterclockwise"></i> Khôi phục</Button>
                    ) : (
                      <>
                        <Button variant="outline-success" size="sm" className="me-1" title="Sơ đồ ghế" onClick={() => { setSeatMapRoom(r); setShowSeatMapModal(true); fetchSeats(r.id); setSeatConfigCapacity(r.suc_chua || 100); }}><i className="bi bi-grid-3x3"></i></Button>
                        <Button variant="outline-primary" size="sm" className="me-1" title="Sửa" onClick={() => handleOpenEditRoom(r)}><i className="bi bi-pencil"></i></Button>
                        <Button variant="outline-danger" size="sm" title="Xóa" onClick={() => handleDeleteRoom(r.id)}><i className="bi bi-trash"></i></Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {paginatedRooms.length === 0 && <tr><td colSpan={6} className="text-center text-muted py-4">Chưa có phòng chiếu nào phù hợp</td></tr>}
            </tbody>
          </Table>
        </Card.Body>
        <Card.Footer className="bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-muted small">Hiển thị {Math.min((currentPage-1)*itemsPerPage+1, filteredRooms.length)}-{Math.min(currentPage*itemsPerPage, filteredRooms.length)} / {filteredRooms.length} phòng</div>
            {renderPagination()}
          </div>
        </Card.Footer>
      </Card>

      {/* Room Modal */}
      <Modal show={showRoomModal} onHide={() => setShowRoomModal(false)}>
        <Modal.Header closeButton><Modal.Title>{roomModalMode==='add'?'Thêm phòng chiếu mới':'Chỉnh sửa thông tin phòng'}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3"><Form.Label>Rạp chiếu</Form.Label>
              <Form.Control type="text" value={cinema?.ten || ''} disabled readOnly />
            </Form.Group>
            <Form.Group className="mb-3"><Form.Label>Mã phòng</Form.Label>
              <Form.Control type="text" isInvalid={!!roomErrors.ma} value={roomForm.ma} onChange={e=>setRoomForm({...roomForm, ma: e.target.value})} />
              <Form.Control.Feedback type="invalid">{roomErrors.ma}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3"><Form.Label>Tên phòng</Form.Label>
              <Form.Control type="text" isInvalid={!!roomErrors.ten} value={roomForm.ten} onChange={e=>setRoomForm({...roomForm, ten: e.target.value})} />
              <Form.Control.Feedback type="invalid">{roomErrors.ten}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3"><Form.Label>Loại máy chiếu</Form.Label>
              <Form.Select isInvalid={!!roomErrors.loaiMayChieu} value={roomForm.loaiMayChieu} onChange={e=>setRoomForm({...roomForm, loaiMayChieu: Number(e.target.value)})}>
                <option value={1}>2D</option><option value={2}>3D</option><option value={3}>IMAX</option><option value={4}>4DX</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{roomErrors.loaiMayChieu}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3"><Form.Label>Sức chứa</Form.Label>
              <Form.Control type="number" isInvalid={!!roomErrors.sucChua} value={roomForm.sucChua} onChange={e=>setRoomForm({...roomForm, sucChua: Number(e.target.value)})} />
              <Form.Control.Feedback type="invalid">{roomErrors.sucChua}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3"><Form.Label>Trạng thái</Form.Label>
              <Form.Select value={roomForm.trangThai} onChange={e=>setRoomForm({...roomForm, trangThai: Number(e.target.value)})}>
                <option value={1}>Hoạt động</option><option value={0}>Bảo trì</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRoomModal(false)}>Hủy</Button>
          <Button variant="danger" onClick={handleSaveRoom}>Lưu lại</Button>
        </Modal.Footer>
      </Modal>

      {/* Seat Map View Modal */}
      <Modal show={showSeatMapModal} onHide={() => setShowSeatMapModal(false)} size="xl">
        <Modal.Header closeButton><Modal.Title>Sơ đồ ghế - {seatMapRoom?.ten} <Badge bg="info">{seatMapRoom?.loai_may_chieu === 1 ? '2D' : seatMapRoom?.loai_may_chieu === 2 ? '3D' : seatMapRoom?.loai_may_chieu === 3 ? 'IMAX' : seatMapRoom?.loai_may_chieu === 4 ? '4DX' : ''}</Badge></Modal.Title></Modal.Header>
        <Modal.Body>
          {loadingSeats ? (
            <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
          ) : (
            <>
              <div className="bg-white p-3 border rounded mb-4">
                <h6 className="mb-3 text-center">{roomSeats.length === 0 ? 'Phát sinh sơ đồ ghế tự động' : 'Tạo lại Sơ đồ ghế (Xóa sơ đồ cũ)'}</h6>
                <div className="d-flex align-items-center justify-content-center gap-2">
                  <InputGroup style={{width: 250}}>
                    <InputGroup.Text>Sức chứa (Tổng ghế)</InputGroup.Text>
                    <Form.Control type="number" min={1} value={seatConfigCapacity} onChange={e=>setSeatConfigCapacity(Number(e.target.value))} />
                  </InputGroup>
                  <InputGroup style={{width: 250}}>
                    <InputGroup.Text>Số cột (dự kiến)</InputGroup.Text>
                    <Form.Control type="number" min={1} max={50} value={seatConfigCols} onChange={e=>setSeatConfigCols(Number(e.target.value))} />
                  </InputGroup>
                  <Button variant={roomSeats.length === 0 ? "primary" : "warning"} onClick={handleGenerateSeats} disabled={isGeneratingSeats}>
                    {isGeneratingSeats ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-magic me-2"></i>}
                    {roomSeats.length === 0 ? 'Phát sinh sơ đồ' : 'Tạo sơ đồ mới'}
                  </Button>
                </div>
              </div>
              
              {roomSeats.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-grid-3x3 text-muted" style={{fontSize: '3rem'}}></i>
                  <h5 className="mt-3">Phòng này chưa có sơ đồ ghế gắn kết</h5>
                  <p className="text-muted small mt-2">Nhập thông số phía trên và ấn Phát sinh sơ đồ để bắt đầu.</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-4"><div className="bg-secondary text-white py-2 px-4 d-inline-block rounded"><i className="bi bi-tv me-2"></i> MÀN HÌNH</div></div>
              <div className="seat-map-container p-4 bg-light rounded text-center">
                {(() => {
                  const grouped: {[key: string]: any[]} = {};
                  roomSeats.forEach(s => {
                    if (!grouped[s.hangGhe]) grouped[s.hangGhe] = [];
                    grouped[s.hangGhe].push(s);
                  });
                  return Object.keys(grouped).sort().map(hang => {
                    const rowSeats = grouped[hang].sort((a,b) => a.soThuTu - b.soThuTu);
                    return (
                      <div key={hang} className="mb-2 d-flex justify-content-center">
                        <div className="fw-bold text-muted me-3" style={{ width: 20 }}>{hang}</div>
                        {rowSeats.map(s => (
                           <button key={s.id} onClick={() => handleSeatClick(s)} className={`btn btn-sm me-1 ${getSeatColorClass(s)}`} style={{width: 35, height: 35, padding: 0}} title={s.maGhe}>
                             {s.soThuTu}
                           </button>
                        ))}
                      </div>
                    )
                  })
                })()}
              </div>
            </>
          )}
          </>
        )}
        </Modal.Body>
      </Modal>

      {/* Seat Edit Modal */}
      <Modal show={showSeatEditModal} onHide={() => setShowSeatEditModal(false)} backdrop="static" size="sm" centered>
        <Modal.Header closeButton><Modal.Title className="fs-6">Chỉnh sửa ghế {selectedSeat?.maGhe}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3"><Form.Label className="small mb-1">Loại ghế</Form.Label>
              <Form.Select size="sm" value={seatEditForm.loaiGheId} onChange={e=>setSeatEditForm({...seatEditForm, loaiGheId: e.target.value})}>
                {seatTypes.map(t => (
                  <option key={t.id} value={t.id}>{t.ten} (+{(t.phuThu || 0).toLocaleString()}đ)</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-0"><Form.Label className="small mb-1">Trạng thái</Form.Label>
              <Form.Select size="sm" value={seatEditForm.trangThai} onChange={e=>setSeatEditForm({...seatEditForm, trangThai: Number(e.target.value)})}>
                <option value={1}>Hoạt động</option>
                <option value={0}>Hỏng / Bảo trì</option>
                <option value={3}>Đã xóa (Ẩn)</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="p-2">
          <Button variant="secondary" size="sm" onClick={() => setShowSeatEditModal(false)}>Hủy</Button>
          <Button variant="primary" size="sm" onClick={handleSaveSeatEdit}>Lưu</Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default AdminRooms;

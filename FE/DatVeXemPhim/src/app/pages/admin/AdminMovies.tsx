import React, { useState, useEffect } from 'react';
import { 
  Row, Col, Card, Table, Button, Form, InputGroup, 
  Badge, Modal, Pagination, Collapse 
} from 'react-bootstrap';
import { toast } from 'sonner';

interface Movie {
  id: string;
  ma: string;
  ten: string;
  thoi_luong: number;
  ngay_cong_chieu: string;
  ngay_ket_thuc: string;
  hinh_anh_poster: string;
  trailer_url: string;
  mo_ta: string;
  the_loai: string[];
  dao_dien: string[];
  dien_vien: string[];
  ngon_ngu: string[];
  phan_loai_do_tuoi: string;
  trang_thai: number;
}

const AdminMovies: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Advanced Filters
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterGenre, setFilterGenre] = useState('all');
  const [filterAgeRating, setFilterAgeRating] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // States for Dropdowns
  const [genres, setGenres] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);
  const [directors, setDirectors] = useState<any[]>([]);
  const [actors, setActors] = useState<any[]>([]);
  const [ageRatings, setAgeRatings] = useState<any[]>([]);

  interface MovieFormData {
    phanLoaiDoTuoiId: string;
    ma: string;
    ten: string;
    thoiLuong: number;
    ngayCongChieu: string;
    ngayKetThuc: string;
    hinhAnhPoster: string;
    trailerUrl: string;
    moTa: string;
    trangThai: number;
    theLoaiIds: string[];
    daoDienIds: string[];
    dienVienIds: string[];
    ngonNguIds: string[];
  }

  const initialFormData: MovieFormData = {
    phanLoaiDoTuoiId: '', ma: '', ten: '', thoiLuong: 0,
    ngayCongChieu: '', ngayKetThuc: '', hinhAnhPoster: '',
    trailerUrl: '', moTa: '', trangThai: 0,
    theLoaiIds: [], daoDienIds: [], dienVienIds: [], ngonNguIds: []
  };

  const [formData, setFormData] = useState<MovieFormData>(initialFormData);
  const [errors, setErrors] = useState<{[key:string]: string}>({});

  const API_BASE = 'http://localhost:9999/api/admin';

  useEffect(() => {
    fetch(`${API_BASE}/the-loai`).then(res => res.json()).then(res => setGenres(res.data || [])).catch(console.error);
    fetch(`${API_BASE}/ngon-ngu`).then(res => res.json()).then(res => setLanguages(res.data || [])).catch(console.error);
    fetch(`${API_BASE}/dao-dien`).then(res => res.json()).then(res => setDirectors(res.data || [])).catch(console.error);
    fetch(`${API_BASE}/dien-vien`).then(res => res.json()).then(res => setActors(res.data || [])).catch(console.error);
    fetch(`${API_BASE}/phan-loai-do-tuoi`).then(res => res.json()).then(res => setAgeRatings(res.data || [])).catch(console.error);
    
    fetchMovies();
  }, []);

  const [movies, setMovies] = useState<Movie[]>([]);

  const fetchMovies = async () => {
    try {
      const response = await fetch(`${API_BASE}/phim`);
      const jsonResponse = await response.json();
      if (jsonResponse.success && jsonResponse.data) {
        const mappedData: Movie[] = jsonResponse.data.map((m: any) => ({
          id: m.id,
          ma: m.ma,
          ten: m.ten,
          thoi_luong: m.thoiLuong,
          ngay_cong_chieu: m.ngayCongChieu ? m.ngayCongChieu.split('T')[0] : '',
          ngay_ket_thuc: m.ngayKetThuc ? m.ngayKetThuc.split('T')[0] : '',
          hinh_anh_poster: m.hinhAnhPoster,
          trailer_url: m.trailerUrl,
          mo_ta: m.moTa,
          the_loai: m.theLoai || [],
          dao_dien: m.daoDien || [],
          dien_vien: m.dienVien || [],
          ngon_ngu: m.ngonNgu || [],
          phan_loai_do_tuoi: m.phanLoaiDoTuoi || 'K',
          trang_thai: m.trangThai || 0
        }));
        setMovies(mappedData);
      }
    } catch (error) {
      console.error('Lỗi khi fetch Phim:', error);
    }
  };

  // Auto-compute status from dates
  const computeStatus = (movie: Movie): number => {
    if (movie.trang_thai === 3) return 3; // Đã xóa (soft delete) giữ nguyên
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = movie.ngay_cong_chieu ? new Date(movie.ngay_cong_chieu) : null;
    const end = movie.ngay_ket_thuc ? new Date(movie.ngay_ket_thuc) : null;
    if (start && today < start) return 0; // Sắp chiếu
    if (start && end && today >= start && today <= end) return 1; // Đang chiếu
    if (end && today > end) return 2; // Đã kết thúc
    if (start && !end && today >= start) return 1; // Đang chiếu nếu chưa có ngày kết thúc
    return 0;
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0: return <Badge bg="warning">Sắp chiếu</Badge>;
      case 1: return <Badge bg="success">Đang chiếu</Badge>;
      case 2: return <Badge bg="secondary">Đã kết thúc</Badge>;
      case 3: return <Badge bg="danger">Đã xóa</Badge>;
      default: return <Badge bg="secondary">Không xác định</Badge>;
    }
  };

  const handleAddMovie = () => {
    setModalMode('add');
    setSelectedMovie(null);
    setFormData(initialFormData);
    setErrors({});
    setShowModal(true);
  };

  const handleEditMovie = (movie: Movie) => {
    setModalMode('edit');
    setSelectedMovie(movie);
    
    const theLoaiIds = movie.the_loai.map(name => genres.find(g => g.ten === name)?.id).filter(Boolean) as string[];
    const daoDienIds = movie.dao_dien.map(name => directors.find(g => g.ten === name)?.id).filter(Boolean) as string[];
    const dienVienIds = movie.dien_vien.map(name => actors.find(g => g.ten === name)?.id).filter(Boolean) as string[];
    const ngonNguIds = movie.ngon_ngu.map(name => languages.find(g => g.ten === name)?.id).filter(Boolean) as string[];
    const phanLoaiId = ageRatings.find(a => a.ma === movie.phan_loai_do_tuoi)?.id || '';

    setFormData({
      ma: movie.ma || '',
      ten: movie.ten || '',
      thoiLuong: movie.thoi_luong || 0,
      phanLoaiDoTuoiId: phanLoaiId,
      ngayCongChieu: movie.ngay_cong_chieu || '',
      ngayKetThuc: movie.ngay_ket_thuc || '',
      hinhAnhPoster: movie.hinh_anh_poster || '',
      trailerUrl: movie.trailer_url || '',
      moTa: movie.mo_ta || '',
      trangThai: movie.trang_thai ?? 0,
      theLoaiIds,
      daoDienIds,
      dienVienIds,
      ngonNguIds
    });
    setErrors({});
    setShowModal(true);
  };

  const handleViewMovie = (movie: Movie) => {
    setModalMode('view');
    setSelectedMovie(movie);
    setShowModal(true);
  };

  const handleSaveMovie = async () => {
    const newErrors: {[key:string]: string} = {};
    const trimmedMa = formData.ma.trim();
    const trimmedTen = formData.ten.trim();
    const poster = formData.hinhAnhPoster.trim();

    // 1. Check trống & trim
    if (!trimmedMa) newErrors.ma = 'Mã phim không được để trống';
    if (!trimmedTen) newErrors.ten = 'Tên phim không được để trống';
    if (formData.thoiLuong <= 0) newErrors.thoiLuong = 'Thời lượng phải lớn hơn 0';
    if (!formData.phanLoaiDoTuoiId) newErrors.phanLoaiDoTuoiId = 'Phân loại độ tuổi không được để trống';
    if (!formData.ngayCongChieu) newErrors.ngayCongChieu = 'Ngày công chiếu không được để trống';
    if (!formData.ngayKetThuc) newErrors.ngayKetThuc = 'Ngày kết thúc không được để trống';
    if (formData.daoDienIds.length === 0) newErrors.daoDienIds = 'Đạo diễn không được để trống';
    if (formData.dienVienIds.length === 0) newErrors.dienVienIds = 'Diễn viên không được để trống';
    if (formData.theLoaiIds.length === 0) newErrors.theLoaiIds = 'Thể loại không được để trống';
    if (formData.ngonNguIds.length === 0) newErrors.ngonNguIds = 'Ngôn ngữ không được để trống';
    if (!poster) newErrors.hinhAnhPoster = 'Hình ảnh phim không được để trống';
    if (!(formData.trailerUrl || '').trim()) newErrors.trailerUrl = 'Trailer URL không được để trống';

    // 2. Check ký tự đặc biệt ở Mã
    if (trimmedMa && !/^[a-zA-Z0-9_-]+$/.test(trimmedMa)) {
      newErrors.ma = 'Mã phim không được chứa khoảng trắng hoặc ký tự đặc biệt';
    }

    // 3. Check ngày bắt đầu < ngày kết thúc
    if (formData.ngayCongChieu && formData.ngayKetThuc) {
      if (new Date(formData.ngayCongChieu) > new Date(formData.ngayKetThuc)) {
        newErrors.ngayKetThuc = 'Ngày kết thúc không được trước ngày công chiếu';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Vui lòng kiểm tra lại thông tin nhập!');
      return;
    }

    // Auto-compute status from dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = formData.ngayCongChieu ? new Date(formData.ngayCongChieu) : null;
    const end = formData.ngayKetThuc ? new Date(formData.ngayKetThuc) : null;
    let autoStatus = 0;
    if (start && today < start) autoStatus = 0;
    else if (start && end && today >= start && today <= end) autoStatus = 1;
    else if (end && today > end) autoStatus = 2;
    else if (start && !end && today >= start) autoStatus = 1;

    const payload = {
      ...formData,
      ma: trimmedMa,
      ten: trimmedTen,
      hinhAnhPoster: poster,
      trangThai: autoStatus,
      phanLoaiDoTuoiId: formData.phanLoaiDoTuoiId || null,
      ngayCongChieu: formData.ngayCongChieu ? formData.ngayCongChieu + 'T00:00:00' : null,
      ngayKetThuc: formData.ngayKetThuc ? formData.ngayKetThuc + 'T00:00:00' : null,
      metadata: "{}",
      hinhAnhBanner: formData.hinhAnhPoster || ''
    };

    const method = modalMode === 'add' ? 'POST' : 'PUT';
    const url = modalMode === 'add' ? `${API_BASE}/phim` : `${API_BASE}/phim/${selectedMovie?.id}`;

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        toast.success(modalMode === 'add' ? 'Thêm phim thành công!' : 'Cập nhật phim thành công!');
        setShowModal(false);
        fetchMovies();
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
    } catch (error) {
      console.error(error);
      toast.error('Lỗi hệ thống khi lưu phim');
    }
  };

  const handleChange = (field: keyof MovieFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDeleteMovie = async (movieId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phim này? (Sẽ được chuyển vào thùng rác)')) {
      try {
        const response = await fetch(`${API_BASE}/phim/${movieId}`, { method: 'DELETE' });
        const data = await response.json();
        if (data.success || response.ok) {
          toast.success('Xóa phim thành công!');
          fetchMovies();
        } else {
          toast.error(data.message || 'Xóa phim thất bại!');
        }
      } catch (error) {
        console.error('Delete movie error:', error);
        toast.error('Lỗi hệ thống khi xóa phim');
      }
    }
  };

  const handleRestoreMovie = async (movie: Movie) => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục phim này không?')) {
      try {
        const theLoaiIds = movie.the_loai.map(name => genres.find(g => g.ten === name)?.id).filter(Boolean) as string[];
        const daoDienIds = movie.dao_dien.map(name => directors.find(g => g.ten === name)?.id).filter(Boolean) as string[];
        const dienVienIds = movie.dien_vien.map(name => actors.find(g => g.ten === name)?.id).filter(Boolean) as string[];
        const ngonNguIds = movie.ngon_ngu.map(name => languages.find(g => g.ten === name)?.id).filter(Boolean) as string[];
        const phanLoaiDoTuoiId = ageRatings.find(a => a.ma === movie.phan_loai_do_tuoi)?.id || null;

        // Auto-compute status from dates
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const start = movie.ngay_cong_chieu ? new Date(movie.ngay_cong_chieu) : null;
        const end = movie.ngay_ket_thuc ? new Date(movie.ngay_ket_thuc) : null;
        let autoStatus = 0;
        if (start && today < start) autoStatus = 0;
        else if (start && end && today >= start && today <= end) autoStatus = 1;
        else if (end && today > end) autoStatus = 2;
        else if (start && !end && today >= start) autoStatus = 1;

        const payload = {
          ma: movie.ma, ten: movie.ten, thoiLuong: movie.thoi_luong,
          phanLoaiDoTuoiId,
          ngayCongChieu: movie.ngay_cong_chieu ? movie.ngay_cong_chieu + 'T00:00:00' : null, 
          ngayKetThuc: movie.ngay_ket_thuc ? movie.ngay_ket_thuc + 'T00:00:00' : null,
          hinhAnhPoster: movie.hinh_anh_poster || '',
          hinhAnhBanner: movie.hinh_anh_poster || '',
          trailerUrl: movie.trailer_url || '',
          moTa: movie.mo_ta || '',
          metadata: "{}",
          trangThai: autoStatus,
          theLoaiIds, daoDienIds, dienVienIds, ngonNguIds
        };
        const response = await fetch(`${API_BASE}/phim/${movie.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (data.success || response.ok) {
          toast.success('Khôi phục phim thành công!');
          fetchMovies();
        } else {
          toast.error(data.message || 'Lỗi khôi phục');
        }
      } catch (error) {
        console.error(error);
        toast.error('Lỗi hệ thống');
      }
    }
  };

  // Apply auto-status to movies for display
  const moviesWithAutoStatus = movies.map(m => ({
    ...m,
    trang_thai: computeStatus(m)
  }));

  const filteredMovies = moviesWithAutoStatus.filter(movie => {
    const matchesSearch = (movie.ten || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (movie.ma || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    let matchesStatus;
    if (filterStatus === '3') {
      matchesStatus = movie.trang_thai === 3;
    } else {
      matchesStatus = filterStatus === 'all' ? movie.trang_thai !== 3 : movie.trang_thai.toString() === filterStatus;
    }

    // Date range filter (ngày công chiếu)
    let matchesDate = true;
    if (filterDateFrom) {
      matchesDate = matchesDate && movie.ngay_cong_chieu >= filterDateFrom;
    }
    if (filterDateTo) {
      matchesDate = matchesDate && movie.ngay_cong_chieu <= filterDateTo;
    }

    // Genre filter
    const matchesGenre = filterGenre === 'all' || movie.the_loai.some(g => {
      const genreItem = genres.find(gi => gi.id === filterGenre);
      return genreItem && g === genreItem.ten;
    });

    // Age rating filter
    const matchesAge = filterAgeRating === 'all' || movie.phan_loai_do_tuoi === filterAgeRating;

    return matchesSearch && matchesStatus && matchesDate && matchesGenre && matchesAge;
  });

  const handleResetFilters = () => {
    setFilterStatus('all');
    setFilterDateFrom('');
    setFilterDateTo('');
    setFilterGenre('all');
    setFilterAgeRating('all');
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  const paginatedMovies = filteredMovies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterStatus, filterDateFrom, filterDateTo, filterGenre, filterAgeRating]);

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
          <h2 className="mb-1 fw-bold">Quản lý Phim</h2>
          <p className="text-muted mb-0">Quản lý danh sách phim và thông tin chi tiết</p>
        </div>
        <Button variant="danger" onClick={handleAddMovie}>
          <i className="bi bi-plus-circle me-2"></i>
          Thêm phim mới
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Tổng số phim</p>
                  <h4 className="mb-0 fw-bold">{movies.length}</h4>
                </div>
                <div className="bg-primary bg-opacity-10 rounded p-2">
                  <i className="bi bi-film fs-5 text-primary"></i>
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
                  <p className="text-muted mb-1 small">Đang chiếu</p>
                  <h4 className="mb-0 fw-bold">{moviesWithAutoStatus.filter(m => m.trang_thai === 1).length}</h4>
                </div>
                <div className="bg-success bg-opacity-10 rounded p-2">
                  <i className="bi bi-play-circle fs-5 text-success"></i>
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
                  <p className="text-muted mb-1 small">Sắp chiếu</p>
                  <h4 className="mb-0 fw-bold">{moviesWithAutoStatus.filter(m => m.trang_thai === 0).length}</h4>
                </div>
                <div className="bg-warning bg-opacity-10 rounded p-2">
                  <i className="bi bi-clock-history fs-5 text-warning"></i>
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
                  <p className="text-muted mb-1 small">Đã kết thúc</p>
                  <h4 className="mb-0 fw-bold">{moviesWithAutoStatus.filter(m => m.trang_thai === 2).length}</h4>
                </div>
                <div className="bg-secondary bg-opacity-10 rounded p-2">
                  <i className="bi bi-stop-circle fs-5 text-secondary"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters & Search */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Tìm kiếm theo tên phim hoặc mã phim..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="0">Sắp chiếu</option>
                <option value="1">Đang chiếu</option>
                <option value="2">Đã kết thúc</option>
                <option value="3">Thùng rác (Đã xóa)</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Button 
                variant={showAdvancedFilter ? 'danger' : 'outline-secondary'} 
                className="w-100"
                onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
              >
                <i className={`bi ${showAdvancedFilter ? 'bi-funnel-fill' : 'bi-funnel'} me-2`}></i>
                Lọc nâng cao
                {(filterDateFrom || filterDateTo || filterGenre !== 'all' || filterAgeRating !== 'all') && (
                  <Badge bg="light" text="dark" className="ms-2">Đang lọc</Badge>
                )}
              </Button>
            </Col>
          </Row>

          {/* Advanced Filter Panel */}
          <Collapse in={showAdvancedFilter}>
            <div>
              <hr className="my-3" />
              <Row className="g-3">
                <Col md={3}>
                  <Form.Label className="small fw-semibold mb-1">
                    <i className="bi bi-calendar3 me-1"></i> Ngày công chiếu từ
                  </Form.Label>
                  <Form.Control type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)} />
                </Col>
                <Col md={3}>
                  <Form.Label className="small fw-semibold mb-1">
                    <i className="bi bi-calendar3 me-1"></i> Ngày công chiếu đến
                  </Form.Label>
                  <Form.Control type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)} />
                </Col>
                <Col md={3}>
                  <Form.Label className="small fw-semibold mb-1">
                    <i className="bi bi-tags me-1"></i> Thể loại
                  </Form.Label>
                  <Form.Select value={filterGenre} onChange={e => setFilterGenre(e.target.value)}>
                    <option value="all">Tất cả thể loại</option>
                    {genres.map(g => (
                      <option key={g.id} value={g.id}>{g.ten}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Label className="small fw-semibold mb-1">
                    <i className="bi bi-shield-check me-1"></i> Phân loại độ tuổi
                  </Form.Label>
                  <Form.Select value={filterAgeRating} onChange={e => setFilterAgeRating(e.target.value)}>
                    <option value="all">Tất cả</option>
                    {ageRatings.map(a => (
                      <option key={a.id} value={a.ma}>{a.ma} - {a.moTa || a.ten || ''}</option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
              <div className="mt-3 text-end">
                <Button variant="outline-secondary" size="sm" onClick={handleResetFilters}>
                  <i className="bi bi-x-circle me-1"></i> Xóa bộ lọc
                </Button>
              </div>
            </div>
          </Collapse>
        </Card.Body>
      </Card>

      {/* Movies Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="text-center" style={{ width: '80px' }}>Mã</th>
                  <th className="text-start">Phim</th>
                  <th className="text-center">Thời lượng</th>
                  <th className="text-start">Thể loại</th>
                  <th className="text-start">Ngày công chiếu</th>
                  <th className="text-center">Phân loại</th>
                  <th className="text-center">Trạng thái</th>
                  <th className="text-center text-nowrap" style={{ width: '150px' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMovies.map((movie) => (
                  <tr key={movie.id}>
                    <td className="text-center">
                      <span className="badge bg-light text-dark border">{movie.ma}</span>
                    </td>
                    <td className="text-start">
                      <div className="d-flex align-items-center">
                        <img 
                          src={movie.hinh_anh_poster || 'https://via.placeholder.com/50x70?text=No+Image'} 
                          alt={movie.ten}
                          className="rounded me-3 border"
                          style={{ width: 50, height: 70, objectFit: 'cover' }}
                        />
                        <div>
                          <div className="fw-semibold">{movie.ten}</div>
                          <small className="text-muted">
                            Đạo diễn: {movie.dao_dien.join(', ')}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">{movie.thoi_luong} phút</td>
                    <td className="text-start">
                      {movie.the_loai.slice(0, 2).map((genre, idx) => (
                        <Badge key={idx} bg="light" text="dark" className="me-1">
                          {genre}
                        </Badge>
                      ))}
                      {movie.the_loai.length > 2 && (
                        <Badge bg="light" text="dark">+{movie.the_loai.length - 2}</Badge>
                      )}
                    </td>
                    <td className="text-start">
                      <div className="small">
                        <div><i className="bi bi-calendar3 me-1"></i>{movie.ngay_cong_chieu}</div>
                        <div className="text-muted">
                          <i className="bi bi-calendar-x me-1"></i>{movie.ngay_ket_thuc}
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      <Badge 
                        bg={movie.phan_loai_do_tuoi === 'P' ? 'success' : 
                            movie.phan_loai_do_tuoi === 'T13' ? 'warning' : 'danger'}
                      >
                        {movie.phan_loai_do_tuoi}
                      </Badge>
                    </td>
                    <td className="text-center">{getStatusBadge(movie.trang_thai)}</td>
                    <td className="text-center text-nowrap">
                      {movie.trang_thai === 3 ? (
                        <Button 
                          variant="outline-success" 
                          size="sm"
                          onClick={() => handleRestoreMovie(movie)}
                        >
                          <i className="bi bi-arrow-counterclockwise"></i> Khôi phục
                        </Button>
                      ) : (
                        <>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="me-1"
                            onClick={() => handleEditMovie(movie)}
                          >
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button 
                            variant="outline-info" 
                            size="sm" 
                            className="me-1"
                            onClick={() => handleViewMovie(movie)}
                          >
                            <i className="bi bi-eye"></i>
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDeleteMovie(movie.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
        <Card.Footer className="bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-muted small">
              Hiển thị {Math.min((currentPage - 1) * itemsPerPage + 1, filteredMovies.length)}-{Math.min(currentPage * itemsPerPage, filteredMovies.length)} / {filteredMovies.length} phim
            </div>
            {renderPagination()}
          </div>
        </Card.Footer>
      </Card>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'add' ? 'Thêm phim mới' : modalMode === 'edit' ? 'Chỉnh sửa phim' : 'Chi tiết phim'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalMode === 'view' && selectedMovie ? (
            <Row>
              <Col md={4} className="text-center mb-3">
                <img src={selectedMovie.hinh_anh_poster} alt="Poster" className="img-fluid rounded shadow-sm border" style={{ maxHeight: '350px', objectFit: 'cover' }} />
                <div className="mt-3">
                  <Badge bg={selectedMovie.phan_loai_do_tuoi === 'P' ? 'success' : selectedMovie.phan_loai_do_tuoi === 'T13' ? 'warning' : 'danger'} className="me-2 fs-6">
                    {selectedMovie.phan_loai_do_tuoi}
                  </Badge>
                  {getStatusBadge(selectedMovie.trang_thai)}
                </div>
              </Col>
              <Col md={8}>
                <h4 className="fw-bold fs-3 text-primary mb-1">{selectedMovie.ten}</h4>
                <p className="text-muted fst-italic mb-3">Mã phim: {selectedMovie.ma}</p>
                <div className="mb-2"><strong><i className="bi bi-clock me-2"></i>Thời lượng:</strong> {selectedMovie.thoi_luong} phút</div>
                <div className="mb-2"><strong><i className="bi bi-calendar3 me-2"></i>Khởi chiếu:</strong> {selectedMovie.ngay_cong_chieu}</div>
                <div className="mb-2"><strong><i className="bi bi-calendar-x me-2"></i>Kết thúc:</strong> {selectedMovie.ngay_ket_thuc}</div>
                <div className="mb-2"><strong><i className="bi bi-tags me-2"></i>Thể loại:</strong> {selectedMovie.the_loai.join(', ') || 'N/A'}</div>
                <div className="mb-2"><strong><i className="bi bi-person-video me-2"></i>Đạo diễn:</strong> {selectedMovie.dao_dien.join(', ') || 'N/A'}</div>
                <div className="mb-2"><strong><i className="bi bi-people me-2"></i>Diễn viên:</strong> {selectedMovie.dien_vien.join(', ') || 'N/A'}</div>
                <div className="mb-2"><strong><i className="bi bi-translate me-2"></i>Ngôn ngữ:</strong> {selectedMovie.ngon_ngu.join(', ') || 'N/A'}</div>
                
                <h5 className="mt-4 fw-bold">Mô tả nội dung</h5>
                <p className="text-justify bg-light p-3 rounded border" style={{ whiteSpace: 'pre-line' }}>{selectedMovie.mo_ta || 'Chưa có mô tả chi tiết cho phim này.'}</p>
                
                {selectedMovie.trailer_url && (
                  <div className="mt-4">
                    <h5 className="fw-bold"> Trailer</h5>
                    <a href={selectedMovie.trailer_url} target="_blank" rel="noreferrer" className="btn btn-outline-danger btn-sm rounded-pill px-3">
                      <i className="bi bi-youtube me-2"></i> Xem Trailer
                    </a>
                  </div>
                )}
              </Col>
            </Row>
          ) : (
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mã phim</Form.Label>
                  <Form.Control type="text" placeholder="M001" isInvalid={!!errors.ma}
                    value={formData.ma} onChange={e => handleChange('ma', e.target.value)} />
                  <Form.Control.Feedback type="invalid">{errors.ma}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên phim</Form.Label>
                  <Form.Control type="text" placeholder="Tên phim..." isInvalid={!!errors.ten}
                    value={formData.ten} onChange={e => handleChange('ten', e.target.value)} />
                  <Form.Control.Feedback type="invalid">{errors.ten}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Thời lượng (phút)</Form.Label>
                  <Form.Control type="number" placeholder="120" isInvalid={!!errors.thoiLuong}
                    value={formData.thoiLuong} onChange={e => handleChange('thoiLuong', Number(e.target.value))} />
                  <Form.Control.Feedback type="invalid">{errors.thoiLuong}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phân loại độ tuổi</Form.Label>
                  <Form.Select 
                    value={formData.phanLoaiDoTuoiId} 
                    onChange={e => handleChange('phanLoaiDoTuoiId', e.target.value)}
                    isInvalid={!!errors.phanLoaiDoTuoiId}>
                    <option value="">Chọn phân loại...</option>
                    {ageRatings.map(item => (
                      <option key={item.id} value={item.id}>{item.ten || item.ma} - {item.moTa || ''}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.phanLoaiDoTuoiId}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ngày công chiếu</Form.Label>
                  <Form.Control type="date" isInvalid={!!errors.ngayCongChieu}
                    value={formData.ngayCongChieu} onChange={e => handleChange('ngayCongChieu', e.target.value)} />
                  <Form.Control.Feedback type="invalid">{errors.ngayCongChieu}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ngày kết thúc</Form.Label>
                  <Form.Control type="date" isInvalid={!!errors.ngayKetThuc}
                    value={formData.ngayKetThuc} onChange={e => handleChange('ngayKetThuc', e.target.value)} />
                  <Form.Control.Feedback type="invalid">{errors.ngayKetThuc}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="mb-1">Thể loại</Form.Label>
                  <Form.Select multiple style={{ height: '100px' }}
                    value={formData.theLoaiIds}
                    onChange={e => handleChange('theLoaiIds', Array.from((e.target as HTMLSelectElement).selectedOptions, option => option.value))}
                  >
                    {genres.map(item => (
                      <option key={item.id} value={item.id}>{item.ten}</option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">Giữ Ctrl (hoặc Cmd) để chọn nhiều</Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="mb-1">Ngôn ngữ</Form.Label>
                  <Form.Select multiple style={{ height: '100px' }}
                    value={formData.ngonNguIds}
                    onChange={e => handleChange('ngonNguIds', Array.from((e.target as HTMLSelectElement).selectedOptions, option => option.value))}
                  >
                    {languages.map(item => (
                      <option key={item.id} value={item.id}>{item.ten}</option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">Giữ Ctrl (hoặc Cmd) để chọn nhiều</Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="mb-1">Đạo diễn</Form.Label>
                  <Form.Select multiple style={{ height: '100px' }}
                    value={formData.daoDienIds}
                    onChange={e => handleChange('daoDienIds', Array.from((e.target as HTMLSelectElement).selectedOptions, option => option.value))}
                  >
                    {directors.map(item => (
                      <option key={item.id} value={item.id}>{item.ten}</option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">Giữ Ctrl (hoặc Cmd) để chọn nhiều</Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="mb-1">Diễn viên</Form.Label>
                  <Form.Select multiple style={{ height: '100px' }}
                    value={formData.dienVienIds}
                    onChange={e => handleChange('dienVienIds', Array.from((e.target as HTMLSelectElement).selectedOptions, option => option.value))}
                  >
                    {actors.map(item => (
                      <option key={item.id} value={item.id}>{item.ten}</option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">Giữ Ctrl (hoặc Cmd) để chọn nhiều</Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Mô tả phim..." isInvalid={!!errors.moTa}
                value={formData.moTa} onChange={e => handleChange('moTa', e.target.value)} />
              <Form.Control.Feedback type="invalid">{errors.moTa}</Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>URL Poster</Form.Label>
                  <Form.Control type="text" placeholder="https://..." isInvalid={!!errors.hinhAnhPoster}
                    value={formData.hinhAnhPoster} onChange={e => handleChange('hinhAnhPoster', e.target.value)} />
                  <Form.Control.Feedback type="invalid">{errors.hinhAnhPoster}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>URL Trailer</Form.Label>
                  <Form.Control type="text" placeholder="https://youtube.com/..." isInvalid={!!errors.trailerUrl}
                    value={formData.trailerUrl} onChange={e => handleChange('trailerUrl', e.target.value)} />
                  <Form.Control.Feedback type="invalid">{errors.trailerUrl}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <div className="form-control bg-light text-muted" style={{ cursor: 'not-allowed' }}>
                <i className="bi bi-info-circle me-2"></i>
                Trạng thái được tính tự động dựa trên ngày công chiếu và ngày kết thúc
              </div>
            </Form.Group>
          </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {modalMode === 'view' ? 'Đóng' : 'Hủy'}
          </Button>
          {modalMode !== 'view' && (
            <Button variant="danger" onClick={handleSaveMovie}>
              {modalMode === 'add' ? 'Thêm phim' : 'Cập nhật'}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminMovies;

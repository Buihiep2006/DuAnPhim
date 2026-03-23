import React, { useState, useEffect } from 'react';
import { 
  Row, Col, Card, Table, Button, Form, InputGroup, 
  Badge, Modal, Pagination 
} from 'react-bootstrap';
// import { movies } from '../../../data/mockData'; // Dòng này bị lỗi vì file không tồn tại hoặc không dùng tới

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
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

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

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0: return <Badge bg="warning">Sắp chiếu</Badge>;
      case 1: return <Badge bg="success">Đang chiếu</Badge>;
      case 2: return <Badge bg="secondary">Đã kết thúc</Badge>;
      default: return <Badge bg="secondary">Không xác định</Badge>;
    }
  };

  const handleAddMovie = () => {
    setModalMode('add');
    setSelectedMovie(null);
    setFormData(initialFormData);
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
    setShowModal(true);
  };

  const handleSaveMovie = async () => {
    const payload = {
      ...formData,
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
        setShowModal(false);
        fetchMovies();
      } else {
        let errorMsg = data.message || 'Không hợp lệ';
        if (data.data && typeof data.data === 'object') {
          errorMsg += '\n' + Object.entries(data.data).map(([k, v]) => `- ${k}: ${v}`).join('\n');
        }
        alert('Lỗi: ' + errorMsg);
      }
    } catch (error) {
      console.error(error);
      alert('Lỗi hệ thống khi lưu phim');
    }
  };

  const handleChange = (field: keyof MovieFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDeleteMovie = async (movieId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phim này?')) {
      try {
        await fetch(`${API_BASE}/phim/${movieId}`, { method: 'DELETE' });
        fetchMovies();
      } catch (error) {
        console.error('Delete movie error:', error);
      }
    }
  };

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = (movie.ten || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (movie.ma || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || movie.trang_thai.toString() === filterStatus;
    return matchesSearch && matchesFilter;
  });

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
                  <h4 className="mb-0 fw-bold">{movies.filter(m => m.trang_thai === 1).length}</h4>
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
                  <h4 className="mb-0 fw-bold">{movies.filter(m => m.trang_thai === 0).length}</h4>
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
                  <h4 className="mb-0 fw-bold">{movies.filter(m => m.trang_thai === 2).length}</h4>
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
              </Form.Select>
            </Col>
            <Col md={3}>
              <Button variant="outline-secondary" className="w-100">
                <i className="bi bi-funnel me-2"></i>
                Lọc nâng cao
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Movies Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th style={{ width: '80px' }}>Mã</th>
                  <th>Phim</th>
                  <th className="text-center">Thời lượng</th>
                  <th>Thể loại</th>
                  <th>Ngày công chiếu</th>
                  <th className="text-center">Phân loại</th>
                  <th className="text-center">Trạng thái</th>
                  <th className="text-center" style={{ width: '150px' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovies.map((movie) => (
                  <tr key={movie.id}>
                    <td>
                      <span className="badge bg-light text-dark border">{movie.ma}</span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <img 
                          src={movie.hinh_anh_poster} 
                          alt={movie.ten}
                          className="rounded me-3"
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
                    <td>
                      {movie.the_loai.slice(0, 2).map((genre, idx) => (
                        <Badge key={idx} bg="light" text="dark" className="me-1">
                          {genre}
                        </Badge>
                      ))}
                      {movie.the_loai.length > 2 && (
                        <Badge bg="light" text="dark">+{movie.the_loai.length - 2}</Badge>
                      )}
                    </td>
                    <td>
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
                    <td className="text-center">
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
              Hiển thị {filteredMovies.length} / {movies.length} phim
            </div>
            <Pagination className="mb-0">
              <Pagination.Prev />
              <Pagination.Item active>{1}</Pagination.Item>
              <Pagination.Item>{2}</Pagination.Item>
              <Pagination.Item>{3}</Pagination.Item>
              <Pagination.Next />
            </Pagination>
          </div>
        </Card.Footer>
      </Card>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'add' ? 'Thêm phim mới' : 'Chỉnh sửa phim'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mã phim</Form.Label>
                  <Form.Control type="text" placeholder="M001" 
                    value={formData.ma} onChange={e => handleChange('ma', e.target.value)} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên phim</Form.Label>
                  <Form.Control type="text" placeholder="Tên phim..." 
                    value={formData.ten} onChange={e => handleChange('ten', e.target.value)} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Thời lượng (phút)</Form.Label>
                  <Form.Control type="number" placeholder="120" 
                    value={formData.thoiLuong} onChange={e => handleChange('thoiLuong', Number(e.target.value))} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phân loại độ tuổi</Form.Label>
                  <Form.Select 
                    value={formData.phanLoaiDoTuoiId} 
                    onChange={e => handleChange('phanLoaiDoTuoiId', e.target.value)}>
                    <option value="">Chọn phân loại...</option>
                    {ageRatings.map(item => (
                      <option key={item.id} value={item.id}>{item.ten || item.ma} - {item.moTa || ''}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ngày công chiếu</Form.Label>
                  <Form.Control type="date" 
                    value={formData.ngayCongChieu} onChange={e => handleChange('ngayCongChieu', e.target.value)} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ngày kết thúc</Form.Label>
                  <Form.Control type="date" 
                    value={formData.ngayKetThuc} onChange={e => handleChange('ngayKetThuc', e.target.value)} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="mb-1">Thể loại</Form.Label>
                  <Form.Select multiple style={{ height: '100px' }}
                    value={formData.theLoaiIds}
                    onChange={e => handleChange('theLoaiIds', Array.from(e.target.selectedOptions, option => option.value))}
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
                    onChange={e => handleChange('ngonNguIds', Array.from(e.target.selectedOptions, option => option.value))}
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
                    onChange={e => handleChange('daoDienIds', Array.from(e.target.selectedOptions, option => option.value))}
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
                    onChange={e => handleChange('dienVienIds', Array.from(e.target.selectedOptions, option => option.value))}
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
              <Form.Control as="textarea" rows={3} placeholder="Mô tả phim..." 
                value={formData.moTa} onChange={e => handleChange('moTa', e.target.value)} />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>URL Poster</Form.Label>
                  <Form.Control type="text" placeholder="https://..." 
                    value={formData.hinhAnhPoster} onChange={e => handleChange('hinhAnhPoster', e.target.value)} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>URL Trailer</Form.Label>
                  <Form.Control type="text" placeholder="https://youtube.com/..." 
                    value={formData.trailerUrl} onChange={e => handleChange('trailerUrl', e.target.value)} />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select value={formData.trangThai} onChange={e => handleChange('trangThai', Number(e.target.value))}>
                <option value={0}>Sắp chiếu</option>
                <option value={1}>Đang chiếu</option>
                <option value={2}>Đã kết thúc</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleSaveMovie}>
            {modalMode === 'add' ? 'Thêm phim' : 'Cập nhật'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminMovies;

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Carousel, Form, Nav } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { PhimWithDetails, TheLoaiPhim, RapChieu } from '../../../types/database.types';

const API = 'http://localhost:9999/api/admin';

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState<PhimWithDetails[]>([]);
  const [genres, setGenres] = useState<TheLoaiPhim[]>([]);
  const [cinemas, setCinemas] = useState<RapChieu[]>([]);
  
  const [filteredMovies, setFilteredMovies] = useState<PhimWithDetails[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedCinema, setSelectedCinema] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>(searchParams.get('tab') || 'showing');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const getPosterUrl = (url?: string | null) => {
    if (!url) return 'https://via.placeholder.com/300x450?text=No+Poster';
    if (url.startsWith('http')) return url;
    // Try to serve from backend if it's a relative path
    return url;
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [phimRes, genreRes, cinemaRes] = await Promise.all([
        fetch(`${API}/phim`),
        fetch(`${API}/the-loai`),
        fetch(`${API}/rap-chieu`)
      ]);

      const [phimJson, genreJson, cinemaJson] = await Promise.all([
        phimRes.json(), genreRes.json(), cinemaRes.json()
      ]);

      if (phimJson.data) {
        const mappedMovies: PhimWithDetails[] = phimJson.data.map((m: any) => ({
          ...m,
          id: m.id,
          ma: m.ma,
          ten: m.ten,
          thoi_luong: m.thoiLuong,
          ngay_cong_chieu: m.ngayCongChieu,
          ngay_ket_thuc: m.ngayKetThuc,
          hinh_anh_poster: m.hinhAnhPoster,
          hinh_anh_banner: m.hinhAnhBanner || m.hinhAnhPoster,
          trailer_url: m.trailerUrl,
          mo_ta: m.moTa,
          trang_thai: m.trangThai,
          phan_loai_do_tuoi: {
            id: m.phanLoaiDoTuoiId || '',
            ma: m.phanLoaiDoTuoi || 'G',
            mo_ta: ''
          },
          the_loai_list: m.theLoaiIds?.map((id: string, index: number) => ({
            id,
            ten: m.theLoai?.[index] || 'N/A'
          })) || []
        }));
        setMovies(mappedMovies);
      }
      
      setGenres(genreJson.data || []);
      setCinemas(cinemaJson.data || []);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterMovies();
  }, [selectedGenre, selectedCinema, activeTab, movies]);

  const filterMovies = () => {
    let filtered = movies.filter(movie => {
      // Filter by status (0: Upcoming, 1: Now Showing)
      // Backend: 1=Showing, 0=Upcoming
      if (activeTab === 'showing' && movie.trang_thai !== 1) return false;
      if (activeTab === 'upcoming' && movie.trang_thai !== 0) return false;

      // Filter by genre
      if (selectedGenre !== 'all') {
        const hasGenre = movie.the_loai_list?.some(g => g.id === selectedGenre);
        if (!hasGenre) return false;
      }

      return true;
    });

    setFilteredMovies(filtered);
  };

  const formatRuntime = (minutes: number | null) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <>
      {/* Hero Carousel */}
      <Carousel className="mb-4">
        {movies.slice(0, 3).map(movie => (
          <Carousel.Item key={movie.id}>
            <div
              style={{
                height: '500px',
                backgroundImage: `url(${getPosterUrl(movie.hinh_anh_banner)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)'
                }}
              />
              <Carousel.Caption style={{ bottom: '50px' }}>
                <h1 className="display-4 fw-bold">{movie.ten}</h1>
                <p className="lead">{movie.mo_ta?.substring(0, 150)}...</p>
                <div className="d-flex gap-2 justify-content-center mt-3">
                  <Link to={`/movies/${movie.id}`}>
                    <Button variant="danger" size="lg">
                      <i className="bi bi-ticket-perforated me-2"></i>
                      Đặt vé ngay
                    </Button>
                  </Link>
                  {movie.trailer_url && (
                    <Button variant="outline-light" size="lg" href={movie.trailer_url} target="_blank">
                      <i className="bi bi-play-circle me-2"></i>
                      Xem trailer
                    </Button>
                  )}
                </div>
              </Carousel.Caption>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      <Container className="py-4">
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        )}
        {/* Tabs & Filters */}
        <div className="bg-light p-3 rounded mb-4">
          <Row className="align-items-center">
            <Col md={4}>
              <Nav variant="pills" activeKey={activeTab}>
                <Nav.Item>
                  <Nav.Link
                    eventKey="showing"
                    onClick={() => {
                      setActiveTab('showing');
                      setSearchParams({ tab: 'showing' });
                    }}
                  >
                    <i className="bi bi-film me-2"></i>
                    Phim đang chiếu
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="upcoming"
                    onClick={() => {
                      setActiveTab('upcoming');
                      setSearchParams({ tab: 'upcoming' });
                    }}
                  >
                    <i className="bi bi-calendar-event me-2"></i>
                    Phim sắp chiếu
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col md={8}>
              <Row>
                <Col md={6}>
                  <Form.Select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                  >
                    <option value="all">Tất cả thể loại</option>
                    {genres.map(genre => (
                      <option key={genre.id} value={genre.id}>
                        {genre.ten}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={6}>
                  <Form.Select
                    value={selectedCinema}
                    onChange={(e) => setSelectedCinema(e.target.value)}
                  >
                    <option value="all">Tất cả rạp</option>
                    {cinemas.map(cinema => (
                      <option key={cinema.id} value={cinema.id}>
                        {cinema.ten}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>

        {/* Movies Grid */}
        <h2 className="mb-4">
          {activeTab === 'showing' ? 'Phim Đang Chiếu' : 'Phim Sắp Chiếu'}
          <Badge bg="danger" className="ms-3">
            {filteredMovies.length} phim
          </Badge>
        </h2>

        {filteredMovies.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-film text-muted" style={{ fontSize: '4rem' }}></i>
            <p className="text-muted mt-3">Không tìm thấy phim phù hợp</p>
          </div>
        ) : (
          <Row className="g-4">
            {filteredMovies.map(movie => (
              <Col key={movie.id} sm={6} md={4} lg={3}>
                <Card className="h-100 movie-card border-0 shadow-sm">
                  <div style={{ position: 'relative' }}>
                    <Card.Img
                      variant="top"
                      src={getPosterUrl(movie.hinh_anh_poster)}
                      alt={movie.ten}
                      style={{ height: '350px', objectFit: 'cover' }}
                    />
                    <Badge
                      bg={movie.trang_thai === 1 ? 'success' : 'warning'}
                      style={{ position: 'absolute', top: 10, right: 10 }}
                    >
                      {movie.trang_thai === 1 ? 'Đang chiếu' : 'Sắp chiếu'}
                    </Badge>
                    {movie.phan_loai_do_tuoi && (
                      <Badge
                        bg="dark"
                        style={{ position: 'absolute', top: 10, left: 10 }}
                      >
                        {movie.phan_loai_do_tuoi.ma}
                      </Badge>
                    )}
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="h6 text-truncate" title={movie.ten}>
                      {movie.ten}
                    </Card.Title>
                    <div className="small text-muted mb-2">
                      {movie.the_loai_list?.map(g => g.ten).join(', ')}
                    </div>
                    <div className="small mb-2">
                      <i className="bi bi-clock me-1"></i>
                      {formatRuntime(movie.thoi_luong)}
                    </div>
                    {movie.diem_danh_gia_trung_binh && movie.diem_danh_gia_trung_binh > 0 && (
                      <div className="mb-2">
                        <i className="bi bi-star-fill text-warning me-1"></i>
                        <span className="fw-bold">{movie.diem_danh_gia_trung_binh}/10</span>
                        <span className="text-muted small ms-1">
                          ({movie.so_luong_danh_gia} đánh giá)
                        </span>
                      </div>
                    )}
                    <div className="mt-auto">
                      <Link to={`/movies/${movie.id || ''}`} className="text-decoration-none">
                        <Button variant="danger" size="sm" className="w-100">
                          {movie.trang_thai === 1 ? 'Đặt vé' : 'Xem chi tiết'}
                        </Button>
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Promotions Section */}
        <div className="mt-5">
          <h3 className="mb-4">
            <i className="bi bi-gift me-2 text-danger"></i>
            Khuyến mãi đặc biệt
          </h3>
          <Row>
            <Col md={4}>
              <Card className="border-danger">
                <Card.Body>
                  <div className="text-danger mb-2">
                    <i className="bi bi-percent" style={{ fontSize: '2rem' }}></i>
                  </div>
                  <Card.Title>Giảm 30% cuối tuần</Card.Title>
                  <Card.Text className="small">
                    Áp dụng cho vé xem phim thứ 7, Chủ nhật. Mã: WEEKEND30
                  </Card.Text>
                  <Button variant="outline-danger" size="sm">
                    Xem chi tiết
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-warning">
                <Card.Body>
                  <div className="text-warning mb-2">
                    <i className="bi bi-star" style={{ fontSize: '2rem' }}></i>
                  </div>
                  <Card.Title>Thành viên vàng</Card.Title>
                  <Card.Text className="small">
                    Ưu đãi 15% cho thành viên hạng vàng. Mã: GOLD15
                  </Card.Text>
                  <Button variant="outline-warning" size="sm">
                    Nâng hạng ngay
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-info">
                <Card.Body>
                  <div className="text-info mb-2">
                    <i className="bi bi-cup-straw" style={{ fontSize: '2rem' }}></i>
                  </div>
                  <Card.Title>Combo ưu đãi</Card.Title>
                  <Card.Text className="small">
                    Mua combo F&B được giảm giá lên đến 25%
                  </Card.Text>
                  <Button variant="outline-info" size="sm">
                    Khám phá ngay
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
}
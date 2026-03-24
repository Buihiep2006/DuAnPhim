import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Card, Nav, Tab, ListGroup, Spinner } from 'react-bootstrap';
import { PhimWithDetails } from '../../../types/database.types';

const API = 'http://localhost:9999/api/admin';

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<PhimWithDetails | null>(null);
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDate, setActiveDate] = useState<string>('');

  const getPosterUrl = (url?: string | null) => {
    if (!url) return 'https://via.placeholder.com/300x450?text=No+Poster';
    if (url.startsWith('http')) return url;
    return url;
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [movieRes, showtimesRes] = await Promise.all([
        fetch(`${API}/phim/${id}`),
        fetch(`${API}/suat-chieu/phim/${id}`)
      ]);

      const [movieJson, showtimesJson] = await Promise.all([
        movieRes.json(),
        showtimesRes.json()
      ]);

      if (movieJson.success && movieJson.data) {
        const m = movieJson.data;
        const mappedMovie: PhimWithDetails = {
          ...m,
          id: m.id,
          ma: m.ma,
          ten: m.ten,
          thoi_luong: m.thoiLuong,
          ngay_cong_chieu: m.ngayCongChieu ? new Date(m.ngayCongChieu) : null,
          ngay_ket_thuc: m.ngayKetThuc ? new Date(m.ngayKetThuc) : null,
          hinh_anh_poster: m.hinhAnhPoster,
          hinh_anh_banner: m.hinhAnhBanner || m.hinhAnhPoster,
          trailer_url: m.trailerUrl,
          mo_ta: m.moTa,
          trang_thai: m.trangThai,
          the_loai_list: m.theLoai?.map((name: string, i: number) => ({ id: m.theLoaiIds?.[i] || i.toString(), ten: name })) || [],
          dao_dien_list: m.daoDien?.map((name: string, i: number) => ({ id: i.toString(), ten: name })) || [],
          dien_vien_list: m.dienVien?.map((name: string, i: number) => ({ id: i.toString(), ten: name })) || [],
          ngon_ngu_list: m.ngonNgu?.map((name: string, i: number) => ({ id: i.toString(), ten: name })) || [],
          phan_loai_do_tuoi: { id: '', ma: m.phanLoaiDoTuoi || 'G', mo_ta: '' }
        };
        setMovie(mappedMovie);
      }

      if (showtimesJson.success && showtimesJson.data) {
        setShowtimes(showtimesJson.data);
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="danger" />
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container className="py-5 text-center">
        <h3>Không tìm thấy phim</h3>
        <Link to="/">
          <Button variant="danger">Về trang chủ</Button>
        </Link>
      </Container>
    );
  }

  // Group showtimes by date
  const showtimesByDate = showtimes.reduce((acc, showtime) => {
    const date = new Date(showtime.thoiGianBatDau).toLocaleDateString('vi-VN');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(showtime);
    return acc;
  }, {} as Record<string, any[]>);

  const dates = Object.keys(showtimesByDate).sort((a, b) => {
    const [d1, m1, y1] = a.split('/').map(Number);
    const [d2, m2, y2] = b.split('/').map(Number);
    return new Date(y1, m1 - 1, d1).getTime() - new Date(y2, m2 - 1, d2).getTime();
  });

  if (!activeDate && dates.length > 0) {
    setActiveDate(dates[0]);
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + 'đ';
  };

  return (
    <div>
      {/* Banner */}
      <div
        style={{
          height: '400px',
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
      </div>

      <Container className="position-relative" style={{ marginTop: '-200px' }}>
        <Row>
          <Col md={3}>
            <Card className="shadow-lg">
              <Card.Img src={getPosterUrl(movie.hinh_anh_poster)} alt={movie.ten} />
            </Card>
          </Col>
          <Col md={9}>
            <div className="text-white mb-4">
              <h1 className="display-5 fw-bold">{movie.ten}</h1>
              <div className="d-flex gap-2 mb-3">
                <Badge bg="dark">{movie.phan_loai_do_tuoi?.ma}</Badge>
                {movie.the_loai_list?.map(g => (
                  <Badge key={g.id} bg="secondary">
                    {g.ten}
                  </Badge>
                ))}
              </div>
              {movie.diem_danh_gia_trung_binh && movie.diem_danh_gia_trung_binh > 0 && (
                <div className="mb-3">
                  <i className="bi bi-star-fill text-warning me-2"></i>
                  <span className="h4">{movie.diem_danh_gia_trung_binh}/10</span>
                  <span className="ms-2 text-light">
                    ({movie.so_luong_danh_gia} đánh giá)
                  </span>
                </div>
              )}
            </div>
          </Col>
        </Row>

        {/* Movie Info */}
        <Card className="mt-4">
          <Card.Body>
            <Tab.Container defaultActiveKey="info">
              <Nav variant="tabs">
                <Nav.Item>
                  <Nav.Link eventKey="info">Thông tin</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="showtimes">Lịch chiếu</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="reviews">Đánh giá</Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content className="p-4">
                <Tab.Pane eventKey="info">
                  <Row>
                    <Col md={8}>
                      <h4>Nội dung phim</h4>
                      <p>{movie.mo_ta}</p>

                      <h5 className="mt-4">Thông tin chi tiết</h5>
                      <ListGroup variant="flush">
                        <ListGroup.Item>
                          <strong>Thời lượng:</strong> {movie.thoi_luong} phút
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <strong>Ngày công chiếu:</strong>{' '}
                          {movie.ngay_cong_chieu?.toLocaleDateString('vi-VN')}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <strong>Đạo diễn:</strong>{' '}
                          {movie.dao_dien_list?.map(d => d.ten).join(', ')}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <strong>Diễn viên:</strong>{' '}
                          {movie.dien_vien_list?.map(d => d.ten).join(', ')}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <strong>Ngôn ngữ:</strong>{' '}
                          {movie.ngon_ngu_list?.map(n => n.ten).join(', ')}
                        </ListGroup.Item>
                      </ListGroup>
                    </Col>
                    <Col md={4}>
                      {movie.trailer_url && (
                        <div>
                          <h5>Trailer</h5>
                          <div className="ratio ratio-16x9">
                            <iframe
                              src={movie.trailer_url?.includes('watch?v=') 
                                ? movie.trailer_url.replace('watch?v=', 'embed/') 
                                : movie.trailer_url || ''}
                              title="Trailer"
                              allowFullScreen
                            ></iframe>
                          </div>
                        </div>
                      )}
                    </Col>
                  </Row>
                </Tab.Pane>

                <Tab.Pane eventKey="showtimes">
                  <h4 className="mb-4">Lịch chiếu</h4>
                  {dates.length === 0 ? (
                    <p className="text-muted">Chưa có lịch chiếu</p>
                  ) : (
                    <>
                      <div className="d-flex gap-2 mb-4 overflow-auto">
                        {dates.map(date => (
                          <Button
                            key={date}
                            variant={activeDate === date ? 'danger' : 'outline-secondary'}
                            onClick={() => setActiveDate(date)}
                          >
                            {date}
                          </Button>
                        ))}
                      </div>

                      {activeDate &&
                        Object.values(showtimesByDate[activeDate]?.reduce((acc: any, showtime: any) => {
                          const cinemaId = showtime.tenRapChieu || 'unknown';
                          if (!acc[cinemaId]) {
                            acc[cinemaId] = {
                              cinema: { ten: showtime.tenRapChieu, dia_chi: showtime.diaChiRapChieu },
                              showtimes: []
                            };
                          }
                          acc[cinemaId].showtimes.push(showtime);
                          return acc;
                        }, {}) || {}).map((group: any) => (
                          <Card key={group.cinema?.ten} className="mb-3">
                            <Card.Header>
                              <h5 className="mb-0">{group.cinema?.ten}</h5>
                              <small className="text-muted">{group.cinema?.dia_chi}</small>
                            </Card.Header>
                            <Card.Body>
                              <div className="d-flex flex-wrap gap-2">
                                {group.showtimes.map((showtime: any) => (
                                  <Link
                                    key={showtime.id}
                                    to={`/seat-selection/${showtime.id}`}
                                    className="text-decoration-none"
                                  >
                                    <Button variant="outline-danger" size="sm">
                                      <div>{formatTime(showtime.thoiGianBatDau)}</div>
                                      <div className="small">
                                        {showtime.tenPhongChieu} - {formatCurrency(showtime.giaVeCoBan)}
                                      </div>
                                    </Button>
                                  </Link>
                                ))}
                              </div>
                            </Card.Body>
                          </Card>
                        ))}
                    </>
                  )}
                </Tab.Pane>

                <Tab.Pane eventKey="reviews">
                  <h4>Đánh giá từ khán giả</h4>
                  <p className="text-muted">Chức năng đánh giá đang được phát triển</p>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
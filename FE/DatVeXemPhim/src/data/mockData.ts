import {
  HangThanhVien,
  NguoiDung,
  VaiTro,
  GioiTinh,
  AuthProvider,
  TheLoaiPhim,
  DienVien,
  DaoDien,
  NgonNgu,
  PhanLoaiDoTuoi,
  Phim,
  PhimWithDetails,
  RapChieu,
  PhongChieu,
  LoaiGhe,
  GheNgoi,
  TrangThaiGhe,
  LoaiDichVu,
  DichVu,
  SuatChieu,
  TrangThaiSuatChieu,
  KhuyenMai,
  CaiDatChung
} from '../types/database.types';

// ==========================================
// MODULE 1: QUẢN LÝ NGƯỜI DÙNG
// ==========================================

export const hangThanhVienData: HangThanhVien[] = [
  {
    id: '1',
    ma: 'BRONZE',
    ten: 'Đồng',
    diem_toi_thieu: 0,
    mo_ta: 'Hạng thành viên đồng - Ưu đãi cơ bản',
    ngay_tao: new Date('2024-01-01')
  },
  {
    id: '2',
    ma: 'SILVER',
    ten: 'Bạc',
    diem_toi_thieu: 500,
    mo_ta: 'Hạng thành viên bạc - Giảm 5% tổng hóa đơn',
    ngay_tao: new Date('2024-01-01')
  },
  {
    id: '3',
    ma: 'GOLD',
    ten: 'Vàng',
    diem_toi_thieu: 1500,
    mo_ta: 'Hạng thành viên vàng - Giảm 10% tổng hóa đơn',
    ngay_tao: new Date('2024-01-01')
  },
  {
    id: '4',
    ma: 'PLATINUM',
    ten: 'Bạch kim',
    diem_toi_thieu: 3000,
    mo_ta: 'Hạng thành viên bạch kim - Giảm 15% + Ưu tiên đặt vé',
    ngay_tao: new Date('2024-01-01')
  }
];

export const nguoiDungData: NguoiDung[] = [
  {
    id: 'user1',
    hang_thanh_vien_id: '3',
    ma: 'KH001',
    ho_ten: 'Nguyễn Văn An',
    email: 'vanan@gmail.com',
    mat_khau: null,
    ngay_sinh: new Date('1995-05-15'),
    gioi_tinh: GioiTinh.NAM,
    so_dien_thoai: '0901234567',
    auth_provider: AuthProvider.LOCAL,
    provider_id: null,
    hinh_anh_dai_dien: null,
    diem_tich_luy: 1800,
    vai_tro: VaiTro.KHACH_HANG,
    trang_thai: 1,
    ngay_tao: new Date('2024-01-15')
  },
  {
    id: 'user2',
    hang_thanh_vien_id: '2',
    ma: 'KH002',
    ho_ten: 'Trần Thị Bình',
    email: 'binhtt@gmail.com',
    mat_khau: null,
    ngay_sinh: new Date('1998-08-20'),
    gioi_tinh: GioiTinh.NU,
    so_dien_thoai: '0912345678',
    auth_provider: AuthProvider.GOOGLE,
    provider_id: 'google123',
    hinh_anh_dai_dien: null,
    diem_tich_luy: 650,
    vai_tro: VaiTro.KHACH_HANG,
    trang_thai: 1,
    ngay_tao: new Date('2024-02-01')
  },
  {
    id: 'admin1',
    hang_thanh_vien_id: null,
    ma: 'ADMIN001',
    ho_ten: 'Admin System',
    email: 'admin@datncinema.vn',
    mat_khau: null,
    ngay_sinh: null,
    gioi_tinh: null,
    so_dien_thoai: '0987654321',
    auth_provider: AuthProvider.LOCAL,
    provider_id: null,
    hinh_anh_dai_dien: null,
    diem_tich_luy: 0,
    vai_tro: VaiTro.ADMIN,
    trang_thai: 1,
    ngay_tao: new Date('2023-01-01')
  }
];

// ==========================================
// MODULE 2: QUẢN LÝ PHIM
// ==========================================

export const theLoaiPhimData: TheLoaiPhim[] = [
  { id: '1', ma: 'ACTION', ten: 'Hành động' },
  { id: '2', ma: 'COMEDY', ten: 'Hài' },
  { id: '3', ma: 'DRAMA', ten: 'Chính kịch' },
  { id: '4', ma: 'HORROR', ten: 'Kinh dị' },
  { id: '5', ma: 'SCIFI', ten: 'Khoa học viễn tưởng' },
  { id: '6', ma: 'ROMANCE', ten: 'Tình cảm' },
  { id: '7', ma: 'THRILLER', ten: 'Ly kỳ' },
  { id: '8', ma: 'ANIMATION', ten: 'Hoạt hình' },
  { id: '9', ma: 'ADVENTURE', ten: 'Phiêu lưu' },
  { id: '10', ma: 'FANTASY', ten: 'Viễn tưởng' }
];

export const dienVienData: DienVien[] = [
  { id: '1', ma: 'DV001', ten: 'Tom Cruise' },
  { id: '2', ma: 'DV002', ten: 'Scarlett Johansson' },
  { id: '3', ma: 'DV003', ten: 'Robert Downey Jr.' },
  { id: '4', ma: 'DV004', ten: 'Margot Robbie' },
  { id: '5', ma: 'DV005', ten: 'Chris Hemsworth' },
  { id: '6', ma: 'DV006', ten: 'Zendaya' },
  { id: '7', ma: 'DV007', ten: 'Timothée Chalamet' },
  { id: '8', ma: 'DV008', ten: 'Florence Pugh' }
];

export const daoDienData: DaoDien[] = [
  { id: '1', ma: 'DD001', ten: 'Christopher Nolan' },
  { id: '2', ma: 'DD002', ten: 'Denis Villeneuve' },
  { id: '3', ma: 'DD003', ten: 'Greta Gerwig' },
  { id: '4', ma: 'DD004', ten: 'Martin Scorsese' },
  { id: '5', ma: 'DD005', ten: 'Quentin Tarantino' }
];

export const ngonNguData: NgonNgu[] = [
  { id: '1', ma: 'VI', ten: 'Tiếng Việt (Phụ đề)' },
  { id: '2', ma: 'EN', ten: 'Tiếng Anh' },
  { id: '3', ma: 'VI_DUB', ten: 'Tiếng Việt (Lồng tiếng)' },
  { id: '4', ma: 'KR', ten: 'Tiếng Hàn (Phụ đề)' }
];

export const phanLoaiDoTuoiData: PhanLoaiDoTuoi[] = [
  { id: '1', ma: 'P', mo_ta: 'Phim dành cho mọi lứa tuổi' },
  { id: '2', ma: 'K', mo_ta: 'Phim dành cho khán giả dưới 13 tuổi với sự đồng ý của phụ huynh' },
  { id: '3', ma: 'T13', mo_ta: 'Phim dành cho khán giả từ 13 tuổi trở lên' },
  { id: '4', ma: 'T16', mo_ta: 'Phim dành cho khán giả từ 16 tuổi trở lên' },
  { id: '5', ma: 'T18', mo_ta: 'Phim dành cho khán giả từ 18 tuổi trở lên' },
  { id: '6', ma: 'C', mo_ta: 'Phim cấm chiếu' }
];

export const phimData: PhimWithDetails[] = [
  {
    id: 'movie1',
    phan_loai_do_tuoi_id: '3',
    ma: 'DUNE2',
    ten: 'Dune: Part Two',
    thoi_luong: 166,
    ngay_cong_chieu: new Date('2024-03-01'),
    ngay_ket_thuc: new Date('2024-05-01'),
    hinh_anh_poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    hinh_anh_banner: 'https://image.tmdb.org/t/p/original/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
    trailer_url: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    mo_ta: 'Paul Atreides hợp sức cùng Chani và người Fremen để báo thù những kẻ đã phá hủy gia đình mình. Phải đối mặt với sự lựa chọn giữa tình yêu của cuộc đời và số phận của vũ trụ.',
    trang_thai: 1,
    ngay_tao: new Date('2024-02-01'),
    phan_loai_do_tuoi: phanLoaiDoTuoiData[2],
    the_loai_list: [theLoaiPhimData[4], theLoaiPhimData[8], theLoaiPhimData[2]],
    dien_vien_list: [dienVienData[5], dienVienData[6]],
    dao_dien_list: [daoDienData[1]],
    ngon_ngu_list: [ngonNguData[0], ngonNguData[1]],
    diem_danh_gia_trung_binh: 8.5,
    so_luong_danh_gia: 1245
  },
  {
    id: 'movie2',
    phan_loai_do_tuoi_id: '3',
    ma: 'BARBIE',
    ten: 'Barbie',
    thoi_luong: 114,
    ngay_cong_chieu: new Date('2024-02-15'),
    ngay_ket_thuc: new Date('2024-04-30'),
    hinh_anh_poster: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
    hinh_anh_banner: 'https://image.tmdb.org/t/p/original/ctMserH8g2SeOAnCw5gFjdQF8mo.jpg',
    trailer_url: 'https://www.youtube.com/watch?v=pBk4NYhWNMM',
    mo_ta: 'Barbie và Ken sống một cuộc sống hoàn hảo ở Barbie Land. Khi họ có cơ hội đến thế giới thực, họ sẽ khám phá ra niềm vui và nguy hiểm của việc sống giữa con người.',
    trang_thai: 1,
    ngay_tao: new Date('2024-01-15'),
    phan_loai_do_tuoi: phanLoaiDoTuoiData[2],
    the_loai_list: [theLoaiPhimData[1], theLoaiPhimData[8], theLoaiPhimData[9]],
    dien_vien_list: [dienVienData[3]],
    dao_dien_list: [daoDienData[2]],
    ngon_ngu_list: [ngonNguData[0], ngonNguData[1]],
    diem_danh_gia_trung_binh: 7.8,
    so_luong_danh_gia: 2156
  },
  {
    id: 'movie3',
    phan_loai_do_tuoi_id: '4',
    ma: 'OPPENHEIMER',
    ten: 'Oppenheimer',
    thoi_luong: 180,
    ngay_cong_chieu: new Date('2024-03-10'),
    ngay_ket_thuc: new Date('2024-05-15'),
    hinh_anh_poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    hinh_anh_banner: 'https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    trailer_url: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
    mo_ta: 'Câu chuyện về nhà vật lý lý thuyết J. Robert Oppenheimer và vai trò của ông trong việc phát triển bom nguyên tử.',
    trang_thai: 1,
    ngay_tao: new Date('2024-02-20'),
    phan_loai_do_tuoi: phanLoaiDoTuoiData[3],
    the_loai_list: [theLoaiPhimData[2], theLoaiPhimData[6]],
    dien_vien_list: [dienVienData[7]],
    dao_dien_list: [daoDienData[0]],
    ngon_ngu_list: [ngonNguData[0], ngonNguData[1]],
    diem_danh_gia_trung_binh: 8.9,
    so_luong_danh_gia: 3421
  },
  {
    id: 'movie4',
    phan_loai_do_tuoi_id: '2',
    ma: 'KUNGFU4',
    ten: 'Kung Fu Panda 4',
    thoi_luong: 94,
    ngay_cong_chieu: new Date('2024-04-01'),
    ngay_ket_thuc: null,
    hinh_anh_poster: 'https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg',
    hinh_anh_banner: 'https://image.tmdb.org/t/p/original/pwGmXVKUgKN13psUjlhC9zBcq1o.jpg',
    trailer_url: 'https://www.youtube.com/watch?v=_inKs4eeHiI',
    mo_ta: 'Po phải huấn luyện một chiến binh mới để tiếp quản vai trò Chiến binh Rồng của mình. Khi đó, một phù thủy đen tối lên kế hoạch triệu hồi lại tất cả các nhân vật phản diện mà Po đã đánh bại.',
    trang_thai: 0,
    ngay_tao: new Date('2024-03-01'),
    phan_loai_do_tuoi: phanLoaiDoTuoiData[1],
    the_loai_list: [theLoaiPhimData[7], theLoaiPhimData[1], theLoaiPhimData[8]],
    dien_vien_list: [],
    dao_dien_list: [],
    ngon_ngu_list: [ngonNguData[2], ngonNguData[1]],
    diem_danh_gia_trung_binh: 0,
    so_luong_danh_gia: 0
  },
  {
    id: 'movie5',
    phan_loai_do_tuoi_id: '4',
    ma: 'CIVILWAR',
    ten: 'Civil War',
    thoi_luong: 109,
    ngay_cong_chieu: new Date('2024-04-12'),
    ngay_ket_thuc: null,
    hinh_anh_poster: 'https://image.tmdb.org/t/p/w500/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg',
    hinh_anh_banner: 'https://image.tmdb.org/t/p/original/z121dSTR7PY9KxKuvwiIFSYW8cf.jpg',
    trailer_url: 'https://www.youtube.com/watch?v=aDyQxtg0V2w',
    mo_ta: 'Trong tương lai gần, một nhóm phóng viên chiến trường đang cố gắng sinh tồn trong cuộc nội chiến ở Mỹ.',
    trang_thai: 0,
    ngay_tao: new Date('2024-03-15'),
    phan_loai_do_tuoi: phanLoaiDoTuoiData[3],
    the_loai_list: [theLoaiPhimData[0], theLoaiPhimData[6], theLoaiPhimData[2]],
    dien_vien_list: [dienVienData[4]],
    dao_dien_list: [],
    ngon_ngu_list: [ngonNguData[0], ngonNguData[1]],
    diem_danh_gia_trung_binh: 0,
    so_luong_danh_gia: 0
  }
];

// ==========================================
// MODULE 3: RẠP & PHÒNG CHIẾU
// ==========================================

export const rapChieuData: RapChieu[] = [
  {
    id: 'rap1',
    ma: 'CGV_HN',
    ten: 'CGV Vincom Bà Triệu',
    dia_chi: '191 Bà Triệu, Hai Bà Trưng, Hà Nội',
    khu_vuc: 'Hà Nội',
    mo_ta: 'Rạp chiếu phim hiện đại với 8 phòng chiếu',
    trang_thai: 1
  },
  {
    id: 'rap2',
    ma: 'CGV_HCM',
    ten: 'CGV Sài Gòn Center',
    dia_chi: '65 Lê Lợi, Quận 1, TP.HCM',
    khu_vuc: 'TP. Hồ Chí Minh',
    mo_ta: 'Rạp chiếu phim cao cấp với 10 phòng chiếu',
    trang_thai: 1
  },
  {
    id: 'rap3',
    ma: 'LOTTE_HN',
    ten: 'Lotte Cinema Landmark 72',
    dia_chi: 'Landmark 72, Phạm Hùng, Nam Từ Liêm, Hà Nội',
    khu_vuc: 'Hà Nội',
    mo_ta: 'Rạp chiếu phim với công nghệ IMAX và 4DX',
    trang_thai: 1
  }
];

export const phongChieuData: PhongChieu[] = [
  { id: 'room1', rap_chieu_id: 'rap1', ma: 'P01', ten: 'Phòng 1', suc_chua: 120, loai_may_chieu: '2D', trang_thai: 1 },
  { id: 'room2', rap_chieu_id: 'rap1', ma: 'P02', ten: 'Phòng 2', suc_chua: 150, loai_may_chieu: '3D', trang_thai: 1 },
  { id: 'room3', rap_chieu_id: 'rap1', ma: 'P03', ten: 'Phòng 3 - IMAX', suc_chua: 200, loai_may_chieu: 'IMAX', trang_thai: 1 },
  { id: 'room4', rap_chieu_id: 'rap2', ma: 'P01', ten: 'Phòng 1', suc_chua: 130, loai_may_chieu: '2D', trang_thai: 1 },
  { id: 'room5', rap_chieu_id: 'rap2', ma: 'P02', ten: 'Phòng 2 - 4DX', suc_chua: 100, loai_may_chieu: '4DX', trang_thai: 1 },
  { id: 'room6', rap_chieu_id: 'rap3', ma: 'P01', ten: 'Phòng 1', suc_chua: 140, loai_may_chieu: '2D', trang_thai: 1 }
];

export const loaiGheData: LoaiGhe[] = [
  { id: 'seat-type-1', ma: 'STANDARD', ten: 'Ghế thường', phu_thu: 0 },
  { id: 'seat-type-2', ma: 'VIP', ten: 'Ghế VIP', phu_thu: 30000 },
  { id: 'seat-type-3', ma: 'COUPLE', ten: 'Ghế đôi', phu_thu: 50000 }
];

// Generate seats for a room
function generateSeats(phongId: string, rows: string[], seatsPerRow: number): GheNgoi[] {
  const seats: GheNgoi[] = [];
  rows.forEach((row, rowIndex) => {
    for (let i = 1; i <= seatsPerRow; i++) {
      let loaiGheId = 'seat-type-1'; // Standard
      if (rowIndex >= rows.length - 2) {
        loaiGheId = 'seat-type-2'; // VIP (last 2 rows)
      }
      if (row === 'L' && i % 2 === 1) {
        loaiGheId = 'seat-type-3'; // Couple seats in row L
      }

      seats.push({
        id: `seat-${phongId}-${row}${i}`,
        phong_chieu_id: phongId,
        loai_ghe_id: loaiGheId,
        ma_ghe: `${row}${i}`,
        hang_ghe: row,
        so_thu_tu: i,
        trang_thai: TrangThaiGhe.AVAILABLE
      });
    }
  });
  return seats;
}

export const gheNgoiData: GheNgoi[] = [
  ...generateSeats('room1', ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'], 12),
  ...generateSeats('room2', ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'], 14),
  ...generateSeats('room3', ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'], 16)
];

// ==========================================
// MODULE 4: DỊCH VỤ F&B
// ==========================================

export const loaiDichVuData: LoaiDichVu[] = [
  { id: 'service-type-1', ma: 'COMBO', ten: 'Combo' },
  { id: 'service-type-2', ma: 'POPCORN', ten: 'Bỏng ngô' },
  { id: 'service-type-3', ma: 'DRINK', ten: 'Nước uống' },
  { id: 'service-type-4', ma: 'SNACK', ten: 'Snack' }
];

export const dichVuData: DichVu[] = [
  {
    id: 'service1',
    loai_dich_vu_id: 'service-type-1',
    ma: 'COMBO1',
    ten: 'Combo 1 - Bỏng ngô + Nước ngọt',
    gia_ban: 75000,
    hinh_anh: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=300',
    mo_ta: '1 bắp rang bơ size L + 1 nước ngọt size L',
    trang_thai: 1
  },
  {
    id: 'service2',
    loai_dich_vu_id: 'service-type-1',
    ma: 'COMBO2',
    ten: 'Combo 2 - Couple',
    gia_ban: 140000,
    hinh_anh: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=300',
    mo_ta: '2 bắp rang bơ size L + 2 nước ngọt size L',
    trang_thai: 1
  },
  {
    id: 'service3',
    loai_dich_vu_id: 'service-type-1',
    ma: 'COMBO3',
    ten: 'Combo 3 - Family',
    gia_ban: 250000,
    hinh_anh: 'https://images.unsplash.com/photo-1615887023516-a4e0c4d6b9a2?w=300',
    mo_ta: '3 bắp rang bơ size L + 3 nước ngọt size L + 1 snack',
    trang_thai: 1
  },
  {
    id: 'service4',
    loai_dich_vu_id: 'service-type-2',
    ma: 'POPCORN_M',
    ten: 'Bỏng ngô size M',
    gia_ban: 40000,
    hinh_anh: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=300',
    mo_ta: 'Bắp rang bơ thơm ngon',
    trang_thai: 1
  },
  {
    id: 'service5',
    loai_dich_vu_id: 'service-type-2',
    ma: 'POPCORN_L',
    ten: 'Bỏng ngô size L',
    gia_ban: 50000,
    hinh_anh: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=300',
    mo_ta: 'Bắp rang bơ thơm ngon',
    trang_thai: 1
  },
  {
    id: 'service6',
    loai_dich_vu_id: 'service-type-3',
    ma: 'PEPSI_M',
    ten: 'Pepsi size M',
    gia_ban: 30000,
    hinh_anh: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300',
    mo_ta: 'Nước ngọt Pepsi',
    trang_thai: 1
  },
  {
    id: 'service7',
    loai_dich_vu_id: 'service-type-3',
    ma: 'PEPSI_L',
    ten: 'Pepsi size L',
    gia_ban: 40000,
    hinh_anh: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300',
    mo_ta: 'Nước ngọt Pepsi',
    trang_thai: 1
  },
  {
    id: 'service8',
    loai_dich_vu_id: 'service-type-4',
    ma: 'NACHOS',
    ten: 'Nachos phô mai',
    gia_ban: 45000,
    hinh_anh: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=300',
    mo_ta: 'Nachos giòn với sốt phô mai',
    trang_thai: 1
  }
];

// ==========================================
// MODULE 5: LỊCH CHIẾU
// ==========================================

function createShowtimes(): SuatChieu[] {
  const showtimes: SuatChieu[] = [];
  const today = new Date();
  const timeSlots = ['09:00', '11:30', '14:00', '16:30', '19:00', '21:30'];

  // Generate showtimes for next 7 days
  for (let day = 0; day < 7; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() + day);

    phimData.slice(0, 3).forEach((movie, movieIndex) => {
      phongChieuData.slice(0, 3).forEach((room, roomIndex) => {
        timeSlots.forEach((time, slotIndex) => {
          const [hours, minutes] = time.split(':').map(Number);
          const startTime = new Date(date);
          startTime.setHours(hours, minutes, 0, 0);

          const endTime = new Date(startTime);
          endTime.setMinutes(endTime.getMinutes() + (movie.thoi_luong || 120) + 15);

          let giaVe = 80000;
          if (room.loai_may_chieu === 'IMAX') giaVe = 150000;
          else if (room.loai_may_chieu === '4DX') giaVe = 180000;
          else if (room.loai_may_chieu === '3D') giaVe = 100000;

          showtimes.push({
            id: `showtime-${day}-${movieIndex}-${roomIndex}-${slotIndex}`,
            phim_id: movie.id,
            phong_chieu_id: room.id,
            ma: `SC${day}${movieIndex}${roomIndex}${slotIndex}`,
            thoi_gian_bat_dau: startTime,
            thoi_gian_ket_thuc: endTime,
            gia_ve_co_ban: giaVe,
            trang_thai: TrangThaiSuatChieu.SCHEDULED,
            ngay_tao: new Date()
          });
        });
      });
    });
  }

  return showtimes;
}

export const suatChieuData: SuatChieu[] = createShowtimes();

// ==========================================
// MODULE 6: ĐẶT VÉ & KHUYẾN MÃI
// ==========================================

export const khuyenMaiData: KhuyenMai[] = [
  {
    id: 'promo1',
    hang_thanh_vien_id: null,
    ma_code: 'WELCOME2024',
    ten: 'Chào mừng thành viên mới',
    phan_tram_giam: 20,
    giam_toi_da: 50000,
    so_luong: 100,
    thoi_gian_bat_dau: new Date('2024-01-01'),
    thoi_gian_ket_thuc: new Date('2024-12-31'),
    mo_ta: 'Giảm 20% cho thành viên mới, tối đa 50k',
    trang_thai: 1
  },
  {
    id: 'promo2',
    hang_thanh_vien_id: '3',
    ma_code: 'GOLD15',
    ten: 'Ưu đãi thành viên vàng',
    phan_tram_giam: 15,
    giam_toi_da: 100000,
    so_luong: 50,
    thoi_gian_bat_dau: new Date('2024-01-01'),
    thoi_gian_ket_thuc: new Date('2024-12-31'),
    mo_ta: 'Giảm 15% cho thành viên hạng vàng',
    trang_thai: 1
  },
  {
    id: 'promo3',
    hang_thanh_vien_id: null,
    ma_code: 'WEEKEND30',
    ten: 'Khuyến mãi cuối tuần',
    phan_tram_giam: 30,
    giam_toi_da: 80000,
    so_luong: 200,
    thoi_gian_bat_dau: new Date('2024-03-01'),
    thoi_gian_ket_thuc: new Date('2024-03-31'),
    mo_ta: 'Giảm 30% cho vé xem phim cuối tuần',
    trang_thai: 1
  }
];

// ==========================================
// MODULE 7: CÀI ĐẶT HỆ THỐNG
// ==========================================

export const caiDatChungData: CaiDatChung = {
  id: 'setting1',
  thoi_gian_giu_ghe: 10,
  thoi_gian_nghi_suat_chieu: 15,
  gio_mo_cua: '08:00:00',
  gio_dong_cua: '23:30:00',
  gia_ve_co_ban_mac_dinh: 80000,
  ty_le_tich_diem: 5
};

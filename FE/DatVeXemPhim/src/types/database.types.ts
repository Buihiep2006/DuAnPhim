// ==========================================
// DATABASE TYPES - DatnMovieTicketing
// ==========================================

// ==========================================
// MODULE 1: QUẢN LÝ NGƯỜI DÙNG
// ==========================================

export interface HangThanhVien {
  id: string;
  ma: string | null;
  ten: string | null;
  diem_toi_thieu: number;
  mo_ta: string | null;
  ngay_tao: Date;
}

export enum VaiTro {
  KHACH_HANG = 'KHACH_HANG',
  QUAN_LY = 'QUAN_LY',
  NHAN_VIEN = 'NHAN_VIEN',
  ADMIN = 'ADMIN'
}

export enum GioiTinh {
  NAM = 0,
  NU = 1,
  KHAC = 2
}

export enum AuthProvider {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK'
}

export interface NguoiDung {
  id: string;
  hang_thanh_vien_id: string | null;
  ma: string | null;
  ho_ten: string;
  email: string;
  mat_khau: string | null;
  ngay_sinh: Date | null;
  gioi_tinh: GioiTinh | null;
  so_dien_thoai: string | null;
  auth_provider: AuthProvider;
  provider_id: string | null;
  hinh_anh_dai_dien: string | null;
  diem_tich_luy: number;
  vai_tro: VaiTro;
  trang_thai: number; // 0: Inactive, 1: Active
  ngay_tao: Date;
}

export interface QuenMatKhau {
  id: string;
  nguoi_dung_id: string;
  ma_token: string;
  thoi_gian_het_han: Date;
}

// ==========================================
// MODULE 2: QUẢN LÝ PHIM
// ==========================================

export interface TheLoaiPhim {
  id: string;
  ma: string | null;
  ten: string | null;
}

export interface DienVien {
  id: string;
  ma: string | null;
  ten: string | null;
}

export interface DaoDien {
  id: string;
  ma: string | null;
  ten: string | null;
}

export interface NgonNgu {
  id: string;
  ma: string | null;
  ten: string | null;
}

export interface PhanLoaiDoTuoi {
  id: string;
  ma: string | null; // P, K, T13, T16, T18, C
  mo_ta: string | null;
}

export interface Phim {
  id: string;
  phan_loai_do_tuoi_id: string | null;
  ma: string | null;
  ten: string;
  thoi_luong: number | null; // minutes
  ngay_cong_chieu: Date | null;
  ngay_ket_thuc: Date | null;
  hinh_anh_poster: string | null;
  hinh_anh_banner: string | null;
  trailer_url: string | null;
  mo_ta: string | null;
  trang_thai: number; // 0: Upcoming, 1: Now Showing, 2: Ended
  ngay_tao: Date;
}

export interface PhimDaoDien {
  phim_id: string;
  dao_dien_id: string;
}

export interface PhimNgonNgu {
  phim_id: string;
  ngon_ngu_id: string;
}

export interface PhimTheLoai {
  phim_id: string;
  the_loai_id: string;
}

export interface PhimDienVien {
  phim_id: string;
  dien_vien_id: string;
}

export interface DanhGiaPhim {
  id: string;
  phim_id: string;
  nguoi_dung_id: string;
  diem_so: number; // 1-10
  binh_luan: string | null;
  ngay_tao: Date;
}

// ==========================================
// MODULE 3: RẠP & PHÒNG CHIẾU
// ==========================================

export interface RapChieu {
  id: string;
  ma: string | null;
  ten: string;
  dia_chi: string | null;
  khu_vuc: string | null;
  mo_ta: string | null;
  trang_thai: number; // 0: Inactive, 1: Active
}

export interface PhongChieu {
  id: string;
  rap_chieu_id: string;
  ma: string | null;
  ten: string;
  suc_chua: number;
  loai_may_chieu: string | null; // 2D, 3D, IMAX, 4DX
  trang_thai: number; // 0: Inactive, 1: Active
}

export interface LoaiGhe {
  id: string;
  ma: string | null;
  ten: string; // VIP, Standard, Couple
  phu_thu: number; // Additional price
}

export enum TrangThaiGhe {
  AVAILABLE = 1,
  BROKEN = 0
}

export interface GheNgoi {
  id: string;
  phong_chieu_id: string;
  loai_ghe_id: string;
  ma_ghe: string; // A1, A2, B1, etc.
  hang_ghe: string; // A, B, C, D, etc.
  so_thu_tu: number; // 1, 2, 3, etc.
  trang_thai: TrangThaiGhe;
}

// ==========================================
// MODULE 4: DỊCH VỤ F&B
// ==========================================

export interface LoaiDichVu {
  id: string;
  ma: string | null;
  ten: string; // Combo, Drink, Snack, Popcorn
}

export interface DichVu {
  id: string;
  loai_dich_vu_id: string;
  ma: string | null;
  ten: string;
  gia_ban: number;
  hinh_anh: string | null;
  mo_ta: string | null;
  trang_thai: number; // 0: Unavailable, 1: Available
}

// ==========================================
// MODULE 5: LỊCH CHIẾU
// ==========================================

export enum TrangThaiSuatChieu {
  SCHEDULED = 1,
  SHOWING = 2,
  ENDED = 3,
  CANCELLED = 0
}

export interface SuatChieu {
  id: string;
  phim_id: string;
  phong_chieu_id: string;
  ma: string | null;
  thoi_gian_bat_dau: Date;
  thoi_gian_ket_thuc: Date;
  gia_ve_co_ban: number;
  trang_thai: TrangThaiSuatChieu;
  ngay_tao: Date;
}

// ==========================================
// MODULE 6: ĐẶT VÉ & THANH TOÁN
// ==========================================

export interface KhuyenMai {
  id: string;
  hang_thanh_vien_id: string | null; // null = apply to all
  ma_code: string;
  ten: string;
  phan_tram_giam: number; // 0-100
  giam_toi_da: number;
  so_luong: number; // Quantity available
  thoi_gian_bat_dau: Date;
  thoi_gian_ket_thuc: Date;
  mo_ta: string | null;
  trang_thai: number; // 0: Inactive, 1: Active
}

export enum TrangThaiHoaDon {
  PENDING = 0, // Chờ thanh toán
  RESERVED = 1, // Đã giữ ghế (chưa thanh toán)
  PAID = 2, // Đã thanh toán
  CANCELLED = 3, // Đã hủy
  EXPIRED = 4 // Hết hạn giữ ghế
}

export interface HoaDon {
  id: string;
  nguoi_dung_id: string;
  khuyen_mai_id: string | null;
  ma_hoa_don: string;
  tong_tien_ban_dau: number;
  so_tien_giam: number;
  tong_tien_thanh_toan: number;
  diem_thuong_su_dung: number;
  diem_thuong_nhan_duoc: number;
  thoi_gian_tao: Date;
  thoi_gian_het_han_giu_ghe: Date | null;
  trang_thai: TrangThaiHoaDon;
}

export enum PhuongThucThanhToan {
  CASH = 'CASH',
  VNPAY = 'VNPAY',
  MOMO = 'MOMO',
  ZALOPAY = 'ZALOPAY',
  BANKING = 'BANKING'
}

export enum TrangThaiGiaoDich {
  PENDING = 0,
  SUCCESS = 1,
  FAILED = 2,
  REFUNDED = 3
}

export interface GiaoDichThanhToan {
  id: string;
  hoa_don_id: string;
  phuong_thuc: PhuongThucThanhToan;
  ma_giao_dich_ben_thu_3: string | null;
  so_tien_giao_dich: number;
  thoi_gian_giao_dich: Date;
  trang_thai: TrangThaiGiaoDich;
}

export enum TrangThaiVe {
  PENDING = 0, // Chưa thanh toán
  BOOKED = 1, // Đã đặt (đã thanh toán)
  CHECKED_IN = 2, // Đã check-in
  CANCELLED = 3, // Đã hủy
  USED = 4 // Đã sử dụng
}

export interface VeBan {
  id: string;
  suat_chieu_id: string;
  ghe_ngoi_id: string;
  ma_ve: string | null; // QR Code
  gia_ve_thuc_te: number; // Base price + surcharge
  thoi_gian_check_in: Date | null;
  trang_thai: TrangThaiVe;
}

export interface ChiTietHoaDonVe {
  id: string;
  hoa_don_id: string;
  ve_ban_id: string;
  thanh_tien: number;
}

export interface ChiTietHoaDonDichVu {
  id: string;
  hoa_don_id: string;
  dich_vu_id: string;
  so_luong: number;
  don_gia: number;
  thanh_tien: number;
}

// ==========================================
// MODULE 7: HỆ THỐNG
// ==========================================

export interface CaiDatChung {
  id: string;
  thoi_gian_giu_ghe: number; // minutes
  thoi_gian_nghi_suat_chieu: number; // minutes between shows
  gio_mo_cua: string; // Time format: HH:mm:ss
  gio_dong_cua: string; // Time format: HH:mm:ss
  gia_ve_co_ban_mac_dinh: number;
  ty_le_tich_diem: number; // percentage
}

// ==========================================
// VIEW MODELS & DTOs (for API & UI)
// ==========================================

export interface PhimWithDetails extends Phim {
  phan_loai_do_tuoi?: PhanLoaiDoTuoi;
  the_loai_list?: TheLoaiPhim[];
  dien_vien_list?: DienVien[];
  dao_dien_list?: DaoDien[];
  ngon_ngu_list?: NgonNgu[];
  rap_chieu_list?: { id: string }[];
  diem_danh_gia_trung_binh?: number;
  so_luong_danh_gia?: number;
}

export interface SuatChieuWithDetails extends SuatChieu {
  phim?: Phim;
  phong_chieu?: PhongChieu;
  rap_chieu?: RapChieu;
  so_ghe_trong?: number;
  so_ghe_da_ban?: number;
}

export interface HoaDonWithDetails extends HoaDon {
  nguoi_dung?: NguoiDung;
  khuyen_mai?: KhuyenMai;
  ve_list?: VeBan[];
  dich_vu_list?: ChiTietHoaDonDichVu[];
  giao_dich?: GiaoDichThanhToan;
}

export interface GheNgoiWithDetails extends GheNgoi {
  loai_ghe?: LoaiGhe;
  trang_thai_dat?: 'available' | 'selected' | 'sold' | 'reserved';
}

export interface CartItem {
  type: 'ticket' | 'service';
  id: string;
  name: string;
  price: number;
  quantity: number;
  details?: any;
}

export interface BookingState {
  suat_chieu_id: string | null;
  selected_seats: string[];
  selected_services: { id: string; quantity: number }[];
  khuyen_mai_code: string | null;
  diem_thuong_su_dung: number;
  tong_tien: number;
}

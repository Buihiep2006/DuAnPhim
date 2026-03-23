// Mock data for the movie ticketing system

export interface Movie {
  id: number;
  ten_phim: string;
  ten_goc: string;
  poster_url: string;
  trailer_url: string;
  mo_ta: string;
  dao_dien: string;
  dien_vien: string;
  the_loai: string;
  ngon_ngu: string;
  thoi_luong: number;
  ngay_khoi_chieu: string;
  phan_loai_do_tuoi: string;
  trang_thai: number; // 1: Đang chiếu, 2: Sắp chiếu
  danh_gia_tb: number;
}

export interface Cinema {
  id: number;
  ten_rap: string;
  dia_chi: string;
  khu_vuc: string;
  so_dien_thoai: string;
}

export interface Showtime {
  id: number;
  phim_id: number;
  rap_id: number;
  phong_chieu_id: number;
  ngay_chieu: string;
  gio_bat_dau: string;
  gia_ve_co_ban: number;
}

export interface Seat {
  id: number;
  hang: string;
  so_ghe: number;
  loai_ghe: string; // 'thuong' | 'vip'
  phu_thu: number;
  trang_thai: 'available' | 'selected' | 'sold';
}

export interface Review {
  id: number;
  phim_id: number;
  nguoi_dung: string;
  diem_so: number;
  noi_dung: string;
  ngay_danh_gia: string;
}

export interface Service {
  id: number;
  ten_dich_vu: string;
  mo_ta: string;
  don_gia: number;
  hinh_anh_url: string;
  loai: 'bap' | 'nuoc' | 'combo';
}

export interface Promotion {
  id: number;
  ma_khuyen_mai: string;
  ten_khuyen_mai: string;
  loai_giam_gia: 'percent' | 'fixed';
  gia_tri_giam: number;
  giam_toi_da: number;
  so_luong_con_lai: number;
  ngay_bat_dau: string;
  ngay_ket_thuc: string;
}

export interface MemberTier {
  id: number;
  ten_hang: string;
  diem_toi_thieu: number;
  he_so_tich_diem: number;
  mau_sac: string;
}

export const movies: Movie[] = [
  {
    id: 1,
    ten_phim: "Avatar: The Way of Water",
    ten_goc: "Avatar: The Way of Water",
    poster_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400",
    trailer_url: "https://www.youtube.com/watch?v=d9MyW72ELq0",
    mo_ta: "Jake Sully sống cùng gia đình mới của mình trên hành tinh Pandora. Khi một mối đe dọa quen thuộc quay trở lại, Jake phải hợp tác với Neytiri và quân đội của chủng tộc Na'vi để bảo vệ hành tinh của họ.",
    dao_dien: "James Cameron",
    dien_vien: "Sam Worthington, Zoe Saldana, Sigourney Weaver",
    the_loai: "Hành động, Phiêu lưu, Khoa học viễn tưởng",
    ngon_ngu: "Tiếng Anh - Phụ đề Tiếng Việt",
    thoi_luong: 192,
    ngay_khoi_chieu: "2024-12-16",
    phan_loai_do_tuoi: "T13",
    trang_thai: 1,
    danh_gia_tb: 4.5,
  },
  {
    id: 2,
    ten_phim: "The Batman",
    ten_goc: "The Batman",
    poster_url: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400",
    trailer_url: "https://www.youtube.com/watch?v=mqqft2x_Aa4",
    mo_ta: "Khi kẻ giết người hàng loạt nhắm vào những nhân vật chính trị ưu tú ở Gotham, Batman buộc phải điều tra những mối liên hệ ẩn giấu của thành phố và tìm ra thủ phạm.",
    dao_dien: "Matt Reeves",
    dien_vien: "Robert Pattinson, Zoë Kravitz, Paul Dano",
    the_loai: "Hành động, Tội phạm, Bí ẩn",
    ngon_ngu: "Tiếng Anh - Phụ đề Tiếng Việt",
    thoi_luong: 176,
    ngay_khoi_chieu: "2024-03-04",
    phan_loai_do_tuoi: "T16",
    trang_thai: 1,
    danh_gia_tb: 4.7,
  },
  {
    id: 3,
    ten_phim: "Doraemon: Nobita và Vùng Đất Lý Tưởng",
    ten_goc: "Doraemon: Nobita's Sky Utopia",
    poster_url: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400",
    trailer_url: "https://www.youtube.com/watch?v=example",
    mo_ta: "Doraemon và nhóm bạn khám phá một vùng đất lý tưởng trên bầu trời, nơi mọi ước mơ đều trở thành hiện thực.",
    dao_dien: "Takumi Doyama",
    dien_vien: "Wasabi Mizuta, Megumi Ohara",
    the_loai: "Hoạt hình, Phiêu lưu, Gia đình",
    ngon_ngu: "Lồng tiếng Tiếng Việt",
    thoi_luong: 108,
    ngay_khoi_chieu: "2024-03-01",
    phan_loai_do_tuoi: "P",
    trang_thai: 1,
    danh_gia_tb: 4.3,
  },
  {
    id: 4,
    ten_phim: "Oppenheimer",
    ten_goc: "Oppenheimer",
    poster_url: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400",
    trailer_url: "https://www.youtube.com/watch?v=example",
    mo_ta: "Câu chuyện về J. Robert Oppenheimer, nhà vật lý lý thuyết người Mỹ, người đã đóng vai trò then chốt trong dự án Manhattan phát triển bom nguyên tử.",
    dao_dien: "Christopher Nolan",
    dien_vien: "Cillian Murphy, Emily Blunt, Robert Downey Jr.",
    the_loai: "Tiểu sử, Lịch sử, Chính kịch",
    ngon_ngu: "Tiếng Anh - Phụ đề Tiếng Việt",
    thoi_luong: 180,
    ngay_khoi_chieu: "2024-04-15",
    phan_loai_do_tuoi: "T16",
    trang_thai: 2,
    danh_gia_tb: 0,
  },
  {
    id: 5,
    ten_phim: "Kung Fu Panda 4",
    ten_goc: "Kung Fu Panda 4",
    poster_url: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?w=400",
    trailer_url: "https://www.youtube.com/watch?v=example",
    mo_ta: "Po phải đào tạo một chiến binh mới khi anh được kêu gọi trở thành nhà lãnh đạo tinh thần của Thung lũng Bình Yên.",
    dao_dien: "Mike Mitchell",
    dien_vien: "Jack Black, Awkwafina, Viola Davis",
    the_loai: "Hoạt hình, Hài, Phiêu lưu",
    ngon_ngu: "Lồng tiếng Tiếng Việt",
    thoi_luong: 94,
    ngay_khoi_chieu: "2024-04-20",
    phan_loai_do_tuoi: "P",
    trang_thai: 2,
    danh_gia_tb: 0,
  },
  {
    id: 6,
    ten_phim: "John Wick: Chapter 4",
    ten_goc: "John Wick: Chapter 4",
    poster_url: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400",
    trailer_url: "https://www.youtube.com/watch?v=example",
    mo_ta: "John Wick khám phá con đường để đánh bại High Table. Nhưng trước khi có thể giành được tự do, Wick phải đối mặt với kẻ thù mới với liên minh mạnh mẽ.",
    dao_dien: "Chad Stahelski",
    dien_vien: "Keanu Reeves, Donnie Yen, Bill Skarsgård",
    the_loai: "Hành động, Tội phạm",
    ngon_ngu: "Tiếng Anh - Phụ đề Tiếng Việt",
    thoi_luong: 169,
    ngay_khoi_chieu: "2024-03-24",
    phan_loai_do_tuoi: "T18",
    trang_thai: 1,
    danh_gia_tb: 4.8,
  },
];

export const cinemas: Cinema[] = [
  {
    id: 1,
    ten_rap: "CGV Vincom Center",
    dia_chi: "72 Lê Thánh Tôn, Q.1, TP.HCM",
    khu_vuc: "TP. Hồ Chí Minh",
    so_dien_thoai: "1900 6017",
  },
  {
    id: 2,
    ten_rap: "Galaxy Nguyễn Du",
    dia_chi: "116 Nguyễn Du, Q.1, TP.HCM",
    khu_vuc: "TP. Hồ Chí Minh",
    so_dien_thoai: "1900 2224",
  },
  {
    id: 3,
    ten_rap: "Lotte Cinema Cộng Hòa",
    dia_chi: "180 Cộng Hòa, Q. Tân Bình, TP.HCM",
    khu_vuc: "TP. Hồ Chí Minh",
    so_dien_thoai: "1900 5454",
  },
  {
    id: 4,
    ten_rap: "CGV Vincom Bà Triệu",
    dia_chi: "191 Bà Triệu, Q. Hai Bà Trưng, Hà Nội",
    khu_vuc: "Hà Nội",
    so_dien_thoai: "1900 6017",
  },
];

export const showtimes: Showtime[] = [
  { id: 1, phim_id: 1, rap_id: 1, phong_chieu_id: 1, ngay_chieu: "2026-03-15", gio_bat_dau: "10:00", gia_ve_co_ban: 75000 },
  { id: 2, phim_id: 1, rap_id: 1, phong_chieu_id: 2, ngay_chieu: "2026-03-15", gio_bat_dau: "13:30", gia_ve_co_ban: 85000 },
  { id: 3, phim_id: 1, rap_id: 1, phong_chieu_id: 1, ngay_chieu: "2026-03-15", gio_bat_dau: "17:00", gia_ve_co_ban: 95000 },
  { id: 4, phim_id: 1, rap_id: 2, phong_chieu_id: 3, ngay_chieu: "2026-03-15", gio_bat_dau: "14:00", gia_ve_co_ban: 80000 },
  { id: 5, phim_id: 2, rap_id: 1, phong_chieu_id: 2, ngay_chieu: "2026-03-15", gio_bat_dau: "11:00", gia_ve_co_ban: 75000 },
  { id: 6, phim_id: 2, rap_id: 2, phong_chieu_id: 3, ngay_chieu: "2026-03-15", gio_bat_dau: "15:30", gia_ve_co_ban: 85000 },
  { id: 7, phim_id: 3, rap_id: 3, phong_chieu_id: 4, ngay_chieu: "2026-03-15", gio_bat_dau: "09:00", gia_ve_co_ban: 60000 },
  { id: 8, phim_id: 6, rap_id: 2, phong_chieu_id: 3, ngay_chieu: "2026-03-15", gio_bat_dau: "20:00", gia_ve_co_ban: 100000 },
];

export const reviews: Review[] = [
  {
    id: 1,
    phim_id: 1,
    nguoi_dung: "Nguyễn Văn A",
    diem_so: 5,
    noi_dung: "Phim tuyệt vời! Hiệu ứng hình ảnh đẹp mắt, cốt truyện hấp dẫn. Đáng xem!",
    ngay_danh_gia: "2026-03-10",
  },
  {
    id: 2,
    phim_id: 1,
    nguoi_dung: "Trần Thị B",
    diem_so: 4,
    noi_dung: "Phim hay nhưng hơi dài. Nhìn chung vẫn rất đáng để xem.",
    ngay_danh_gia: "2026-03-12",
  },
  {
    id: 3,
    phim_id: 2,
    nguoi_dung: "Lê Văn C",
    diem_so: 5,
    noi_dung: "Robert Pattinson thể hiện xuất sắc vai Batman. Phim đen tối và hấp dẫn.",
    ngay_danh_gia: "2026-03-08",
  },
];

export const services: Service[] = [
  {
    id: 1,
    ten_dich_vu: "Bắp Rang Bơ (L)",
    mo_ta: "Bắp rang bơ size lớn",
    don_gia: 50000,
    hinh_anh_url: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=200",
    loai: 'bap',
  },
  {
    id: 2,
    ten_dich_vu: "Coca Cola (L)",
    mo_ta: "Nước ngọt Coca Cola size lớn",
    don_gia: 35000,
    hinh_anh_url: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=200",
    loai: 'nuoc',
  },
  {
    id: 3,
    ten_dich_vu: "Combo 1 Người",
    mo_ta: "1 Bắp (L) + 1 Nước (L)",
    don_gia: 75000,
    hinh_anh_url: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=200",
    loai: 'combo',
  },
  {
    id: 4,
    ten_dich_vu: "Combo Đôi",
    mo_ta: "2 Bắp (L) + 2 Nước (L)",
    don_gia: 140000,
    hinh_anh_url: "https://images.unsplash.com/photo-1585238341710-4c1b36e3b1e2?w=200",
    loai: 'combo',
  },
];

export const promotions: Promotion[] = [
  {
    id: 1,
    ma_khuyen_mai: "WELCOME2026",
    ten_khuyen_mai: "Giảm 20% cho thành viên mới",
    loai_giam_gia: 'percent',
    gia_tri_giam: 20,
    giam_toi_da: 50000,
    so_luong_con_lai: 100,
    ngay_bat_dau: "2026-03-01",
    ngay_ket_thuc: "2026-03-31",
  },
  {
    id: 2,
    ma_khuyen_mai: "CINEMA50K",
    ten_khuyen_mai: "Giảm 50K cho hóa đơn từ 200K",
    loai_giam_gia: 'fixed',
    gia_tri_giam: 50000,
    giam_toi_da: 50000,
    so_luong_con_lai: 50,
    ngay_bat_dau: "2026-03-10",
    ngay_ket_thuc: "2026-03-20",
  },
];

export const memberTiers: MemberTier[] = [
  { id: 1, ten_hang: "Bronze", diem_toi_thieu: 0, he_so_tich_diem: 1, mau_sac: "#CD7F32" },
  { id: 2, ten_hang: "Silver", diem_toi_thieu: 500, he_so_tich_diem: 1.2, mau_sac: "#C0C0C0" },
  { id: 3, ten_hang: "Gold", diem_toi_thieu: 1000, he_so_tich_diem: 1.5, mau_sac: "#FFD700" },
  { id: 4, ten_hang: "Platinum", diem_toi_thieu: 2000, he_so_tich_diem: 2, mau_sac: "#E5E4E2" },
];

export function generateSeats(roomType: 'small' | 'medium' | 'large' = 'medium'): Seat[] {
  const seats: Seat[] = [];
  const rows = roomType === 'small' ? 6 : roomType === 'medium' ? 8 : 10;
  const seatsPerRow = roomType === 'small' ? 10 : roomType === 'medium' ? 12 : 14;
  const vipRows = roomType === 'small' ? 2 : 3;

  let id = 1;
  for (let i = 0; i < rows; i++) {
    const hang = String.fromCharCode(65 + i); // A, B, C, ...
    const isVipRow = i >= rows - vipRows;

    for (let j = 1; j <= seatsPerRow; j++) {
      const isRandomSold = Math.random() < 0.2; // 20% ghế đã bán
      seats.push({
        id: id++,
        hang,
        so_ghe: j,
        loai_ghe: isVipRow ? 'vip' : 'thuong',
        phu_thu: isVipRow ? 20000 : 0,
        trang_thai: isRandomSold ? 'sold' : 'available',
      });
    }
  }

  return seats;
}

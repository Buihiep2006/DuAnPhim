USE master;
GO

IF EXISTS (SELECT name FROM master.sys.databases WHERE name = N'DatnMovieTicketing')
BEGIN
    ALTER DATABASE [DatnMovieTicketing] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE [DatnMovieTicketing];
END
GO

CREATE DATABASE [DatnMovieTicketing];
GO

USE [DatnMovieTicketing];
GO

-- ==========================================
-- MODULE 1: QUẢN LÝ NGƯỜI DÙNG
-- ==========================================

CREATE TABLE [hang_thanh_vien] (
  [id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  [ma] VARCHAR(50) NULL,
  [ten] NVARCHAR(100) NULL,
  [diem_toi_thieu] INT DEFAULT 0,
  [mo_ta] NVARCHAR(255) NULL,
  [ngay_tao] DATETIME DEFAULT GETDATE()
);

CREATE TABLE [nguoi_dung] (
  [id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  [hang_thanh_vien_id] UNIQUEIDENTIFIER NULL,
  [ma] VARCHAR(50) NULL,
  [ho_ten] NVARCHAR(100) NOT NULL,
  [email] VARCHAR(255) NOT NULL,
  [mat_khau] VARCHAR(255) NULL, 
  [ngay_sinh] DATE NULL,
  [gioi_tinh] INT NULL, 
  [so_dien_thoai] VARCHAR(20) NULL,
  [auth_provider] VARCHAR(50) DEFAULT 'LOCAL', 
  [provider_id] VARCHAR(255) NULL, 
  [hinh_anh_dai_dien] VARCHAR(500) NULL,
  [diem_tich_luy] INT DEFAULT 0,
  [vai_tro] VARCHAR(50) NOT NULL DEFAULT 'KHACH_HANG', 
  [trang_thai] INT DEFAULT 1, 
  [ngay_tao] DATETIME DEFAULT GETDATE(),
  CONSTRAINT [uq_nguoi_dung_email] UNIQUE ([email]),
  CONSTRAINT [fk_nguoi_dung_hang] FOREIGN KEY ([hang_thanh_vien_id]) REFERENCES [hang_thanh_vien] ([id])
);

CREATE TABLE [quen_mat_khau] (
  [id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  [nguoi_dung_id] UNIQUEIDENTIFIER NOT NULL,
  [ma_token] VARCHAR(255) NOT NULL,
  [thoi_gian_het_han] DATETIME NOT NULL,
  CONSTRAINT [uq_quen_mat_khau_token] UNIQUE ([ma_token]),
  CONSTRAINT [fk_quen_mat_khau_nguoi_dung] FOREIGN KEY ([nguoi_dung_id]) REFERENCES [nguoi_dung] ([id]) ON DELETE CASCADE
);

-- ==========================================
-- MODULE 2: QUẢN LÝ PHIM
-- ==========================================

CREATE TABLE [the_loai_phim] (
  [id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  [ma] VARCHAR(50) NULL,
  [ten] NVARCHAR(100) NULL
);

CREATE TABLE [dien_vien] (
  [id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  [ma] VARCHAR(50) NULL,
  [ten] NVARCHAR(100) NULL
);

CREATE TABLE [dao_dien] (
  [id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  [ma] VARCHAR(50) NULL,
  [ten] NVARCHAR(100) NULL
);

CREATE TABLE [ngon_ngu] (
  [id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  [ma] VARCHAR(50) NULL,
  [ten] NVARCHAR(100) NULL 
);

CREATE TABLE [phan_loai_do_tuoi] (
  [id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  [ma] VARCHAR(20) NULL, 
  [mo_ta] NVARCHAR(255) NULL
);

CREATE TABLE [phim] (
  [id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  [phan_loai_do_tuoi_id] UNIQUEIDENTIFIER NULL,
  [ma] VARCHAR(50) NULL,
  [ten] NVARCHAR(100) NOT NULL,
  [thoi_luong] INT NULL, 
  [ngay_cong_chieu] DATETIME NULL,
  [ngay_ket_thuc] DATETIME NULL,
  [hinh_anh_poster] VARCHAR(500) NULL,
  [hinh_anh_banner] VARCHAR(500) NULL,
  [trailer_url] VARCHAR(500) NULL,
  [mo_ta] NVARCHAR(MAX) NULL, -- Giữ MAX cho tóm tắt phim
  [trang_thai] INT DEFAULT 1, 
  [ngay_tao] DATETIME DEFAULT GETDATE(),
  CONSTRAINT [fk_phim_phan_loai] FOREIGN KEY ([phan_loai_do_tuoi_id]) REFERENCES [phan_loai_do_tuoi] ([id])
);

CREATE TABLE [phim_dao_dien] (
  [phim_id] UNIQUEIDENTIFIER NOT NULL,
  [dao_dien_id] UNIQUEIDENTIFIER NOT NULL,
  PRIMARY KEY ([phim_id], [dao_dien_id]),
  CONSTRAINT [fk_pdd_phim] FOREIGN KEY ([phim_id]) REFERENCES [phim] ([id]) ON DELETE CASCADE,
  CONSTRAINT [fk_pdd_dao_dien] FOREIGN KEY ([dao_dien_id]) REFERENCES [dao_dien] ([id]) ON DELETE CASCADE
);

CREATE TABLE [phim_ngon_ngu] (
  [phim_id] UNIQUEIDENTIFIER NOT NULL,
  [ngon_ngu_id] UNIQUEIDENTIFIER NOT NULL,
  PRIMARY KEY ([phim_id], [ngon_ngu_id]),
  CONSTRAINT [fk_pnn_phim] FOREIGN KEY ([phim_id]) REFERENCES [phim] ([id]) ON DELETE CASCADE,
  CONSTRAINT [fk_pnn_ngon_ngu] FOREIGN KEY ([ngon_ngu_id]) REFERENCES [ngon_ngu] ([id]) ON DELETE CASCADE
);

CREATE TABLE [phim_the_loai] (
  [phim_id] UNIQUEIDENTIFIER NOT NULL,
  [the_loai_id] UNIQUEIDENTIFIER NOT NULL,
  PRIMARY KEY ([phim_id], [the_loai_id]),
  CONSTRAINT [fk_ptl_phim] FOREIGN KEY ([phim_id]) REFERENCES [phim] ([id]) ON DELETE CASCADE,
  CONSTRAINT [fk_ptl_the_loai] FOREIGN KEY ([the_loai_id]) REFERENCES [the_loai_phim] ([id]) ON DELETE CASCADE
);

CREATE TABLE [phim_dien_vien] (
  [phim_id] UNIQUEIDENTIFIER NOT NULL,
  [dien_vien_id] UNIQUEIDENTIFIER NOT NULL,
  PRIMARY KEY ([phim_id], [dien_vien_id]),
  CONSTRAINT [fk_pdv_phim] FOREIGN KEY ([phim_id]) REFERENCES [phim] ([id]) ON DELETE CASCADE,
  CONSTRAINT [fk_pdv_dien_vien] FOREIGN KEY ([dien_vien_id]) REFERENCES [dien_vien] ([id]) ON DELETE CASCADE
);

CREATE TABLE [danh_gia_phim] (
  [id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  [phim_id] UNIQUEIDENTIFIER NOT NULL,
  [nguoi_dung_id] UNIQUEIDENTIFIER NOT NULL,
  [diem_so] INT NOT NULL, 
  [binh_luan] NVARCHAR(255) NULL, -- Đánh giá ngắn dùng 255
  [ngay_tao] DATETIME DEFAULT GETDATE(),
  CONSTRAINT [fk_danhgia_phim] FOREIGN KEY ([phim_id]) REFERENCES [phim] ([id]) ON DELETE CASCADE,
  CONSTRAINT [fk_danhgia_nguoidung] FOREIGN KEY ([nguoi_dung_id]) REFERENCES [nguoi_dung] ([id]) ON DELETE CASCADE
);

-- ==========================================
-- MODULE 3: RẠP & PHÒNG CHIẾU
-- ==========================================

CREATE TABLE [rap_chieu] (
  [id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  [ma] VARCHAR(50) NULL,
  [ten] NVARCHAR(100) NOT NULL,
  [dia_chi] NVARCHAR(255) NULL,
  [khu_vuc] NVARCHAR(100) NULL,
  [mo_ta] NVARCHAR(255) NULL,
  [trang_thai] INT DEFAULT 1 
);

CREATE TABLE [phong_chieu] (
  [id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  [rap_chieu_id] UNIQUEIDENTIFIER NOT NULL,
  [ma] VARCHAR(50) NULL,
  [ten] NVARCHAR(100) NOT NULL,
  [suc_chua] INT DEFAULT 0,
  [loai_may_chieu] NVARCHAR(100) NULL,
  [trang_thai] INT DEFAULT 1, 
  CONSTRAINT [fk_phong_rap] FOREIGN KEY ([rap_chieu_id]) REFERENCES [rap_chieu] ([id]) ON DELETE CASCADE
);

CREATE TABLE [loai_ghe] (
  [id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  [ma] VARCHAR(50) NULL,
  [ten] NVARCHAR(100) NOT NULL, 
  [phu_thu] DECIMAL(38,2) DEFAULT 0 
);

CREATE TABLE [ghe_ngoi] (
  [id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  [phong_chieu_id] UNIQUEIDENTIFIER NOT NULL,
  [loai_ghe_id] UNIQUEIDENTIFIER NOT NULL,
  [ma_ghe] VARCHAR(20) NOT NULL, 
  [hang_ghe] VARCHAR(10) NOT NULL, 
  [so_thu_tu] INT NOT NULL, 
  [trang_thai] INT DEFAULT 1, 
  CONSTRAINT [fk_ghe_phong] FOREIGN KEY ([phong_chieu_id]) REFERENCES [phong_chieu] ([id]) ON DELETE CASCADE,
  CONSTRAINT [fk_ghe_loai] FOREIGN KEY ([loai_ghe_id]) REFERENCES [loai_ghe] ([id])
);

-- ==========================================
-- MODULE 4: DỊCH VỤ F&B
-- ==========================================

CREATE TABLE [loai_dich_vu] (
  [id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  [ma] VARCHAR(50) NULL,
  [ten] NVARCHAR(100) NOT NULL
);

CREATE TABLE [dich_vu] (
  [id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  [loai_dich_vu_id] UNIQUEIDENTIFIER NOT NULL,
  [ma] VARCHAR(50) NULL,
  [ten] NVARCHAR(100) NOT NULL,
  [gia_ban] DECIMAL(38,2) NOT NULL,
  [hinh_anh] VARCHAR(500) NULL,
  [mo_ta] NVARCHAR(255) NULL,
  [trang_thai] INT DEFAULT 1, 
  CONSTRAINT [fk_dich_vu_loai] FOREIGN KEY ([loai_dich_vu_id]) REFERENCES [loai_dich_vu] ([id])
);

-- ==========================================
-- MODULE 5: LỊCH CHIẾU
-- ==========================================

CREATE TABLE [suat_chieu] (
  [id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  [phim_id] UNIQUEIDENTIFIER NOT NULL,
  [phong_chieu_id] UNIQUEIDENTIFIER NOT NULL,
  [ma] VARCHAR(50) NULL,
  [thoi_gian_bat_dau] DATETIME NOT NULL,
  [thoi_gian_ket_thuc] DATETIME NOT NULL,
  [gia_ve_co_ban] DECIMAL(38,2) NOT NULL,
  [trang_thai] INT DEFAULT 1, 
  [ngay_tao] DATETIME DEFAULT GETDATE(),
  CONSTRAINT [fk_suat_chieu_phim] FOREIGN KEY ([phim_id]) REFERENCES [phim] ([id]),
  CONSTRAINT [fk_suat_chieu_phong] FOREIGN KEY ([phong_chieu_id]) REFERENCES [phong_chieu] ([id])
);

-- ==========================================
-- MODULE 6: ĐẶT VÉ & THANH TOÁN
-- ==========================================

CREATE TABLE [khuyen_mai] (
  [id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  [hang_thanh_vien_id] UNIQUEIDENTIFIER NULL,
  [ma_code] VARCHAR(50) NOT NULL,
  [ten] NVARCHAR(100) NOT NULL,
  [phan_tram_giam] INT DEFAULT 0,
  [giam_toi_da] DECIMAL(38,2) DEFAULT 0, 
  [so_luong] INT DEFAULT 0, 
  [thoi_gian_bat_dau] DATETIME NOT NULL,
  [thoi_gian_ket_thuc] DATETIME NOT NULL,
  [mo_ta] NVARCHAR(255) NULL,
  [trang_thai] INT DEFAULT 1, 
  CONSTRAINT [uq_khuyen_mai_code] UNIQUE ([ma_code]),
  CONSTRAINT [fk_km_hang] FOREIGN KEY ([hang_thanh_vien_id]) REFERENCES [hang_thanh_vien] ([id])
);

CREATE TABLE [hoa_don] (
  [id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  [nguoi_dung_id] UNIQUEIDENTIFIER NOT NULL,
  [khuyen_mai_id] UNIQUEIDENTIFIER NULL,
  [ma_hoa_don] VARCHAR(100) NOT NULL,
  [tong_tien_ban_dau] DECIMAL(38,2) NOT NULL DEFAULT 0,
  [so_tien_giam] DECIMAL(38,2) NOT NULL DEFAULT 0,
  [tong_tien_thanh_toan] DECIMAL(38,2) NOT NULL,
  [diem_thuong_su_dung] INT DEFAULT 0,
  [diem_thuong_nhan_duoc] INT DEFAULT 0,
  [thoi_gian_tao] DATETIME DEFAULT GETDATE(),
  [thoi_gian_het_han_giu_ghe] DATETIME NULL,
  [trang_thai] INT DEFAULT 0, 
  CONSTRAINT [uq_hoa_don_ma] UNIQUE ([ma_hoa_don]),
  CONSTRAINT [fk_hd_nguoi_dung] FOREIGN KEY ([nguoi_dung_id]) REFERENCES [nguoi_dung] ([id]),
  CONSTRAINT [fk_hd_khuyen_mai] FOREIGN KEY ([khuyen_mai_id]) REFERENCES [khuyen_mai] ([id])
);

CREATE TABLE [giao_dich_thanh_toan] (
  [id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  [hoa_don_id] UNIQUEIDENTIFIER NOT NULL,
  [phuong_thuc] VARCHAR(50) NOT NULL, 
  [ma_giao_dich_ben_thu_3] VARCHAR(255) NULL,
  [so_tien_giao_dich] DECIMAL(38,2) NOT NULL,
  [thoi_gian_giao_dich] DATETIME DEFAULT GETDATE(),
  [trang_thai] INT NOT NULL, 
  CONSTRAINT [fk_giao_dich_hoa_don] FOREIGN KEY ([hoa_don_id]) REFERENCES [hoa_don] ([id]) ON DELETE CASCADE
);

CREATE TABLE [ve_ban] (
  [id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  [suat_chieu_id] UNIQUEIDENTIFIER NOT NULL,
  [ghe_ngoi_id] UNIQUEIDENTIFIER NOT NULL,
  [ma_ve] VARCHAR(50) NULL,
  [gia_ve_thuc_te] DECIMAL(38,2) NOT NULL, 
  [thoi_gian_check_in] DATETIME NULL, 
  [trang_thai] INT DEFAULT 0, 
  CONSTRAINT [fk_ve_suat_chieu] FOREIGN KEY ([suat_chieu_id]) REFERENCES [suat_chieu] ([id]),
  CONSTRAINT [fk_ve_ghe] FOREIGN KEY ([ghe_ngoi_id]) REFERENCES [ghe_ngoi] ([id])
);

CREATE TABLE [chi_tiet_hoa_don_ve] (
  [id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  [hoa_don_id] UNIQUEIDENTIFIER NOT NULL,
  [ve_ban_id] UNIQUEIDENTIFIER NOT NULL,
  [thanh_tien] DECIMAL(38,2) NOT NULL,
  CONSTRAINT [fk_ctv_hoa_don] FOREIGN KEY ([hoa_don_id]) REFERENCES [hoa_don] ([id]) ON DELETE CASCADE,
  CONSTRAINT [fk_ctv_ve] FOREIGN KEY ([ve_ban_id]) REFERENCES [ve_ban] ([id])
);

CREATE TABLE [chi_tiet_hoa_don_dich_vu] (
  [id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  [hoa_don_id] UNIQUEIDENTIFIER NOT NULL,
  [dich_vu_id] UNIQUEIDENTIFIER NOT NULL,
  [so_luong] INT NOT NULL DEFAULT 1,
  [don_gia] DECIMAL(38,2) NOT NULL,
  [thanh_tien] DECIMAL(38,2) NOT NULL,
  CONSTRAINT [fk_ctdv_hoa_don] FOREIGN KEY ([hoa_don_id]) REFERENCES [hoa_don] ([id]) ON DELETE CASCADE,
  CONSTRAINT [fk_ctdv_dich_vu] FOREIGN KEY ([dich_vu_id]) REFERENCES [dich_vu] ([id])
);

-- ==========================================
-- MODULE 7: HỆ THỐNG
-- ==========================================

CREATE TABLE [cai_dat_chung] (
  [id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  [thoi_gian_giu_ghe] INT DEFAULT 10, 
  [thoi_gian_nghi_suat_chieu] INT DEFAULT 15, 
  [gio_mo_cua] TIME DEFAULT '08:00:00',
  [gio_dong_cua] TIME DEFAULT '23:30:00',
  [gia_ve_co_ban_mac_dinh] DECIMAL(38,2) DEFAULT 60000,
  [ty_le_tich_diem] INT DEFAULT 5 
);
package com.example.datvexemphim.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "hoa_don")
public class HoaDon {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @ColumnDefault("newsequentialid()")
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "khach_hang_id")
    private UUID khachHangId;

    @Column(name = "nhan_vien_id")
    private UUID nhanVienId;

    @Column(name = "khuyen_mai_id")
    private UUID khuyenMaiId;

    @Column(name = "ma_hoa_don")
    private String maHoaDon;

    @Column(name = "tong_tien_ban_dau")
    private BigDecimal tongTienBanDau;

    @Column(name = "so_tien_giam")
    private BigDecimal soTienGiam;

    @Column(name = "tong_tien_thanh_toan")
    private BigDecimal tongTienThanhToan;

    @Column(name = "diem_thuong_su_dung")
    private Integer diemThuongSuDung;

    @Column(name = "diem_thuong_nhan_duoc")
    private Integer diemThuongNhanDuoc;

    @Column(name = "thoi_gian_tao")
    private LocalDateTime thoiGianTao;

    @Column(name = "thoi_gian_het_han_giu_ghe")
    private LocalDateTime thoiGianHetHanGiuGhe;

    @Column(name = "trang_thai")
    private Integer trangThai;

}

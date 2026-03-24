package com.example.datvexemphim.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.math.BigDecimal;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "chinh_sach_gia")
public class ChinhSachGia {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @ColumnDefault("newsequentialid()")
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "ma")
    private String ma;

    @Column(name = "ten_chinh_sach")
    private String tenChinhSach;

    @Column(name = "ngay_trong_tuan")
    private Integer ngayTrongTuan;

    @Column(name = "khung_gio_bat_dau")
    private LocalTime khungGioBatDau;

    @Column(name = "khung_gio_ket_thuc")
    private LocalTime khungGioKetThuc;

    @Column(name = "phan_tram_dieu_chinh")
    private BigDecimal phanTramDieuChinh;

    @Column(name = "phu_thu_co_dinh")
    private BigDecimal phuThuCoDinh;

    @Column(name = "uu_tien")
    private Integer uuTien;

    @Column(name = "trang_thai")
    private Integer trangThai;

    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao;

}

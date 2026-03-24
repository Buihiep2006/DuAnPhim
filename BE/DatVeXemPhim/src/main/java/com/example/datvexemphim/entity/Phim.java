package com.example.datvexemphim.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;
import java.time.LocalDateTime;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "phim")
public class Phim {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @ColumnDefault("newsequentialid()")
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "phan_loai_do_tuoi_id")
    private UUID phanLoaiDoTuoiId;

    @Column(name = "ma")
    private String ma;

    @Column(name = "ten")
    private String ten;

    @Column(name = "thoi_luong")
    private Integer thoiLuong;

    @Column(name = "ngay_cong_chieu")
    private LocalDateTime ngayCongChieu;

    @Column(name = "ngay_ket_thuc")
    private LocalDateTime ngayKetThuc;

    @Column(name = "hinh_anh_poster")
    private String hinhAnhPoster;

    @Column(name = "hinh_anh_banner")
    private String hinhAnhBanner;

    @Column(name = "trailer_url")
    private String trailerUrl;

    @Column(name = "mo_ta")
    private String moTa;

    @Column(name = "metadata")
    private String metadata;

    @Column(name = "trang_thai")
    private Integer trangThai;

    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao;

}

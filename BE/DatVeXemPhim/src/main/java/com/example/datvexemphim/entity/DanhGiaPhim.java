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
@Table(name = "danh_gia_phim")
public class DanhGiaPhim {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @ColumnDefault("newsequentialid()")
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "phim_id")
    private UUID phimId;

    @Column(name = "khach_hang_id")
    private UUID khachHangId;

    @Column(name = "diem_so")
    private Integer diemSo;

    @Column(name = "binh_luan")
    private String binhLuan;

    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao;

}

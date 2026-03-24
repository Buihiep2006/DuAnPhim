package com.example.datvexemphim.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;
import java.time.LocalTime;
import java.math.BigDecimal;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "cai_dat_chung")
public class CaiDatChung {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @ColumnDefault("newsequentialid()")
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "thoi_gian_giu_ghe")
    private Integer thoiGianGiuGhe;

    @Column(name = "thoi_gian_nghi_suat_chieu")
    private Integer thoiGianNghiSuatChieu;

    @Column(name = "gio_mo_cua")
    private LocalTime gioMoCua;

    @Column(name = "gio_dong_cua")
    private LocalTime gioDongCua;

    @Column(name = "gia_ve_co_ban_mac_dinh")
    private BigDecimal giaVeCoBanMacDinh;

    @Column(name = "ty_le_tich_diem")
    private Integer tyLeTichDiem;

}

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
@Table(name = "ve_ban")
public class VeBan {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @ColumnDefault("newsequentialid()")
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "suat_chieu_id")
    private UUID suatChieuId;

    @Column(name = "ghe_ngoi_id")
    private UUID gheNgoiId;

    @Column(name = "ma_ve")
    private String maVe;

    @Column(name = "gia_ve_thuc_te")
    private BigDecimal giaVeThucTe;

    @Column(name = "thoi_gian_check_in")
    private LocalDateTime thoiGianCheckIn;

    @Column(name = "trang_thai")
    private Integer trangThai;

}

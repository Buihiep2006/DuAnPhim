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
@Table(name = "giao_dich_thanh_toan")
public class GiaoDichThanhToan {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @ColumnDefault("newsequentialid()")
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "hoa_don_id")
    private UUID hoaDonId;

    @Column(name = "phuong_thuc")
    private String phuongThuc;

    @Column(name = "ma_giao_dich_ben_thu_3")
    private String maGiaoDichBenThu3;

    @Column(name = "so_tien_giao_dich")
    private BigDecimal soTienGiaoDich;

    @Column(name = "thoi_gian_giao_dich")
    private LocalDateTime thoiGianGiaoDich;

    @Column(name = "trang_thai")
    private Integer trangThai;

}

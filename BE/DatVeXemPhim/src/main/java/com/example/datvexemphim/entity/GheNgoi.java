package com.example.datvexemphim.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "ghe_ngoi")
public class GheNgoi {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @ColumnDefault("newsequentialid()")
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "phong_chieu_id")
    private UUID phongChieuId;

    @Column(name = "loai_ghe_id")
    private UUID loaiGheId;

    @Column(name = "ma_ghe")
    private String maGhe;

    @Column(name = "hang_ghe")
    private String hangGhe;

    @Column(name = "so_thu_tu")
    private Integer soThuTu;

    @Column(name = "trang_thai")
    private Integer trangThai;

}

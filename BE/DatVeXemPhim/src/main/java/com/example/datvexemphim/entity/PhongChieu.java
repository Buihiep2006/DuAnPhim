package com.example.datvexemphim.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "phong_chieu")
public class PhongChieu {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @ColumnDefault("newsequentialid()")
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "rap_chieu_id")
    private UUID rapChieuId;

    @Column(name = "ma")
    private String ma;

    @Column(name = "ten")
    private String ten;

    @Column(name = "suc_chua")
    private Integer sucChua;

    @Column(name = "loai_may_chieu")
    private Integer loaiMayChieu;

    @Column(name = "trang_thai")
    private Integer trangThai;

}

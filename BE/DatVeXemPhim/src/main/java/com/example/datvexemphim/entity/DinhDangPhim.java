package com.example.datvexemphim.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;
import java.math.BigDecimal;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "dinh_dang_phim")
public class DinhDangPhim {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @ColumnDefault("newsequentialid()")
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "ma")
    private String ma;

    @Column(name = "ten")
    private String ten;

    @Column(name = "phu_thu")
    private BigDecimal phuThu;

    @Column(name = "trang_thai")
    private Integer trangThai;

}

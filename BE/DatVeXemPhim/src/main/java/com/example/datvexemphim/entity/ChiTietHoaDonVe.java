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
@Table(name = "chi_tiet_hoa_don_ve")
public class ChiTietHoaDonVe {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @ColumnDefault("newsequentialid()")
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "hoa_don_id")
    private UUID hoaDonId;

    @Column(name = "ve_ban_id")
    private UUID veBanId;

    @Column(name = "thanh_tien")
    private BigDecimal thanhTien;

}

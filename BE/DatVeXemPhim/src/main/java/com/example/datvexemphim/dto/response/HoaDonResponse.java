package com.example.datvexemphim.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class HoaDonResponse {
    private UUID id;
    private UUID khachHangId;
    private UUID nhanVienId;
    private UUID khuyenMaiId;
    private String maHoaDon;
    private BigDecimal tongTienBanDau;
    private BigDecimal soTienGiam;
    private BigDecimal tongTienThanhToan;
    private Integer diemThuongSuDung;
    private Integer diemThuongNhanDuoc;
    private LocalDateTime thoiGianTao;
    private LocalDateTime thoiGianHetHanGiuGhe;
    private Integer trangThai;
}

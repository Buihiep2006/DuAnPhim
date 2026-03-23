package com.example.datvexemphim.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class HoaDonRequest {
    @NotNull(message = "Không được để trống")
    private UUID khachHangId;
    private UUID nhanVienId;
    @NotNull(message = "Không được để trống")
    private UUID khuyenMaiId;
    @NotBlank(message = "Không được để trống")
    private String maHoaDon;
    @NotNull(message = "Không được để trống")
    private BigDecimal tongTienBanDau;
    private BigDecimal soTienGiam;
    @NotNull(message = "Không được để trống")
    private BigDecimal tongTienThanhToan;
    private Integer diemThuongSuDung;
    @NotNull(message = "Không được để trống")
    private Integer diemThuongNhanDuoc;
    private LocalDateTime thoiGianTao;
    @NotNull(message = "Không được để trống")
    private LocalDateTime thoiGianHetHanGiuGhe;
    private Integer trangThai;
}

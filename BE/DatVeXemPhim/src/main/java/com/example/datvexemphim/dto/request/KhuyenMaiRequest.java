package com.example.datvexemphim.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Data
public class KhuyenMaiRequest {
    @NotBlank(message = "Không được để trống")
    private String maCode;
    private String ten;
    @NotNull(message = "Không được để trống")
    private Integer phanTramGiam;
    private BigDecimal giamToiDa;
    @NotNull(message = "Không được để trống")
    private Integer soLuong;
    private LocalDateTime thoiGianBatDau;
    @NotNull(message = "Không được để trống")
    private LocalDateTime thoiGianKetThuc;
    @NotBlank(message = "Không được để trống")
    private String moTa;
    @NotNull(message = "Không được để trống")
    private Integer trangThai;
}

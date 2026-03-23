package com.example.datvexemphim.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class GiaoDichThanhToanRequest {
    @NotNull(message = "Không được để trống")
    private UUID hoaDonId;
    @NotBlank(message = "Không được để trống")
    private String phuongThuc;
    private String maGiaoDichBenThu3;
    @NotNull(message = "Không được để trống")
    private BigDecimal soTienGiaoDich;
    private LocalDateTime thoiGianGiaoDich;
    @NotNull(message = "Không được để trống")
    private Integer trangThai;
}

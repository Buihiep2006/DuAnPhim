package com.example.datvexemphim.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class SuatChieuRequest {
    @NotNull(message = "Không được để trống")
    private UUID phimId;
    private UUID phongChieuId;
    @NotNull(message = "Không được để trống")
    private UUID dinhDangPhimId;
    @NotBlank(message = "Không được để trống")
    private String ma;
    @NotNull(message = "Không được để trống")
    private LocalDateTime thoiGianBatDau;
    private LocalDateTime thoiGianKetThuc;
    @NotNull(message = "Không được để trống")
    private BigDecimal giaVeCoBan;
    private Integer trangThai;
    @NotNull(message = "Không được để trống")
    private LocalDateTime ngayTao;
}

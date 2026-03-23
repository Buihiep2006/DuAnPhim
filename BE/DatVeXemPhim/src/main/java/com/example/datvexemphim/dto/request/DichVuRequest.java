package com.example.datvexemphim.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class DichVuRequest {
    @NotNull(message = "Không được để trống")
    private UUID loaiDichVuId;
    @NotBlank(message = "Không được để trống")
    private String ma;
    private String ten;
    @NotNull(message = "Không được để trống")
    private BigDecimal giaBan;
    @NotBlank(message = "Không được để trống")
    private String hinhAnh;
    private String moTa;
    @NotNull(message = "Không được để trống")
    private Integer trangThai;
}

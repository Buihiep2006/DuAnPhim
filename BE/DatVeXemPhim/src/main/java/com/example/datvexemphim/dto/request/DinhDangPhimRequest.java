package com.example.datvexemphim.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Data
public class DinhDangPhimRequest {
    @NotBlank(message = "Không được để trống")
    private String ma;
    private String ten;
    @NotNull(message = "Không được để trống")
    private BigDecimal phuThu;
    private Integer trangThai;
}

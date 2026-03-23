package com.example.datvexemphim.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Data
public class PhongChieuRequest {
    @NotNull(message = "Không được để trống")
    private UUID rapChieuId;
    @NotBlank(message = "Không được để trống")
    private String ma;
    private String ten;
    @NotNull(message = "Không được để trống")
    private Integer sucChua;
    private Integer loaiMayChieu;
    @NotNull(message = "Không được để trống")
    private Integer trangThai;
}

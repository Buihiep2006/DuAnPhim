package com.example.datvexemphim.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class RapChieuRequest {
    @NotBlank(message = "Không được để trống")
    private String ma;
    private String ten;
    @NotBlank(message = "Không được để trống")
    private String diaChi;
    private String khuVuc;
    @NotBlank(message = "Không được để trống")
    private String moTa;
    @NotNull(message = "Không được để trống")
    private Integer trangThai;
}

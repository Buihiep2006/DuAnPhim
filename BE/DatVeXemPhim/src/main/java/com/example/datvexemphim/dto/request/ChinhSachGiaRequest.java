package com.example.datvexemphim.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.math.BigDecimal;

@Data
public class ChinhSachGiaRequest {
    @NotBlank(message = "Không được để trống")
    private String ma;
    private String tenChinhSach;
    @NotNull(message = "Không được để trống")
    private Integer ngayTrongTuan;
    private LocalTime khungGioBatDau;
    @NotNull(message = "Không được để trống")
    private LocalTime khungGioKetThuc;
    private BigDecimal phanTramDieuChinh;
    @NotNull(message = "Không được để trống")
    private BigDecimal phuThuCoDinh;
    private Integer uuTien;
    @NotNull(message = "Không được để trống")
    private Integer trangThai;
    private LocalDateTime ngayTao;
}

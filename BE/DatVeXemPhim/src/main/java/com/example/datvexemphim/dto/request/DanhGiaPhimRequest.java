package com.example.datvexemphim.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class DanhGiaPhimRequest {
    @NotNull(message = "Không được để trống")
    private UUID phimId;
    private UUID khachHangId;
    @NotNull(message = "Không được để trống")
    private Integer diemSo;
    @NotBlank(message = "Không được để trống")
    private String binhLuan;
    @NotNull(message = "Không được để trống")
    private LocalDateTime ngayTao;
}

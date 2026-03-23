package com.example.datvexemphim.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Data
public class GheNgoiRequest {
    @NotNull(message = "Không được để trống")
    private UUID phongChieuId;
    private UUID loaiGheId;
    @NotBlank(message = "Không được để trống")
    private String maGhe;
    private String hangGhe;
    @NotNull(message = "Không được để trống")
    private Integer soThuTu;
    private Integer trangThai;
}

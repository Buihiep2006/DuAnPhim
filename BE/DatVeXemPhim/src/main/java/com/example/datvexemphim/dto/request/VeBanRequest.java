package com.example.datvexemphim.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class VeBanRequest {
    @NotNull(message = "Không được để trống")
    private UUID suatChieuId;
    private UUID gheNgoiId;
    @NotBlank(message = "Không được để trống")
    private String maVe;
    @NotNull(message = "Không được để trống")
    private BigDecimal giaVeThucTe;
    private LocalDateTime thoiGianCheckIn;
    @NotNull(message = "Không được để trống")
    private Integer trangThai;
}

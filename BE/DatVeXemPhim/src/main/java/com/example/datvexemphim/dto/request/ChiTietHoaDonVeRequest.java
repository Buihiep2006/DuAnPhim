package com.example.datvexemphim.dto.request;

import lombok.Data;import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class ChiTietHoaDonVeRequest {
    @NotNull(message = "Không được để trống")
    private UUID hoaDonId;
    private UUID veBanId;
    @NotNull(message = "Không được để trống")
    private BigDecimal thanhTien;
}

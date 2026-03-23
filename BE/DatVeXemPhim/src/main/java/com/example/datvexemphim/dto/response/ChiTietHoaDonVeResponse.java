package com.example.datvexemphim.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class ChiTietHoaDonVeResponse {
    private UUID id;
    private UUID hoaDonId;
    private UUID veBanId;
    private BigDecimal thanhTien;
}

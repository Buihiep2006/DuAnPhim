package com.example.datvexemphim.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class ChiTietHoaDonDichVuResponse {
    private UUID id;
    private UUID hoaDonId;
    private UUID dichVuId;
    private Integer soLuong;
    private BigDecimal donGia;
    private BigDecimal thanhTien;
}

package com.example.datvexemphim.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class GiaoDichThanhToanResponse {
    private UUID id;
    private UUID hoaDonId;
    private String phuongThuc;
    private String maGiaoDichBenThu3;
    private BigDecimal soTienGiaoDich;
    private LocalDateTime thoiGianGiaoDich;
    private Integer trangThai;
}

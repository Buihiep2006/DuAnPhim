package com.example.datvexemphim.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class VeBanResponse {
    private UUID id;
    private UUID suatChieuId;
    private UUID gheNgoiId;
    private String maVe;
    private BigDecimal giaVeThucTe;
    private LocalDateTime thoiGianCheckIn;
    private Integer trangThai;
}

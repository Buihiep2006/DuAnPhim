package com.example.datvexemphim.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class KhuyenMaiResponse {
    private UUID id;
    private String maCode;
    private String ten;
    private Integer phanTramGiam;
    private BigDecimal giamToiDa;
    private Integer soLuong;
    private LocalDateTime thoiGianBatDau;
    private LocalDateTime thoiGianKetThuc;
    private String moTa;
    private Integer trangThai;
}

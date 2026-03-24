package com.example.datvexemphim.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    private UUID khachHangId;
    private UUID suatChieuId;
    private UUID khuyenMaiId;
    private List<UUID> gheNgoiIds;
    private List<ServiceItem> services;
    private BigDecimal tongTienBanDau;
    private BigDecimal soTienGiam;
    private BigDecimal tongTienThanhToan;
    private Integer diemThuongSuDung;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ServiceItem {
        private UUID dichVuId;
        private Integer soLuong;
        private BigDecimal donGia;
    }
}

package com.example.datvexemphim.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingHistoryResponse {
    private UUID id;
    private String maHoaDon;
    private LocalDateTime thoiGianTao;
    private BigDecimal tongTienThanhToan;
    private Integer trangThai;
    
    private String tenPhim;
    private LocalDateTime thoiGianBatDau;
    private String tenRap;
    private String tenPhong;
    private List<String> danhSachGhe;
    private List<String> danhSachDichVu;
}

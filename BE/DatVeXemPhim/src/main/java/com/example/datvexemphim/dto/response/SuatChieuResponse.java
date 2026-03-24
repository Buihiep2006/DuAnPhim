package com.example.datvexemphim.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class SuatChieuResponse {
    private UUID id;
    private UUID phimId;
    private UUID phongChieuId;
    private UUID dinhDangPhimId;
    private String ma;
    private LocalDateTime thoiGianBatDau;
    private LocalDateTime thoiGianKetThuc;
    private BigDecimal giaVeCoBan;
    private Integer trangThai;
    private LocalDateTime ngayTao;
    
    // Display fields
    private String tenPhim;
    private String hinhAnhPoster;
    private String tenPhongChieu;
    private String tenRapChieu;
    private String diaChiRapChieu;
    private String tenDinhDangPhim;
}

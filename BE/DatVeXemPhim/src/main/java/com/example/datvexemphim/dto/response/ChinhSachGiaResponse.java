package com.example.datvexemphim.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class ChinhSachGiaResponse {
    private UUID id;
    private String ma;
    private String tenChinhSach;
    private Integer ngayTrongTuan;
    private LocalTime khungGioBatDau;
    private LocalTime khungGioKetThuc;
    private BigDecimal phanTramDieuChinh;
    private BigDecimal phuThuCoDinh;
    private Integer uuTien;
    private Integer trangThai;
    private LocalDateTime ngayTao;
}

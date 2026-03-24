package com.example.datvexemphim.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class GheNgoiResponse {
    private UUID id;
    private UUID phongChieuId;
    private UUID loaiGheId;
    private String maGhe;
    private String hangGhe;
    private Integer soThuTu;
    private Integer trangThai;
    
    // Display fields
    private String loaiGheTen;
    private java.math.BigDecimal phuThu;
}

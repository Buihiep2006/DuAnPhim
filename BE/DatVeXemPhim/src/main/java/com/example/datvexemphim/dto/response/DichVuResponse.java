package com.example.datvexemphim.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class DichVuResponse {
    private UUID id;
    private UUID loaiDichVuId;
    private String ma;
    private String ten;
    private BigDecimal giaBan;
    private String hinhAnh;
    private String moTa;
    private Integer trangThai;
}

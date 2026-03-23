package com.example.datvexemphim.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class PhongChieuResponse {
    private UUID id;
    private UUID rapChieuId;
    private String ma;
    private String ten;
    private Integer sucChua;
    private Integer loaiMayChieu;
    private Integer trangThai;
}

package com.example.datvexemphim.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class RapChieuResponse {
    private UUID id;
    private String ma;
    private String ten;
    private String diaChi;
    private String khuVuc;
    private String moTa;
    private Integer trangThai;
}

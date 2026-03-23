package com.example.datvexemphim.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class DanhGiaPhimResponse {
    private UUID id;
    private UUID phimId;
    private UUID khachHangId;
    private Integer diemSo;
    private String binhLuan;
    private LocalDateTime ngayTao;
}

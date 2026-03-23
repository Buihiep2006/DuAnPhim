package com.example.datvexemphim.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class LoaiGheResponse {
    private UUID id;
    private String ma;
    private String ten;
    private BigDecimal phuThu;
}

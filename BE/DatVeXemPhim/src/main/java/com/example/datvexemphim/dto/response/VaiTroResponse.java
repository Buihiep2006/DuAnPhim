package com.example.datvexemphim.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class VaiTroResponse {
    private UUID id;
    private String ma;
    private String ten;
}

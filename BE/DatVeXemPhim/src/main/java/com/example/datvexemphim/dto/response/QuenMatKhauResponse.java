package com.example.datvexemphim.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class QuenMatKhauResponse {
    private UUID id;
    private String email;
    private String maToken;
    private LocalDateTime thoiGianHetHan;
}

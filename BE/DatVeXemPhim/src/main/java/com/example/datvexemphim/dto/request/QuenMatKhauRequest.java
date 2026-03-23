package com.example.datvexemphim.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;


@Data
public class QuenMatKhauRequest {
    @NotBlank(message = "Không được để trống")
    private String email;
    private String maToken;
    @NotNull(message = "Không được để trống")
    private LocalDateTime thoiGianHetHan;
}

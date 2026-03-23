package com.example.datvexemphim.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DaoDienRequest {
    @Size(max = 50, message = "Mã đạo diễn không được vượt quá 50 ký tự")
    @NotBlank(message = "Không được để trống")
    private String ma;

    @NotBlank(message = "Tên đạo diễn không được để trống")
    @Size(max = 100, message = "Tên đạo diễn không được vượt quá 100 ký tự")
    @NotBlank(message = "Không được để trống")
    private String ten;
}

package com.example.datvexemphim.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class NgonNguRequest {
    @Size(max = 50, message = "Mã ngôn ngữ không được vượt quá 50 ký tự")
    @NotBlank(message = "Không được để trống")
    private String ma;

    @NotBlank(message = "Tên ngôn ngữ không được để trống")
    @Size(max = 100, message = "Tên ngôn ngữ không được vượt quá 100 ký tự")
    @NotBlank(message = "Không được để trống")
    private String ten;
}

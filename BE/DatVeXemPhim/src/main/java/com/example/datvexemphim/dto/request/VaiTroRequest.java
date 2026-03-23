package com.example.datvexemphim.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;


@Data
public class VaiTroRequest {
    @NotBlank(message = "Không được để trống")
    private String ma;
    private String ten;
}

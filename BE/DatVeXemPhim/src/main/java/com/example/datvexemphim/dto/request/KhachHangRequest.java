package com.example.datvexemphim.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Data
public class KhachHangRequest {
    @NotBlank(message = "Không được để trống")
    private String ma;
    private String hoTen;
    @NotBlank(message = "Không được để trống")
    private String email;
    private String matKhau;
    @NotNull(message = "Không được để trống")
    private LocalDate ngaySinh;
    private Integer gioiTinh;
    @NotBlank(message = "Không được để trống")
    private String soDienThoai;
    private String authProvider;
    @NotBlank(message = "Không được để trống")
    private String providerId;
    private String hinhAnhDaiDien;
    @NotNull(message = "Không được để trống")
    private Integer diemTichLuy;
    private Integer trangThai;
    @NotNull(message = "Không được để trống")
    private LocalDateTime ngayTao;
}

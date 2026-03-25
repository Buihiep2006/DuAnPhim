package com.example.datvexemphim.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Data
public class KhachHangRequest {
    private String ma;
    private String hoTen;
    @NotBlank(message = "Email không được để trống")
    private String email;
    @NotBlank(message = "Mật khẩu không được để trống")
    private String matKhau;
    private LocalDate ngaySinh;
    private Integer gioiTinh;
    private String soDienThoai;
    private String authProvider;
    private String providerId;
    private String hinhAnhDaiDien;
    private Integer diemTichLuy;
    private Integer trangThai;
    private LocalDateTime ngayTao;
}

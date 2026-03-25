package com.example.datvexemphim.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class KhachHangResponse {
    private UUID id;
    private String ma;
    private String hoTen;
    private String email;
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

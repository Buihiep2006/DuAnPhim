package com.example.datvexemphim.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class NhanVienResponse {
    private UUID id;
    private UUID vaiTroId;
    private String vaiTroMa;
    private String ma;
    private String hoTen;
    private String email;
    private LocalDate ngaySinh;
    private Integer gioiTinh;
    private String soDienThoai;
    private String hinhAnhDaiDien;
    private Integer trangThai;
    private LocalDateTime ngayTao;
}

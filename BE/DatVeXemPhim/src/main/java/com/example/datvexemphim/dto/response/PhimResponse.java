package com.example.datvexemphim.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class PhimResponse {
    private UUID id;
    private UUID phanLoaiDoTuoiId;
    private String ma;
    private String ten;
    private Integer thoiLuong;
    private LocalDateTime ngayCongChieu;
    private LocalDateTime ngayKetThuc;
    private String hinhAnhPoster;
    private String hinhAnhBanner;
    private String trailerUrl;
    private String moTa;
    private String metadata;
    private Integer trangThai;
    private LocalDateTime ngayTao;
    
    // Names and IDs for display in frontend
    private String phanLoaiDoTuoi;
    private List<String> theLoai;
    private List<UUID> theLoaiIds;
    private List<String> daoDien;
    private List<String> dienVien;
    private List<String> ngonNgu;
    private List<UUID> rapChieuIds;
}

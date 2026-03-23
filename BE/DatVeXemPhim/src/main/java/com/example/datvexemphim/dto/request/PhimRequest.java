package com.example.datvexemphim.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class PhimRequest {
    @NotNull(message = "Không được để trống")
    private UUID phanLoaiDoTuoiId;
    @NotBlank(message = "Không được để trống")
    private String ma;
    private String ten;
    @NotNull(message = "Không được để trống")
    private Integer thoiLuong;
    private LocalDateTime ngayCongChieu;
    @NotNull(message = "Không được để trống")
    private LocalDateTime ngayKetThuc;
    @NotBlank(message = "Không được để trống")
    private String hinhAnhPoster;
    private String hinhAnhBanner;
    @NotBlank(message = "Không được để trống")
    private String trailerUrl;
    private String moTa;
    @NotBlank(message = "Không được để trống")
    private String metadata;
    @NotNull(message = "Không được để trống")
    private Integer trangThai;
    private LocalDateTime ngayTao;
    
    // Lists for relationships (IDs)
    private List<UUID> theLoaiIds;
    private List<UUID> daoDienIds;
    private List<UUID> dienVienIds;
    private List<UUID> ngonNguIds;
}

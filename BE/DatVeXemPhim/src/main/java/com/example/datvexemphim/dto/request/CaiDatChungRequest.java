package com.example.datvexemphim.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import java.time.LocalTime;
import java.math.BigDecimal;

@Data
public class CaiDatChungRequest {
    @NotNull(message = "Không được để trống")
    private Integer thoiGianGiuGhe;
    private Integer thoiGianNghiSuatChieu;
    @NotNull(message = "Không được để trống")
    private LocalTime gioMoCua;
    private LocalTime gioDongCua;
    @NotNull(message = "Không được để trống")
    private BigDecimal giaVeCoBanMacDinh;
    private Integer tyLeTichDiem;
}

package com.example.datvexemphim.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalTime;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class CaiDatChungResponse {
    private UUID id;
    private Integer thoiGianGiuGhe;
    private Integer thoiGianNghiSuatChieu;
    private LocalTime gioMoCua;
    private LocalTime gioDongCua;
    private BigDecimal giaVeCoBanMacDinh;
    private Integer tyLeTichDiem;
}

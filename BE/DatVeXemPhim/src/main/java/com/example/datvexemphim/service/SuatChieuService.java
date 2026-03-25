package com.example.datvexemphim.service;

import com.example.datvexemphim.dto.request.SuatChieuRequest;
import com.example.datvexemphim.dto.response.SuatChieuResponse;

import java.util.List;
import java.util.UUID;

public interface SuatChieuService {
    List<SuatChieuResponse> getAll();
    SuatChieuResponse getById(UUID id);
    SuatChieuResponse create(SuatChieuRequest request);
    SuatChieuResponse update(UUID id, SuatChieuRequest request);
    void delete(UUID id);
    java.util.List<SuatChieuResponse> getByPhimId(UUID phimId);
    List<SuatChieuResponse> generate(UUID phimId, UUID phongChieuId, java.time.LocalDate ngayChieu, UUID dinhDangPhimId, java.time.LocalTime gioMo, java.time.LocalTime gioDong);
}

package com.example.datvexemphim.service;

import com.example.datvexemphim.dto.request.ChiTietHoaDonDichVuRequest;
import com.example.datvexemphim.dto.response.ChiTietHoaDonDichVuResponse;

import java.util.List;
import java.util.UUID;

public interface ChiTietHoaDonDichVuService {
    List<ChiTietHoaDonDichVuResponse> getAll();
    ChiTietHoaDonDichVuResponse getById(UUID id);
    ChiTietHoaDonDichVuResponse create(ChiTietHoaDonDichVuRequest request);
    ChiTietHoaDonDichVuResponse update(UUID id, ChiTietHoaDonDichVuRequest request);
    void delete(UUID id);
}

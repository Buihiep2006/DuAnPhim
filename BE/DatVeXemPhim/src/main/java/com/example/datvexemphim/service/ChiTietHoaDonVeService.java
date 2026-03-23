package com.example.datvexemphim.service;

import com.example.datvexemphim.dto.request.ChiTietHoaDonVeRequest;
import com.example.datvexemphim.dto.response.ChiTietHoaDonVeResponse;

import java.util.List;
import java.util.UUID;

public interface ChiTietHoaDonVeService {
    List<ChiTietHoaDonVeResponse> getAll();
    ChiTietHoaDonVeResponse getById(UUID id);
    ChiTietHoaDonVeResponse create(ChiTietHoaDonVeRequest request);
    ChiTietHoaDonVeResponse update(UUID id, ChiTietHoaDonVeRequest request);
    void delete(UUID id);
}

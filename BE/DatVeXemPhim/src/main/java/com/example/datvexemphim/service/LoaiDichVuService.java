package com.example.datvexemphim.service;

import com.example.datvexemphim.dto.request.LoaiDichVuRequest;
import com.example.datvexemphim.dto.response.LoaiDichVuResponse;

import java.util.List;
import java.util.UUID;

public interface LoaiDichVuService {
    List<LoaiDichVuResponse> getAll();
    LoaiDichVuResponse getById(UUID id);
    LoaiDichVuResponse create(LoaiDichVuRequest request);
    LoaiDichVuResponse update(UUID id, LoaiDichVuRequest request);
    void delete(UUID id);
}

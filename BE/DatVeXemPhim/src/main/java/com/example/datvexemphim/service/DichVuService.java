package com.example.datvexemphim.service;

import com.example.datvexemphim.dto.request.DichVuRequest;
import com.example.datvexemphim.dto.response.DichVuResponse;

import java.util.List;
import java.util.UUID;

public interface DichVuService {
    List<DichVuResponse> getAll();
    DichVuResponse getById(UUID id);
    DichVuResponse create(DichVuRequest request);
    DichVuResponse update(UUID id, DichVuRequest request);
    void delete(UUID id);
}

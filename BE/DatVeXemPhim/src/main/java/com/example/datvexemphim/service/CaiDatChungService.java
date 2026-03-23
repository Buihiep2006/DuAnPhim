package com.example.datvexemphim.service;

import com.example.datvexemphim.dto.request.CaiDatChungRequest;
import com.example.datvexemphim.dto.response.CaiDatChungResponse;

import java.util.List;
import java.util.UUID;

public interface CaiDatChungService {
    List<CaiDatChungResponse> getAll();
    CaiDatChungResponse getById(UUID id);
    CaiDatChungResponse create(CaiDatChungRequest request);
    CaiDatChungResponse update(UUID id, CaiDatChungRequest request);
    void delete(UUID id);
}

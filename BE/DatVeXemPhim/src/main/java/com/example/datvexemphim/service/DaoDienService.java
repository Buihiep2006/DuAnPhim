package com.example.datvexemphim.service;

import com.example.datvexemphim.dto.request.DaoDienRequest;
import com.example.datvexemphim.dto.response.DaoDienResponse;

import java.util.List;
import java.util.UUID;

public interface DaoDienService {
    List<DaoDienResponse> getAll();
    DaoDienResponse getById(UUID id);
    DaoDienResponse create(DaoDienRequest request);
    DaoDienResponse update(UUID id, DaoDienRequest request);
    void delete(UUID id);
}

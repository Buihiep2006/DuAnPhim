package com.example.datvexemphim.service;

import com.example.datvexemphim.dto.request.PhimRequest;
import com.example.datvexemphim.dto.response.PhimResponse;

import java.util.List;
import java.util.UUID;

public interface PhimService {
    List<PhimResponse> getAll();
    PhimResponse getById(UUID id);
    PhimResponse create(PhimRequest request);
    PhimResponse update(UUID id, PhimRequest request);
    void delete(UUID id);
}

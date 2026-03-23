package com.example.datvexemphim.service;

import com.example.datvexemphim.dto.request.PhongChieuRequest;
import com.example.datvexemphim.dto.response.PhongChieuResponse;

import java.util.List;
import java.util.UUID;

public interface PhongChieuService {
    List<PhongChieuResponse> getAll();
    PhongChieuResponse getById(UUID id);
    PhongChieuResponse create(PhongChieuRequest request);
    PhongChieuResponse update(UUID id, PhongChieuRequest request);
    void delete(UUID id);
}

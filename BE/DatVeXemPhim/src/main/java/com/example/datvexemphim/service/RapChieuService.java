package com.example.datvexemphim.service;

import com.example.datvexemphim.dto.request.RapChieuRequest;
import com.example.datvexemphim.dto.response.RapChieuResponse;

import java.util.List;
import java.util.UUID;

public interface RapChieuService {
    List<RapChieuResponse> getAll();
    RapChieuResponse getById(UUID id);
    RapChieuResponse create(RapChieuRequest request);
    RapChieuResponse update(UUID id, RapChieuRequest request);
    void delete(UUID id);
}

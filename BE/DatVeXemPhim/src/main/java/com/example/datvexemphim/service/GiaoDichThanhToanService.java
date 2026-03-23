package com.example.datvexemphim.service;

import com.example.datvexemphim.dto.request.GiaoDichThanhToanRequest;
import com.example.datvexemphim.dto.response.GiaoDichThanhToanResponse;

import java.util.List;
import java.util.UUID;

public interface GiaoDichThanhToanService {
    List<GiaoDichThanhToanResponse> getAll();
    GiaoDichThanhToanResponse getById(UUID id);
    GiaoDichThanhToanResponse create(GiaoDichThanhToanRequest request);
    GiaoDichThanhToanResponse update(UUID id, GiaoDichThanhToanRequest request);
    void delete(UUID id);
}

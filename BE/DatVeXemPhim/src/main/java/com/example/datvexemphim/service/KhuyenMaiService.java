package com.example.datvexemphim.service;

import com.example.datvexemphim.dto.request.KhuyenMaiRequest;
import com.example.datvexemphim.dto.response.KhuyenMaiResponse;

import java.util.List;
import java.util.UUID;

public interface KhuyenMaiService {
    List<KhuyenMaiResponse> getAll();
    KhuyenMaiResponse getById(UUID id);
    KhuyenMaiResponse create(KhuyenMaiRequest request);
    KhuyenMaiResponse update(UUID id, KhuyenMaiRequest request);
    void delete(UUID id);
}

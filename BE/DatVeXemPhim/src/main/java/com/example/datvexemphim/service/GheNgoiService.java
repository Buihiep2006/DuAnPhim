package com.example.datvexemphim.service;

import com.example.datvexemphim.dto.request.GheNgoiRequest;
import com.example.datvexemphim.dto.response.GheNgoiResponse;

import java.util.List;
import java.util.UUID;

public interface GheNgoiService {
    List<GheNgoiResponse> getAll();
    GheNgoiResponse getById(UUID id);
    GheNgoiResponse create(GheNgoiRequest request);
    GheNgoiResponse update(UUID id, GheNgoiRequest request);
    void delete(UUID id);
    java.util.List<GheNgoiResponse> getByPhongChieuId(UUID phongChieuId);
}

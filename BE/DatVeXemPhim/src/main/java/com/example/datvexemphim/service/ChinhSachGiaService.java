package com.example.datvexemphim.service;

import com.example.datvexemphim.dto.request.ChinhSachGiaRequest;
import com.example.datvexemphim.dto.response.ChinhSachGiaResponse;

import java.util.List;
import java.util.UUID;

public interface ChinhSachGiaService {
    List<ChinhSachGiaResponse> getAll();
    ChinhSachGiaResponse getById(UUID id);
    ChinhSachGiaResponse create(ChinhSachGiaRequest request);
    ChinhSachGiaResponse update(UUID id, ChinhSachGiaRequest request);
    void delete(UUID id);
}

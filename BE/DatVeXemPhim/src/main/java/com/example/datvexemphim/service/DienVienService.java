package com.example.datvexemphim.service;

import com.example.datvexemphim.dto.request.DienVienRequest;
import com.example.datvexemphim.dto.response.DienVienResponse;

import java.util.List;
import java.util.UUID;

public interface DienVienService {
    List<DienVienResponse> getAll();
    DienVienResponse getById(UUID id);
    DienVienResponse create(DienVienRequest request);
    DienVienResponse update(UUID id, DienVienRequest request);
    void delete(UUID id);
}

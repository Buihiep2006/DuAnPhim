package com.example.datvexemphim.service;

import com.example.datvexemphim.dto.request.NgonNguRequest;
import com.example.datvexemphim.dto.response.NgonNguResponse;

import java.util.List;
import java.util.UUID;

public interface NgonNguService {
    List<NgonNguResponse> getAll();
    NgonNguResponse getById(UUID id);
    NgonNguResponse create(NgonNguRequest request);
    NgonNguResponse update(UUID id, NgonNguRequest request);
    void delete(UUID id);
}

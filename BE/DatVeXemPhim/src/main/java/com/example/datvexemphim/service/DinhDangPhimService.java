package com.example.datvexemphim.service;

import com.example.datvexemphim.dto.request.DinhDangPhimRequest;
import com.example.datvexemphim.dto.response.DinhDangPhimResponse;

import java.util.List;
import java.util.UUID;

public interface DinhDangPhimService {
    List<DinhDangPhimResponse> getAll();
    DinhDangPhimResponse getById(UUID id);
    DinhDangPhimResponse create(DinhDangPhimRequest request);
    DinhDangPhimResponse update(UUID id, DinhDangPhimRequest request);
    void delete(UUID id);
}

package com.example.datvexemphim.service;

import com.example.datvexemphim.dto.request.QuenMatKhauRequest;
import com.example.datvexemphim.dto.response.QuenMatKhauResponse;

import java.util.List;
import java.util.UUID;

public interface QuenMatKhauService {
    List<QuenMatKhauResponse> getAll();
    QuenMatKhauResponse getById(UUID id);
    QuenMatKhauResponse create(QuenMatKhauRequest request);
    QuenMatKhauResponse update(UUID id, QuenMatKhauRequest request);
    void delete(UUID id);
}

package com.example.datvexemphim.service;

import com.example.datvexemphim.dto.request.DanhGiaPhimRequest;
import com.example.datvexemphim.dto.response.DanhGiaPhimResponse;

import java.util.List;
import java.util.UUID;

public interface DanhGiaPhimService {
    List<DanhGiaPhimResponse> getAll();
    DanhGiaPhimResponse getById(UUID id);
    DanhGiaPhimResponse create(DanhGiaPhimRequest request);
    DanhGiaPhimResponse update(UUID id, DanhGiaPhimRequest request);
    void delete(UUID id);
}

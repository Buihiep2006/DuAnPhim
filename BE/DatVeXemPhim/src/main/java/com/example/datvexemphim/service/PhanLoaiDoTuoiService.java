package com.example.datvexemphim.service;

import com.example.datvexemphim.dto.request.PhanLoaiDoTuoiRequest;
import com.example.datvexemphim.dto.response.PhanLoaiDoTuoiResponse;

import java.util.List;
import java.util.UUID;

public interface PhanLoaiDoTuoiService {
    List<PhanLoaiDoTuoiResponse> getAll();
    PhanLoaiDoTuoiResponse getById(UUID id);
    PhanLoaiDoTuoiResponse create(PhanLoaiDoTuoiRequest request);
    PhanLoaiDoTuoiResponse update(UUID id, PhanLoaiDoTuoiRequest request);
    void delete(UUID id);
}

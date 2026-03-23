package com.example.datvexemphim.service;

import com.example.datvexemphim.dto.request.TheLoaiPhimRequest;
import com.example.datvexemphim.dto.response.TheLoaiPhimResponse;

import java.util.List;
import java.util.UUID;

public interface TheLoaiPhimService {
    List<TheLoaiPhimResponse> getAll();
    TheLoaiPhimResponse getById(UUID id);
    TheLoaiPhimResponse create(TheLoaiPhimRequest request);
    TheLoaiPhimResponse update(UUID id, TheLoaiPhimRequest request);
    void delete(UUID id);
}

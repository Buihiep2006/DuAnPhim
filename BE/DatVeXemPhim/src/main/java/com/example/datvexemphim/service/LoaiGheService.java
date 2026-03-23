package com.example.datvexemphim.service;

import com.example.datvexemphim.dto.request.LoaiGheRequest;
import com.example.datvexemphim.dto.response.LoaiGheResponse;

import java.util.List;
import java.util.UUID;

public interface LoaiGheService {
    List<LoaiGheResponse> getAll();
    LoaiGheResponse getById(UUID id);
    LoaiGheResponse create(LoaiGheRequest request);
    LoaiGheResponse update(UUID id, LoaiGheRequest request);
    void delete(UUID id);
}

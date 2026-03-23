package com.example.datvexemphim.service;

import com.example.datvexemphim.dto.request.VaiTroRequest;
import com.example.datvexemphim.dto.response.VaiTroResponse;

import java.util.List;
import java.util.UUID;

public interface VaiTroService {
    List<VaiTroResponse> getAll();
    VaiTroResponse getById(UUID id);
    VaiTroResponse create(VaiTroRequest request);
    VaiTroResponse update(UUID id, VaiTroRequest request);
    void delete(UUID id);
}

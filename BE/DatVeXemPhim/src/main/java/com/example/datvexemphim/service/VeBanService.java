package com.example.datvexemphim.service;

import com.example.datvexemphim.dto.request.VeBanRequest;
import com.example.datvexemphim.dto.response.VeBanResponse;

import java.util.List;
import java.util.UUID;

public interface VeBanService {
    List<VeBanResponse> getAll();
    VeBanResponse getById(UUID id);
    VeBanResponse create(VeBanRequest request);
    VeBanResponse update(UUID id, VeBanRequest request);
    void delete(UUID id);
    java.util.List<VeBanResponse> getBySuatChieuId(UUID suatChieuId);
}

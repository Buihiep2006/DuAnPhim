package com.example.datvexemphim.service;

import com.example.datvexemphim.dto.request.NhanVienRequest;
import com.example.datvexemphim.dto.response.NhanVienResponse;

import java.util.List;
import java.util.UUID;

public interface NhanVienService {
    List<NhanVienResponse> getAll();
    NhanVienResponse getById(UUID id);
    NhanVienResponse create(NhanVienRequest request);
    NhanVienResponse update(UUID id, NhanVienRequest request);
    void delete(UUID id);
    NhanVienResponse login(String email, String matKhau);
}

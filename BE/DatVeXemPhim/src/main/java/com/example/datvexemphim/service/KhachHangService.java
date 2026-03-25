package com.example.datvexemphim.service;

import com.example.datvexemphim.dto.request.KhachHangRequest;
import com.example.datvexemphim.dto.response.KhachHangResponse;

import java.util.List;
import java.util.UUID;

public interface KhachHangService {
    List<KhachHangResponse> getAll();
    KhachHangResponse getById(UUID id);
    KhachHangResponse create(KhachHangRequest request);
    KhachHangResponse update(UUID id, KhachHangRequest request);
    void delete(UUID id);
    KhachHangResponse login(String email, String matKhau);
    KhachHangResponse loginWithGoogle(String email, String hoTen, String providerId, String hinhAnhDaiDien);
}

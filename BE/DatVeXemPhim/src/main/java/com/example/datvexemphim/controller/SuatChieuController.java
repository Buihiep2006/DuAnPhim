package com.example.datvexemphim.controller;

import com.example.datvexemphim.dto.request.SuatChieuRequest;
import com.example.datvexemphim.dto.response.ApiResponse;
import com.example.datvexemphim.dto.response.SuatChieuResponse;
import com.example.datvexemphim.service.SuatChieuService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/suat-chieu")
@CrossOrigin("*")
public class SuatChieuController {

    @Autowired
    private SuatChieuService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SuatChieuResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(service.getAll(), "Lấy danh sách thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SuatChieuResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(service.getById(id), "Lấy thông tin thành công"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SuatChieuResponse>> create(@Valid @RequestBody SuatChieuRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.create(request), "Thêm mới thành công"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SuatChieuResponse>> update(@PathVariable UUID id, @Valid @RequestBody SuatChieuRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.update(id, request), "Cập nhật thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Xóa thành công"));
    }
}

package com.example.datvexemphim.controller;

import com.example.datvexemphim.dto.request.GiaoDichThanhToanRequest;
import com.example.datvexemphim.dto.response.ApiResponse;
import com.example.datvexemphim.dto.response.GiaoDichThanhToanResponse;
import com.example.datvexemphim.service.GiaoDichThanhToanService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/giao-dich-thanh-toan")
@CrossOrigin("*")
public class GiaoDichThanhToanController {

    @Autowired
    private GiaoDichThanhToanService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<GiaoDichThanhToanResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(service.getAll(), "Lấy danh sách thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GiaoDichThanhToanResponse>> getById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(ApiResponse.success(service.getById(id), "Lấy thông tin thành công"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<GiaoDichThanhToanResponse>> create(@Valid @RequestBody GiaoDichThanhToanRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.create(request), "Thêm mới thành công"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<GiaoDichThanhToanResponse>> update(@PathVariable("id") UUID id, @Valid @RequestBody GiaoDichThanhToanRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.update(id, request), "Cập nhật thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("id") UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Xóa thành công"));
    }
}


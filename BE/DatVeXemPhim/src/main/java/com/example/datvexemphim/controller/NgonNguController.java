package com.example.datvexemphim.controller;

import com.example.datvexemphim.dto.request.NgonNguRequest;
import com.example.datvexemphim.dto.response.ApiResponse;
import com.example.datvexemphim.dto.response.NgonNguResponse;
import com.example.datvexemphim.service.NgonNguService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/ngon-ngu")
@CrossOrigin("*")
public class NgonNguController {

    @Autowired
    private NgonNguService ngonNguService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NgonNguResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(ngonNguService.getAll(), "Lấy danh sách thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NgonNguResponse>> getById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(ApiResponse.success(ngonNguService.getById(id), "Lấy thông tin thành công"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<NgonNguResponse>> create(@Valid @RequestBody NgonNguRequest request) {
        return ResponseEntity.ok(ApiResponse.success(ngonNguService.create(request), "Thêm mới thành công"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<NgonNguResponse>> update(@PathVariable("id") UUID id, @Valid @RequestBody NgonNguRequest request) {
        return ResponseEntity.ok(ApiResponse.success(ngonNguService.update(id, request), "Cập nhật thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("id") UUID id) {
        ngonNguService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Xóa thành công"));
    }
}


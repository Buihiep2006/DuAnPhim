package com.example.datvexemphim.controller;

import com.example.datvexemphim.dto.request.GheNgoiRequest;
import com.example.datvexemphim.dto.response.ApiResponse;
import com.example.datvexemphim.dto.response.GheNgoiResponse;
import com.example.datvexemphim.service.GheNgoiService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/ghe-ngoi")
@CrossOrigin("*")
public class GheNgoiController {

    @Autowired
    private GheNgoiService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<GheNgoiResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(service.getAll(), "Lấy danh sách thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GheNgoiResponse>> getById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(ApiResponse.success(service.getById(id), "Lấy thông tin thành công"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<GheNgoiResponse>> create(@Valid @RequestBody GheNgoiRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.create(request), "Thêm mới thành công"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<GheNgoiResponse>> update(@PathVariable("id") UUID id, @Valid @RequestBody GheNgoiRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.update(id, request), "Cập nhật thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("id") UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Xóa thành công"));
    }

    @GetMapping("/phong-chieu/{phongChieuId}")
    public ResponseEntity<ApiResponse<java.util.List<GheNgoiResponse>>> getByPhongChieuId(@PathVariable("phongChieuId") UUID phongChieuId) {
        return ResponseEntity.ok(ApiResponse.success(service.getByPhongChieuId(phongChieuId), "Lấy danh sách theo phòng thành công"));
    }
}


package com.example.datvexemphim.controller;

import com.example.datvexemphim.dto.request.DienVienRequest;
import com.example.datvexemphim.dto.response.ApiResponse;
import com.example.datvexemphim.dto.response.DienVienResponse;
import com.example.datvexemphim.service.DienVienService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/dien-vien")
@CrossOrigin("*")
public class DienVienController {

    @Autowired
    private DienVienService dienVienService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DienVienResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(dienVienService.getAll(), "Lấy danh sách thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DienVienResponse>> getById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(ApiResponse.success(dienVienService.getById(id), "Lấy thông tin thành công"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DienVienResponse>> create(@Valid @RequestBody DienVienRequest request) {
        return ResponseEntity.ok(ApiResponse.success(dienVienService.create(request), "Thêm mới thành công"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DienVienResponse>> update(@PathVariable("id") UUID id, @Valid @RequestBody DienVienRequest request) {
        return ResponseEntity.ok(ApiResponse.success(dienVienService.update(id, request), "Cập nhật thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("id") UUID id) {
        dienVienService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Xóa thành công"));
    }
}


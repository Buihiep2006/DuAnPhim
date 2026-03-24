package com.example.datvexemphim.controller;

import com.example.datvexemphim.dto.request.ChinhSachGiaRequest;
import com.example.datvexemphim.dto.response.ApiResponse;
import com.example.datvexemphim.dto.response.ChinhSachGiaResponse;
import com.example.datvexemphim.service.ChinhSachGiaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/chinh-sach-gia")
@CrossOrigin("*")
public class ChinhSachGiaController {

    @Autowired
    private ChinhSachGiaService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ChinhSachGiaResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(service.getAll(), "Lấy danh sách thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ChinhSachGiaResponse>> getById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(ApiResponse.success(service.getById(id), "Lấy thông tin thành công"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ChinhSachGiaResponse>> create(@Valid @RequestBody ChinhSachGiaRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.create(request), "Thêm mới thành công"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ChinhSachGiaResponse>> update(@PathVariable("id") UUID id, @Valid @RequestBody ChinhSachGiaRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.update(id, request), "Cập nhật thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("id") UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Xóa thành công"));
    }
}


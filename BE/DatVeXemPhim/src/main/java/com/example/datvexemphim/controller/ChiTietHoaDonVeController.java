package com.example.datvexemphim.controller;

import com.example.datvexemphim.dto.request.ChiTietHoaDonVeRequest;
import com.example.datvexemphim.dto.response.ApiResponse;
import com.example.datvexemphim.dto.response.ChiTietHoaDonVeResponse;
import com.example.datvexemphim.service.ChiTietHoaDonVeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/chi-tiet-hoa-don-ve")
@CrossOrigin("*")
public class ChiTietHoaDonVeController {

    @Autowired
    private ChiTietHoaDonVeService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ChiTietHoaDonVeResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(service.getAll(), "Lấy danh sách thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ChiTietHoaDonVeResponse>> getById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(ApiResponse.success(service.getById(id), "Lấy thông tin thành công"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ChiTietHoaDonVeResponse>> create(@Valid @RequestBody ChiTietHoaDonVeRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.create(request), "Thêm mới thành công"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ChiTietHoaDonVeResponse>> update(@PathVariable("id") UUID id, @Valid @RequestBody ChiTietHoaDonVeRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.update(id, request), "Cập nhật thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("id") UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Xóa thành công"));
    }
}


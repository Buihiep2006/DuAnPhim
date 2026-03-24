package com.example.datvexemphim.controller;

import com.example.datvexemphim.dto.request.DanhGiaPhimRequest;
import com.example.datvexemphim.dto.response.ApiResponse;
import com.example.datvexemphim.dto.response.DanhGiaPhimResponse;
import com.example.datvexemphim.service.DanhGiaPhimService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/danh-gia-phim")
@CrossOrigin("*")
public class DanhGiaPhimController {

    @Autowired
    private DanhGiaPhimService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DanhGiaPhimResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(service.getAll(), "Lấy danh sách thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DanhGiaPhimResponse>> getById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(ApiResponse.success(service.getById(id), "Lấy thông tin thành công"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DanhGiaPhimResponse>> create(@Valid @RequestBody DanhGiaPhimRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.create(request), "Thêm mới thành công"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DanhGiaPhimResponse>> update(@PathVariable("id") UUID id, @Valid @RequestBody DanhGiaPhimRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.update(id, request), "Cập nhật thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("id") UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Xóa thành công"));
    }
}


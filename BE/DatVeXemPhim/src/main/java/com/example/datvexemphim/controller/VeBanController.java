package com.example.datvexemphim.controller;

import com.example.datvexemphim.dto.request.VeBanRequest;
import com.example.datvexemphim.dto.response.ApiResponse;
import com.example.datvexemphim.dto.response.VeBanResponse;
import com.example.datvexemphim.service.VeBanService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/ve-ban")
@CrossOrigin("*")
public class VeBanController {

    @Autowired
    private VeBanService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<VeBanResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(service.getAll(), "Lấy danh sách thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VeBanResponse>> getById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(ApiResponse.success(service.getById(id), "Lấy thông tin thành công"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<VeBanResponse>> create(@Valid @RequestBody VeBanRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.create(request), "Thêm mới thành công"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<VeBanResponse>> update(@PathVariable("id") UUID id, @Valid @RequestBody VeBanRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.update(id, request), "Cập nhật thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("id") UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Xóa thành công"));
    }

    @GetMapping("/suat-chieu/{suatChieuId}")
    public ResponseEntity<ApiResponse<java.util.List<VeBanResponse>>> getBySuatChieuId(@PathVariable("suatChieuId") UUID suatChieuId) {
        return ResponseEntity.ok(ApiResponse.success(service.getBySuatChieuId(suatChieuId), "Lấy danh sách theo suất chiếu thành công"));
    }
}


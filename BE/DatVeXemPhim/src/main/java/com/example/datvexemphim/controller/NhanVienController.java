package com.example.datvexemphim.controller;

import com.example.datvexemphim.dto.request.NhanVienRequest;
import com.example.datvexemphim.dto.response.ApiResponse;
import com.example.datvexemphim.dto.response.NhanVienResponse;
import com.example.datvexemphim.service.NhanVienService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/nhan-vien")
@CrossOrigin("*")
public class NhanVienController {

    @Autowired
    private NhanVienService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NhanVienResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(service.getAll(), "Lấy danh sách thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NhanVienResponse>> getById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(ApiResponse.success(service.getById(id), "Lấy thông tin thành công"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<NhanVienResponse>> create(@Valid @RequestBody NhanVienRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.create(request), "Thêm mới thành công"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<NhanVienResponse>> update(@PathVariable("id") UUID id, @Valid @RequestBody NhanVienRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.update(id, request), "Cập nhật thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("id") UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Xóa thành công"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<NhanVienResponse>> login(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        String matKhau = request.get("matKhau");
        return ResponseEntity.ok(ApiResponse.success(service.login(email, matKhau), "Đăng nhập thành công"));
    }
}


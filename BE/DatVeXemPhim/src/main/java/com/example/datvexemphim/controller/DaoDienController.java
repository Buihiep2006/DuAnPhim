package com.example.datvexemphim.controller;

import com.example.datvexemphim.dto.request.DaoDienRequest;
import com.example.datvexemphim.dto.response.ApiResponse;
import com.example.datvexemphim.dto.response.DaoDienResponse;
import com.example.datvexemphim.service.DaoDienService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/dao-dien")
@CrossOrigin("*")
public class DaoDienController {

    @Autowired
    private DaoDienService daoDienService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DaoDienResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(daoDienService.getAll(), "Lấy danh sách thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DaoDienResponse>> getById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(ApiResponse.success(daoDienService.getById(id), "Lấy thông tin thành công"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DaoDienResponse>> create(@Valid @RequestBody DaoDienRequest request) {
        return ResponseEntity.ok(ApiResponse.success(daoDienService.create(request), "Thêm mới thành công"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DaoDienResponse>> update(@PathVariable("id") UUID id, @Valid @RequestBody DaoDienRequest request) {
        return ResponseEntity.ok(ApiResponse.success(daoDienService.update(id, request), "Cập nhật thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("id") UUID id) {
        daoDienService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Xóa thành công"));
    }
}


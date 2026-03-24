package com.example.datvexemphim.controller;

import com.example.datvexemphim.dto.request.TheLoaiPhimRequest;
import com.example.datvexemphim.dto.response.ApiResponse;
import com.example.datvexemphim.dto.response.TheLoaiPhimResponse;
import com.example.datvexemphim.service.TheLoaiPhimService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/the-loai")
@CrossOrigin("*")
public class TheLoaiPhimController {

    @Autowired
    private TheLoaiPhimService theLoaiPhimService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TheLoaiPhimResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(theLoaiPhimService.getAll(), "Lấy danh sách thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TheLoaiPhimResponse>> getById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(ApiResponse.success(theLoaiPhimService.getById(id), "Lấy thông tin thành công"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TheLoaiPhimResponse>> create(@Valid @RequestBody TheLoaiPhimRequest request) {
        return ResponseEntity.ok(ApiResponse.success(theLoaiPhimService.create(request), "Thêm mới thành công"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TheLoaiPhimResponse>> update(@PathVariable("id") UUID id, @Valid @RequestBody TheLoaiPhimRequest request) {
        return ResponseEntity.ok(ApiResponse.success(theLoaiPhimService.update(id, request), "Cập nhật thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("id") UUID id) {
        theLoaiPhimService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Xóa thành công"));
    }
}


package com.example.datvexemphim.controller;

import com.example.datvexemphim.dto.request.HoaDonRequest;
import com.example.datvexemphim.dto.response.ApiResponse;
import com.example.datvexemphim.dto.response.HoaDonResponse;
import com.example.datvexemphim.service.HoaDonService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/hoa-don")
@CrossOrigin("*")
public class HoaDonController {

    @Autowired
    private HoaDonService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<HoaDonResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(service.getAll(), "Lấy danh sách thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HoaDonResponse>> getById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(ApiResponse.success(service.getById(id), "Lấy thông tin thành công"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<HoaDonResponse>> create(@Valid @RequestBody HoaDonRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.create(request), "Thêm mới thành công"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<HoaDonResponse>> update(@PathVariable("id") UUID id, @Valid @RequestBody HoaDonRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.update(id, request), "Cập nhật thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("id") UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Xóa thành công"));
    }

    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<HoaDonResponse>> checkout(@Valid @RequestBody com.example.datvexemphim.dto.request.BookingRequest request) {
        return ResponseEntity.ok(ApiResponse.success(service.checkout(request), "Thanh toán thành công"));
    }

    @GetMapping("/khach-hang/{khachHangId}")
    public ResponseEntity<ApiResponse<java.util.List<com.example.datvexemphim.dto.response.BookingHistoryResponse>>> getBookingHistory(@PathVariable("khachHangId") java.util.UUID khachHangId) {
        return ResponseEntity.ok(ApiResponse.success(service.getBookingHistory(khachHangId), "Lấy lịch sử đặt vé thành công"));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancel(@PathVariable("id") UUID id) {
        service.cancel(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Hủy vé thành công"));
    }
}

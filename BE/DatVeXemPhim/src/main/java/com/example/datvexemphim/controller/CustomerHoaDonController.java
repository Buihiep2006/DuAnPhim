package com.example.datvexemphim.controller;

import com.example.datvexemphim.dto.request.BookingRequest;
import com.example.datvexemphim.dto.response.ApiResponse;
import com.example.datvexemphim.dto.response.BookingHistoryResponse;
import com.example.datvexemphim.dto.response.HoaDonResponse;
import com.example.datvexemphim.security.AuthenticatedUser;
import com.example.datvexemphim.service.HoaDonService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/customer/hoa-don")
@CrossOrigin("*")
public class CustomerHoaDonController {

    @Autowired
    private HoaDonService hoaDonService;

    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<HoaDonResponse>> checkout(@Valid @RequestBody BookingRequest request) {
        return ResponseEntity.ok(ApiResponse.success(hoaDonService.checkout(request), "Thanh toan thanh cong"));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<BookingHistoryResponse>>> getHistory(Authentication authentication) {
        AuthenticatedUser user = (AuthenticatedUser) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(hoaDonService.getBookingHistory(user.getUserId()), "Lay lich su dat ve thanh cong"));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancel(@PathVariable UUID id) {
        hoaDonService.cancel(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Huy ve thanh cong"));
    }
}

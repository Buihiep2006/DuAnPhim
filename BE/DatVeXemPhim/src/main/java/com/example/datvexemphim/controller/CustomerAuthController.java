package com.example.datvexemphim.controller;

import com.example.datvexemphim.dto.request.KhachHangRequest;
import com.example.datvexemphim.dto.response.ApiResponse;
import com.example.datvexemphim.dto.response.AuthResponse;
import com.example.datvexemphim.dto.response.KhachHangResponse;
import com.example.datvexemphim.security.AuthTokenService;
import com.example.datvexemphim.service.KhachHangService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer/auth")
@CrossOrigin("*")
public class CustomerAuthController {

    @Autowired private KhachHangService khachHangService;
    @Autowired private AuthTokenService authTokenService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<KhachHangResponse>> register(@Valid @RequestBody KhachHangRequest request) {
        return ResponseEntity.ok(ApiResponse.success(khachHangService.create(request), "Dang ky thanh cong"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse<KhachHangResponse>>> login(@RequestBody java.util.Map<String, String> request) {
        KhachHangResponse user = khachHangService.login(request.get("email"), request.get("matKhau"));
        AuthResponse<KhachHangResponse> response = AuthResponse.<KhachHangResponse>builder()
                .token(authTokenService.generateToken(user.getId(), "CUSTOMER"))
                .user(user)
                .build();
        return ResponseEntity.ok(ApiResponse.success(response, "Dang nhap thanh cong"));
    }
}
